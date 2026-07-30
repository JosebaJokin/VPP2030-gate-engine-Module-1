<img width="682" height="451" alt="7fd16491d39169fb462cc4a3f1f76a0b4fc52803 (1)" src="https://github.com/user-attachments/assets/4b993f45-3e1d-4c3f-82b0-7380e2b91b41" />

---

# 🌐 Three-Node Cyber-Physical System Logic Mapping

📌 **Jira Reference:** User Story 1.3 / System Logic Architecture  
📌 **Assignee:** Nelia Sheliuzhak (UI/UX & Systems Logic Lead)  
📌 **Corridor Boundary:** DR-HAITI 2030 (Km 0 to Km 120)

---

## ⚡ 1. Node 1: Generation Node (Km 0)

* **Physical Layer:**  
  Solar PV Array (50 MWp), Methane CHP Turbine (15 MW), $\text{LiFePO}_4$ BESS Array (30 MW / 120 MWh), BECCS PSA Engine.
* **Ingestion Boundary:**  
  Raw Generation net metrics, BECCS Exhaust flow metrics, BESS Temp/SOC/SOH data, Biomass feed metrics.
* **Cyber Logic:**  
  Generation Aggregation, Carbon Tracking & Mineralization ($\text{CaCO}_3$ loop), SCADA Glycol Thermal Loop Control.
* **Output Payload:**  
  `Generation_Mix`, `Carbon_Negativity`

---

## 🚪 2. Node 2: Border Node (Km 60 Checkpoint)

* **Physical Layer:**  
  RFID Tracking Tags, OCR Container Cameras, Weigh-in-Motion (WIM) Sensors, GPS Trackers.
* **Ingestion Boundary:**  
  Cargo Compliance profiles, Gate Passage logs, Fleet Coordinates, Weather API Feed.
* **Cyber Logic:**  
  Border Ingestion Automation (sub-500ms express clearance), Route Integrity, ETA Calculation, Hurricane Feathering Engine.
* **Output Payload:**  
  `Fleet_Status`, `Weather_Impact`

---

## 🔌 3. Node 3: Grid Node (Km 120 Endpoint Substation)

* **Physical Layer:**  
  DAS Fiber Optic, SCADA RTUs, Breaker status relays, Distribution Substations.
* **Ingestion Boundary:**  
  Seismic/Vibration data, Voltage/Current metrics, Outage / Breaker Tele-signals.
* **Cyber Logic:**  
  Topology Analysis, Outage Detection, Black-Start Readiness Logic, Recovery Orchestration.
* **Output Payload:**  
  `Grid_Graph`, `Recovery_Readiness`
