/**
 * src/hooks/useMockPayload.js
 *
 * Polls Sergii's live sandbox endpoint (http://localhost:5000/api/v1/telemetry)
 * on an interval. Falls back to a static JSON file if the live server isn't
 * running. Normalizes all known payload shapes into one UI contract so
 * ocr_feed / rfid_scan / wim_scales / T_delay / Cost_Total are always present
 * (or explicitly null, never undefined-and-silently-broken).
 *
 * No page refresh, no persistent DB — state lives in React only.
 */
import { useState, useEffect } from 'react';

const LIVE_ENDPOINT = 'http://localhost:5000/api/v1/telemetry';
const POLL_INTERVAL_MS = 2000;
// matches the documented sub-500ms decision-engine SLA (see backend-engine/docs/decision-engine-architecture.md)
const PARSE_BUDGET_MS = 500;

// --- normalizer: mirrors backend-engine/sandbox/integration-test.js -------
function normalizePayload(raw) {
  // live server shape
  if (raw.edge_telemetry) {
    const s = raw.edge_telemetry;
    const fin = raw.financial_penalty_matrix?.baseline_scenario;
    const netSavings = raw.financial_penalty_matrix?.net_savings_per_transit_eur;
    return {
      ocr_feed: s.ocr_feed ?? null,
      rfid_scan: s.rfid_scan ?? null,
      wim_scales: s.wim_scales ?? null,
      manifest: { manifest_id_hash: raw.manifest_id_hash ?? null, gross_weight_declared_kg: null },
      analytics: netSavings != null ? { cost_total_saved_eur: netSavings, co2_avoided_kg: null } : null,
      t_delay_hours: fin?.delay_hours ?? null,
      T_delay: fin?.delay_hours ?? null,
      Cost_Total: fin?.total_cost_penalty_eur ?? null,
      source: 'live_server'
    };
  }
  // shuttle static shape
  if (raw.edge_telemetry_arrays) {
    const s = raw.edge_telemetry_arrays;
    return {
      ocr_feed: s.ocr_feed ?? null,
      rfid_scan: s.rfid_scan ?? null,
      wim_scales: s.wim_scales ?? null,
      manifest: null,
      analytics: null,
      t_delay_hours: null,
      T_delay: null,   // not present in this file — see integration test log
      Cost_Total: null, // not present in this file — see integration test log
      source: 'shuttle_static'
    };
  }
  // preauth static shape
  if (raw.vehicle_telemetry) {
    const s = raw.vehicle_telemetry;
    const tDelay = raw.operational_environment_vectors?.t_delay_hours_baseline ?? null;
    return {
      ocr_feed: s.ocr_feed ?? null,
      rfid_scan: s.rfid_scan ?? null,
      wim_scales: s.wim_scales ?? null,
      manifest: { manifest_id_hash: s.rfid_scan?.manifest_id_hash ?? null, gross_weight_declared_kg: null },
      analytics: null,
      t_delay_hours: tDelay,
      T_delay: tDelay,
      Cost_Total: null, // no cost block in this file
      source: 'preauth_static'
    };
  }
  return {
    ocr_feed: null, rfid_scan: null, wim_scales: null,
    manifest: null, analytics: null, t_delay_hours: null,
    T_delay: null, Cost_Total: null, source: 'unknown'
  };
}

export function useMockPayload({ staticFallbackUrl = null } = {}) {
  const [data, setData] = useState(null);
  const [parseTimeMs, setParseTimeMs] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOnce() {
      const t0 = performance.now();
      console.log("fetch function called");
      try {
        console.log("fetch attempted")
        const res = await fetch(LIVE_ENDPOINT, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();
        const normalized = normalizePayload(raw);
        setData(normalized);
        setParseTimeMs(performance.now() - t0);
        setConnected(true);
        setError(null);
      } catch (liveErr) {
        // fall back to static file if provided
        console.log("fetch error")
        if (staticFallbackUrl) {
          try {
            const res = await fetch(staticFallbackUrl, { cache: 'no-store' });
            const raw = await res.json();
            const normalized = normalizePayload(raw);
            setData(normalized);
            setParseTimeMs(performance.now() - t0);
            setConnected(false); // reachable, but not live
            setError(null);
            return;
          } catch (fallbackErr) {
            setError(fallbackErr.message);
          }
        } else {
          setError(liveErr.message);
        }
        setConnected(false);
      }
    }

    fetchOnce();
  }, [staticFallbackUrl]);

  const status = error
    ? "ERROR"
    : data === null
    ? "CONNECTING"
    : parseTimeMs != null && parseTimeMs > PARSE_BUDGET_MS
    ? "LATENCY_BREACH"
    : "EVALUATED";

  return { payload: data, parseMs: parseTimeMs, parseBudgetMs: PARSE_BUDGET_MS, connected, error, status };
}
