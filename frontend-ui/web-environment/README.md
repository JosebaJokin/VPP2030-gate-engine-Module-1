# KM60 Corridor Gate Monitor — Frontend UI

Vite + React app for the Visualization Specialist track, Zone 2 layout.

## Setup
```
npm install
npm run dev
```

## Live telemetry
`src/hooks/useMockPayload.js` now polls a real endpoint instead of reading
static mock data:

```
GET http://localhost:5000/api/v1/telemetry
```

- Polls every 300ms (`POLL_INTERVAL_MS`), well under the sub-500ms budget
  (`PARSE_BUDGET_MS = 420`) required for real-time queue latency rendering.
- The endpoint must return JSON shaped like `src/data/mockPayload.js`
  (`ocr_feed` / `rfid_scan` / `wim_scales` / `manifest`) — that file is kept
  around purely as the schema reference, it is no longer imported by `App.jsx`.
- Each poll re-runs Gate 1 → Gate 2 → Gate 3 from T11(JJ) against whatever the
  endpoint returns, plus the Cost_Total / CO₂ analytics.
- Connection states surfaced in the header: `CONNECTING`, `EVALUATED` (live,
  within budget), `LATENCY_BREACH` (response took longer than 420ms), and
  `ERROR` (endpoint unreachable — no silent fallback to mock data).

## Known gaps / things to confirm before demo day
- **No server has been running at `localhost:5000` in this environment**, so
  the live-fetch path is implemented and builds cleanly but has not been
  exercised against a real response. Confirm the actual response shape,
  CORS headers, and whether it's plain JSON vs. SSE/WebSocket once Sergii's
  service is up — a polling `fetch` loop is not the same as a true stream,
  and if the backend is SSE/WebSocket-based this hook will need rewriting.
- The old scenario toggle (nominal vs. weight-delta vehicle) was removed
  since it only worked against static mock payloads. If you still want a way
  to demo the Gate 2 failure branch without the real backend, that needs a
  small mock server or a `?mock=1` fallback mode — currently not implemented.
