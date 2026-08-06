import { useEffect, useRef, useState } from "react";

const TOLERANCE_PCT = 0.05; // ±5% per Gate 2 definition in T11(JJ)
const PARSE_BUDGET_MS = 420; // stays under the <500ms token parsing requirement
const TELEMETRY_ENDPOINT = "http://localhost:5000/api/v1/telemetry";
const POLL_INTERVAL_MS = 300; // streaming cadence, keeps round-trip + eval under the 500ms budget

/**
 * Streams Sergii's live telemetry payload from TELEMETRY_ENDPOINT and runs it
 * through Gate 1 (identity match) -> Gate 2 (weigh-in-motion reconcile) ->
 * Gate 3 (compliance) on every poll tick.
 *
 * NOTE: this now requires a real server answering GET TELEMETRY_ENDPOINT with
 * a JSON body shaped like mockPayload.js (ocr_feed / rfid_scan / wim_scales /
 * manifest). There is no local fallback — if the endpoint is unreachable the
 * hook surfaces status "ERROR" rather than silently reverting to mock data.
 */
export function useMockPayload() {
  const [payload, setPayload] = useState(null);
  const [parseMs, setParseMs] = useState(null);
  const [status, setStatus] = useState("CONNECTING");
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let pollTimer;

    async function pollOnce() {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const start = performance.now();
      try {
        const res = await fetch(TELEMETRY_ENDPOINT, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`Telemetry endpoint returned ${res.status}`);

        const raw = await res.json();
        if (cancelled) return;

        const evaluated = evaluateGates(raw);
        const elapsed = Math.round(performance.now() - start);

        setPayload(evaluated);
        setParseMs(elapsed);
        setStatus(elapsed <= PARSE_BUDGET_MS ? "EVALUATED" : "LATENCY_BREACH");
        setError(null);
      } catch (err) {
        if (cancelled || err.name === "AbortError") return;
        setStatus("ERROR");
        setError(err.message);
      } finally {
        if (!cancelled) pollTimer = setTimeout(pollOnce, POLL_INTERVAL_MS);
      }
    }

    pollOnce();

    return () => {
      cancelled = true;
      clearTimeout(pollTimer);
      abortRef.current?.abort();
    };
  }, []);

  return { payload, parseMs, status, error, parseBudgetMs: PARSE_BUDGET_MS };
}

function evaluateGates(raw) {
  const gate1Pass = Boolean(
    raw.ocr_feed?.vehicle_plate_string && raw.rfid_scan?.driver_token_id
  );

  const declared = raw.manifest?.gross_weight_declared_kg ?? 0;
  const measured = raw.wim_scales?.total_gross_mass_kg ?? 0;
  const deltaPct = declared > 0 ? Math.abs(measured - declared) / declared : 1;
  const gate2Pass = gate1Pass && deltaPct <= TOLERANCE_PCT;

  const gate3Pass =
    gate2Pass && raw.manifest?.customs_clearance_status === "CLEARED";

  // Financial & carbon cost-savings calculation (Cost_Total analytics)
  const BASELINE_DELAY_HOURS = 42.5; // Dorohusk queue baseline
  const HOURLY_IDLE_COST_EUR = 32.75; // C_driver (€16.50) + C_depreciation (€12.50) + C_fuel_idle (€3.75)
  const CO2_KG_PER_HOUR = 6.5; // Reefer diesel burn Scope 3 emissions
  const CARBON_QUOTA_EUR_PER_TON = 80.0; // EU ETS carbon price

  const hoursSaved = gate3Pass ? BASELINE_DELAY_HOURS - 0.0083 : 0;
  const costSavedEur = hoursSaved * HOURLY_IDLE_COST_EUR;
  const co2AvoidedKg = hoursSaved * CO2_KG_PER_HOUR;
  const carbonPenaltySavedEur = (co2AvoidedKg / 1000) * CARBON_QUOTA_EUR_PER_TON;

  return {
    ...raw,
    gates: {
      gate1_identity: gate1Pass ? "PASS" : "SECURITY_ALERT",
      gate2_weight: !gate1Pass
        ? "BLOCKED"
        : gate2Pass
        ? "PASS"
        : "WEIGHT_OVERLOAD_ANOMALY",
      gate3_compliance: !gate2Pass ? "BLOCKED" : gate3Pass ? "PASS" : "ADMINISTRATIVE_HOLD",
    },
    delta_pct: deltaPct,
    t_delay_hours: gate3Pass ? 0.0083 : null,
    analytics: {
      hourly_idle_cost_eur: HOURLY_IDLE_COST_EUR,
      cost_total_saved_eur: Number(costSavedEur.toFixed(2)),
      co2_avoided_kg: Number(co2AvoidedKg.toFixed(1)),
      carbon_penalty_saved_eur: Number(carbonPenaltySavedEur.toFixed(2)),
    },
  };
}
