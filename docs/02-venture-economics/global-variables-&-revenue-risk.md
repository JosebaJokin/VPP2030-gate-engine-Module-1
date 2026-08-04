# ⚡ Global Variables, Carbon Sensitivity & Revenue Risk Matrix

📌 **Master Excel File:** [`Module1_Master_Model_Matrix.xlsx`](./Module1_Master_Model_Matrix.xlsx)

---

## 📊 1. Global Operational & Environmental Constants

| Variable Key | Baseline Value | Operational Unit | Mathematical Formula / Source | Empirical Rationale |
| :--- | :--- | :--- | :--- | :--- |
| `TOTAL_CORRIDOR_MARKET_BASE` | **438,000** | Trucks / Year | Static Input | Dorohusk Checkpoint baseline: ~1,200 trucks/day continuous throughput. |
| `PHASE_1_SANDBOX_CAPTURE_LIMIT` | **5% (0.05)** | Percentage | Static Input | Risk mitigation boundary: 21,900 trucks/year (60 trucks/day). |
| `C_DRIVER` | **€16.50** | € / Hour | Static Input | ZMPD Polish Carrier Benchmark hourly driver wage rate. |
| `C_DEPRECIATION` | **€12.50** | € / Hour | Static Input | RHA Cost Tables: Linear tractor & trailer asset depreciation rate. |
| `BURN_RATE` | **2.50** | Liters / Hour | Static Input | Thermo King SB-210 spec: Hourly auxiliary reefer diesel burn rate. |
| `C_FUEL_PRICE` | **€1.50** | € / Liter | Static Input | Regional Polish-Ukrainian industrial transport diesel baseline. |
| `C_FUEL_IDLE` | **€3.75** | € / Hour | `BURN_RATE * C_FUEL_PRICE` | Direct hourly fuel cash burn of an idling cold-chain reefer truck. |
| `EMISSIONS_FACTOR` | **2.68** | kg CO2 / Liter | Static Input | EEA / DEFRA standard mapping diesel combustion to carbon weight. |
| `C_QUOTA` | **€80.00** | € / Metric Tonne | Static Input | ICE Dec Carbon Futures (EU ETS compliance carbon index price). |
| `T_DELAY_DELTA` | **29.85** | Hours | Static Input | Operational queue delay eliminated per truck via express token clearance. |

---

## 🛡️ 2. Revenue Risk & Execution Probability Matrix

| Stream Code & Name | Year 1 Projection | Risk Level & Probability | Core Vulnerability / Execution Risk | Mitigation & Strategic Defense |
| :--- | :--- | :--- | :--- | :--- |
| **R.1 Upfront Integration** | €30,000 | **LOW (85%)** | Developer labor cost overruns mapping legacy edge sensors | Flat fee (€15,000/utility) paid Net-30 out of regional modernization funds, instantly neutralizing setup costs. |
| **R.2 Annual SaaS License** | €300,000 | **MEDIUM-LOW (75%)** | Administrative turnover in sovereign MSA sign-offs | B2G contracts backed by multi-year trade modernization funds; passive read-only loop prevents operational risk. |
| **R.3 Remote Governance** | €36,000 | **LOW (80%)** | Local bureaucratic policy inertia | Anchored to World Bank / IDB anti-corruption framework mandates, securing top-down institutional protection. |
| **R.4 Volumetric Pre-Auth** | €328,500 | **MEDIUM (60%)** | Speed of commercial freight adoption for token protocols | High volume leverage: captures a €15 fee on a 438,000 truck/yr market, saving carriers €42.5h in expensive delays. |
| **R.5 Carbon Telemetry Audit** | €54,750 | **MEDIUM (70%)** | Audit log verification delays across 3PL networks | Corporate ESG reporting mandates (CSDDD Directive) legally compel shippers to buy verified Scope 3 data assets. |
| **R.6 Carbon Offset Monetization** | €350,400 | **MEDIUM (65%)** | EU ETS macro carbon price volatility below €80 benchmark | B2G fixed software baseline (€366,000) covers all dev/hosting overhead even if carbon credit markets stall. |
