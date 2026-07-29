# 🔄 Closed-Loop Material Flow Asset (User Story 2.2 — Shlok's Domain)

![Bio-Twin CaCO3 Infrastructure Self-Maintenance Loop](./bio_twin_caco3_loop_presentation_v4.jpg)

---

## ⚙️ Technical Operational & System Architecture

### 1. Carbonation & Manufacturing Loop
* **Process Stream:** Ingests $\text{CO}_2$ flue gas from the 13X Zeolite PSA unit (operating at 8–12 bar) reacted with Ca(OH)₂ / CaO-bearing alkaline waste (concrete demolition fines).
* **Plant Output Capacity:** Manufactures **96 t/day** (~**673 t/week** gross) of $\text{CaCO}_3$ aggregate pellets for trackbed ballast maintenance.

### 2. Corridor Demand & Maintenance Cadence
* **Corridor Requirement:** Autonomous rail units distribute **600 t/week** across the 120-km infrastructure corridor.
* **Supply-Demand Surplus:** Maintains a constant positive net surplus of **+73 t/week (+12%)**, preventing trackbed maintenance deficits.

### 3. Fail-Safe Reject Routing
* **Gas Stream Protection:** Failed pellets **never** route back into the primary flue gas stream (preventing unit blockage/deadlock).
* **Engineering Pathways:**
  * 🔄 **Mechanical Re-Milling:** Crushed into fine powder to re-enter the mixing stage as unreacted substrate.
  * 🚜 **Down-Cycling Bypass:** Purged to secondary non-structural fill or service road stabilization along the corridor.

---

## 🏛️ Integrated Validation Checkpoints

| Checkpoint Gate | Parameter / Constraint | Status / Threshold |
| :--- | :--- | :--- |
| **V1 — Regulatory Gate** | Compliance query against Dominican Republic grid codes (`SIE-081` / `SIE-137`) | `PASS / APPROVED` |
| **V2 — Financial Gate** | Financial twin redline (protecting DSCR $\ge$ 1.30 covenant) | **Max Ceiling: €378.93 / tonne** *(Baseline: €24.03/t)* |
| **V3 — Engineering Gate** | Automated supply vs. demand check + data integrity validation | `Supply: 673 t/wk > Demand: 600 t/wk` |
| **V4 — Telemetry Security** | System heartbeat telemetry & chronological event timestamp | `+ sensor_heartbeat_check: PASS` |
