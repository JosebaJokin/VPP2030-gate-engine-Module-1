// Mock stateless JSON payload — shape mirrors Sergii's backend contract exactly.
// Field names are load-bearing: they are read directly by GateSequenceRail /
// TelemetryFeed via the ocr_feed / rfid_scan / wim_scales keys, so do not
// rename them without updating T11(JJ) on the backend side first.

export const MOCK_PAYLOAD = {
  checkpoint_id: "KM60-A",
  timestamp_iso: new Date().toISOString(),

  ocr_feed: {
    vehicle_plate_string: "DO-RX 4471",
    confidence_pct: 98.4,
    capture_lane: "A2",
  },

  rfid_scan: {
    driver_token_id: "RFID-88213-JK",
    tag_status: "READ_OK",
    signal_strength_dbm: -42,
  },

  wim_scales: {
    total_gross_mass_kg: 38420,
    axle_count: 5,
    scale_confidence_pct: 99.1,
  },

  manifest: {
    manifest_id_hash: "0x9f2a...c71b",
    gross_weight_declared_kg: 38000,
    customs_clearance_status: "CLEARED",
  },

  gates: {
    gate1_identity: "PENDING",
    gate2_weight: "PENDING",
    gate3_compliance: "PENDING",
  },

  t_delay_hours: null,
};

// A second sample used to demo a Gate 2 failure branch (mass delta > 5%).
export const MOCK_PAYLOAD_WEIGHT_FAIL = {
  ...MOCK_PAYLOAD,
  checkpoint_id: "KM60-B",
  wim_scales: {
    total_gross_mass_kg: 41200,
    axle_count: 5,
    scale_confidence_pct: 97.8,
  },
};
