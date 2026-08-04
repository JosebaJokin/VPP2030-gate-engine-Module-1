/**
 * ============================================================================
 * PROJECT: Ukranian-Polish Corridor | Gate Engine Sandbox Generator
 * MODULE: backend-engine/sandbox/server.js (VPP2030-30)
 * AUTHOR: Sergii (Backend Physics & Cryptography Lead)
 * GOVERNANCE: Shadow Mode (governance_loop_active = TRUE)
 * ============================================================================
 */

const http = require('http');
const crypto = require('crypto');

const PORT = 5000;

// ----------------------------------------------------------------------------
// 📊 GLOBAL EMPIRICAL CONSTANTS
// ----------------------------------------------------------------------------
const CONSTANTS = {
  CHECKPOINT_ID: 'DOROHUSK_01',
  BASELINE_DELAY_HOURS: 20.5,
  LATENCY_REDUCTION_DELTA_HOURS: 29.85,
  DRIVER_HOURLY_COST_EUR: 22.50,
  VEHICLE_DEPRECIATION_PER_HOUR_EUR: 14.20,
  IDLE_FUEL_CONSUMPTION_L_PER_HOUR: 2.50, // Auxiliary reefer diesel burn
  DIESEL_EMISSION_FACTOR_KG_CO2_PER_L: 2.68,
  EU_ETS_CARBON_PRICE_EUR_PER_TON: 80.00
};

// ----------------------------------------------------------------------------
// 🧮 PHYSICS & FINANCIAL PENALTY CALCULATOR
// ----------------------------------------------------------------------------
function calculateCostPenalties(delayHours) {
  const driverCost = delayHours * CONSTANTS.DRIVER_HOURLY_COST_EUR;
  const depreciationCost = delayHours * CONSTANTS.VEHICLE_DEPRECIATION_PER_HOUR_EUR;
  
  // Diesel Fuel Burn & Environmental Emissions
  const fuelBurnedLiters = delayHours * CONSTANTS.IDLE_FUEL_CONSUMPTION_L_PER_HOUR;
  const carbonEmittedKg = fuelBurnedLiters * CONSTANTS.DIESEL_EMISSION_FACTOR_KG_CO2_PER_L;
  const carbonEmittedTons = carbonEmittedKg / 1000.0;
  const carbonCostEur = carbonEmittedTons * CONSTANTS.EU_ETS_CARBON_PRICE_EUR_PER_TON;
  
  const totalCostPenaltyEur = driverCost + depreciationCost + (fuelBurnedLiters * 1.65) + carbonCostEur;

  return {
    delay_hours: Number(delayHours.toFixed(2)),
    driver_wage_loss_eur: Number(driverCost.toFixed(2)),
    vehicle_depreciation_eur: Number(depreciationCost.toFixed(2)),
    idle_fuel_burned_liters: Number(fuelBurnedLiters.toFixed(2)),
    carbon_emitted_kg: Number(carbonEmittedKg.toFixed(2)),
    carbon_ets_fee_eur: Number(carbonCostEur.toFixed(2)),
    total_cost_penalty_eur: Number(totalCostPenaltyEur.toFixed(2))
  };
}

// ----------------------------------------------------------------------------
// 🎲 MOCK HARDWARE TELEMETRY GENERATOR
// ----------------------------------------------------------------------------
function generateMockTelemetryPayload() {
  const timestamp = new Date().toISOString();
  const rawContainerId = `CONT-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Anonymized Cryptographic SHA-256 Manifest Hash
  const manifestIdHash = crypto
    .createHash('sha256')
    .update(`${rawContainerId}-${timestamp}`)
    .digest('hex');

  const randomPlateNum = Math.floor(1000 + Math.random() * 9000);
  const grossMassKg = Math.floor(28000 + Math.random() * 12000); // 28 - 40 Tons
  
  const baselineMetrics = calculateCostPenalties(CONSTANTS.BASELINE_DELAY_HOURS);
  const optimizedMetrics = calculateCostPenalties(
    CONSTANTS.BASELINE_DELAY_HOURS - CONSTANTS.LATENCY_REDUCTION_DELTA_HOURS
  );

  return {
    governance_loop_active: true, // Read-Only Shadow Mode Enforced
    checkpoint_id: CONSTANTS.CHECKPOINT_ID,
    timestamp: timestamp,
    manifest_id_hash: manifestIdHash,
    
    // Peripheral Hardware Sensors (Shlok API Bridge Contract)
    edge_telemetry: {
      ocr_feed: {
        license_plate: `LU-${randomPlateNum}-X`,
        camera_id: 'CAM_GATE_01',
        confidence_score: 0.985
      },
      rfid_scan: {
        driver_id_token: `DRV-TK-${Math.floor(100 + Math.random() * 900)}`,
        reader_status: 'ACTIVE'
      },
      wim_scales: {
        gross_mass_kg: grossMassKg,
        axle_count: 5,
        overweight_flag: grossMassKg > 38000
      }
    },

    // Latency & Financial Penalty Analytics
    financial_penalty_matrix: {
      baseline_scenario: baselineMetrics,
      optimized_scenario: optimizedMetrics,
      net_savings_per_transit_eur: Number(
        (baselineMetrics.total_cost_penalty_eur - optimizedMetrics.total_cost_penalty_eur).toFixed(2)
      )
    }
  };
}

// ----------------------------------------------------------------------------
// 🚀 STATELESS HTTP SERVER (Shadow Mode Engine)
// ----------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/v1/telemetry' || req.url === '/') {
    const payload = generateMockTelemetryPayload();
    console.log(`[SHADOW MODE LOG | ${payload.timestamp}] Hash: ${payload.manifest_id_hash.substring(0, 12)}... | Baseline Loss: €${payload.financial_penalty_matrix.baseline_scenario.total_cost_penalty_eur}`);

    res.writeHead(200);
    res.end(JSON.stringify(payload, null, 2));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(` 🚀 DR-HAITI 2030 Local Sandbox Engine Running`);
  console.log(` 📌 Status: Active Shadow Mode (governance_loop_active = TRUE)`);
  console.log(` 🔌 Stream Endpoint: http://localhost:${PORT}/api/v1/telemetry`);
  console.log(`================================================================`);
});
