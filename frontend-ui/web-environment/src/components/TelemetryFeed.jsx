import "./TelemetryFeed.css";

/**
 * Naming convention note: the three data-row keys below (ocr_feed, rfid_scan,
 * wim_scales) are intentionally identical to Sergii's JSON payload fields —
 * do not rename to camelCase or a "friendlier" label key. Gate logic in
 * useMockPayload.js reads these same keys directly off the payload.
 */
const ROWS = [
  {
    key: "ocr_feed",
    label: "OCR FEED",
    accessor: (p) => p.ocr_feed?.vehicle_plate_string,
    meta: (p) => `${p.ocr_feed?.confidence_pct ?? "--"}% conf · lane ${p.ocr_feed?.capture_lane ?? "--"}`,
  },
  {
    key: "rfid_scan",
    label: "RFID SCAN",
    accessor: (p) => p.rfid_scan?.driver_token_id,
    meta: (p) => `${p.rfid_scan?.tag_status ?? "--"} · ${p.rfid_scan?.signal_strength_dbm ?? "--"} dBm`,
  },
  {
    key: "wim_scales",
    label: "WIM SCALES",
    accessor: (p) => `${p.wim_scales?.total_gross_mass_kg?.toLocaleString() ?? "--"} kg`,
    meta: (p) =>
      `${p.wim_scales?.axle_count ?? "--"} axles · manifest ${p.manifest?.gross_weight_declared_kg?.toLocaleString() ?? "--"} kg`,
  },
];

export default function TelemetryFeed({ payload, loading }) {
  return (
    <div className="telemetry">
      <div className="telemetry__head">
        <span>Live Telemetry</span>
        <span className="telemetry__hash">
          {payload?.manifest?.manifest_id_hash ?? "awaiting hash…"}
        </span>
      </div>

      {ROWS.map((row) => (
        <div className="telemetry__row" key={row.key}>
          <span className="telemetry__label">{row.label}</span>
          {loading ? (
            <span className="telemetry__skeleton" />
          ) : (
            <>
              <span className="telemetry__value">{row.accessor(payload)}</span>
              <span className="telemetry__meta">{row.meta(payload)}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
