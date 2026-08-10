/**
 * Front-end integration test: validates that mock telemetry payloads
 * from all three known sources can be normalized into the UI shape
 * (ocr_feed, rfid_scan, wim_scales, T_delay, Cost_Total) within 500ms.
 */
const fs = require('fs');
const http = require('http');

const RESULTS = [];

// ---------------------------------------------------------------------------
// Normalizer — this is the piece that was MISSING. Each source nests its
// sensor block under a different key, and none of them literally contain
// "T_delay" or "Cost_Total". This maps all three into one shape.
// ---------------------------------------------------------------------------
function normalize(source, raw) {
  let sensors, delayHours, costTotal;

  if (source === 'live_server') {
    sensors = raw.edge_telemetry;
    delayHours = raw.financial_penalty_matrix?.baseline_scenario?.delay_hours ?? null;
    costTotal = raw.financial_penalty_matrix?.baseline_scenario?.total_cost_penalty_eur ?? null;
  } else if (source === 'shuttle_static') {
    sensors = raw.edge_telemetry_arrays;
    delayHours = null; // NOT PRESENT in this file — flagged below
    costTotal = null;  // NOT PRESENT in this file — flagged below
  } else if (source === 'preauth_static') {
    sensors = raw.vehicle_telemetry;
    delayHours = raw.operational_environment_vectors?.t_delay_hours_baseline ?? null;
    costTotal = null; // preauth file has no cost penalty block at all
  }

  return {
    ocr_feed: sensors?.ocr_feed ?? null,
    rfid_scan: sensors?.rfid_scan ?? null,
    wim_scales: sensors?.wim_scales ?? null,
    T_delay: delayHours,
    Cost_Total: costTotal
  };
}

function validate(source, normalized) {
  const missing = [];
  ['ocr_feed', 'rfid_scan', 'wim_scales'].forEach(k => {
    if (!normalized[k]) missing.push(k);
  });
  if (normalized.T_delay === null) missing.push('T_delay');
  if (normalized.Cost_Total === null) missing.push('Cost_Total');
  return { source, pass: missing.length === 0, missing_fields: missing };
}

function runOne(source, raw) {
  const t0 = process.hrtime.bigint();
  const normalized = normalize(source, raw);
  const t1 = process.hrtime.bigint();
  const parseMs = Number(t1 - t0) / 1e6;

  const validation = validate(source, normalized);

  RESULTS.push({
    source,
    parse_time_ms: Number(parseMs.toFixed(4)),
    under_500ms: parseMs < 500,
    ...validation,
    normalized_preview: normalized
  });
}

async function fetchLive() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:5000/api/v1/telemetry', res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

(async () => {
  // 1. Live server
  try {
    const live = await fetchLive();
    runOne('live_server', live);
  } catch (e) {
    RESULTS.push({ source: 'live_server', pass: false, error: e.message });
  }

  // 2. Static shuttle file
  const shuttleRaw = JSON.parse(
    fs.readFileSync('/mnt/user-data/uploads/km60-shuttle-telemetry.json', 'utf8')
      .replace(/^\(.*\)\s*\n/, '') // strip the leading "(Sergii's Km 60...)" comment line
  );
  runOne('shuttle_static', shuttleRaw);

  // 3. Static preauth file
  const preauthRaw = JSON.parse(
    fs.readFileSync('/mnt/user-data/uploads/km60-preauth-flow.json', 'utf8')
      .replace(/^\(.*\)\s*\n/, '')
  );
  runOne('preauth_static', preauthRaw);

  console.log(JSON.stringify(RESULTS, null, 2));
  fs.writeFileSync('/home/claude/backend-engine/sandbox/test-results.json', JSON.stringify(RESULTS, null, 2));
})();
