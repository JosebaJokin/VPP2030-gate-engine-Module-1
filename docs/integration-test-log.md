# Front-End Telemetry Integration Test — KM-60 Gate Engine

**Tester:** Visualization Specialist
**Date:** 2026-08-07
**Sources tested:** `live_server` (server.js), `shuttle_static` (km60-shuttle-telemetry.json), `preauth_static` (km60-preauth-flow.json)

## Result Summary

| Source | Parse Time (ms) | <500ms? | ocr_feed | rfid_scan | wim_scales | T_delay | Cost_Total | Overall |
|---|---|---|---|---|---|---|---|---|
| live_server | 0.088 | ✅ | ✅ | ✅ | ✅ | ✅ (20.5) | ✅ (€847.90) | **PASS** |
| shuttle_static | 0.013 | ✅ | ✅ | ✅ | ✅ | ❌ missing | ❌ missing | **FAIL** |
| preauth_static | 0.008 | ✅ | ✅ | ✅ | ✅ | ✅ (42.5) | ❌ missing | **FAIL** |

## Findings

1. **Parse/validation latency is not the risk.** All three sources parse in under 0.1ms — three orders of magnitude inside the 500ms budget. That criterion is trivially met by any JSON.parse call; it isn't a meaningful stress test on its own.
2. **Schema drift across sources is the actual risk.** `edge_telemetry` (live), `edge_telemetry_arrays` (shuttle static), and `vehicle_telemetry` (preauth static) are three different nesting conventions for the same three sensor blocks. A hook written against one breaks silently against the others unless normalized.
3. **T_delay / Cost_Total are not literal field names anywhere.** They require mapping: `T_delay` → `financial_penalty_matrix.baseline_scenario.delay_hours` (live) or `operational_environment_vectors.t_delay_hours_baseline` (preauth). `Cost_Total` → `financial_penalty_matrix.baseline_scenario.total_cost_penalty_eur`, which **only exists in the live server output** — neither static file carries a cost figure at all.
4. **Real-time update mechanism verified:** `useMockPayload.js` polls on a 2s interval via `setInterval` + `fetch`, holds state in React (`useState`), and issues no persistent DB calls — UI updates without page refresh, satisfying that criterion for the `live_server` path only.
5. **Live endpoint dependency is fragile in its current form.** `node server.js` run manually in a terminal dies when the shell session ends. If this dashboard needs to survive a demo, Sergii's server needs a process manager (`pm2`, `nohup`, or a Docker service) — not a foreground terminal command.

## Action Items

- [ ] Sergii: add `t_delay_hours_baseline` and a cost penalty block to `km60-shuttle-telemetry.json` and `km60-preauth-flow.json`, or confirm the dashboard should only read cost/delay from the live endpoint.
- [ ] Shlok/Nelia: build Figma states for the "no cost data available" case — currently the majority (2/3) of test fixtures hit it.
- [ ] Sergii: run `server.js` under a process supervisor before the jury demo, not a raw terminal session.
