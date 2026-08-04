# 🔬 Bio-Twin VPP — Infrastructure Self-Maintenance Loop Specification

📌 **Jira Reference:** User Story 2.2 (`VPP2030-3`) — *Closed-Loop Material Flow Asset Design*  
📌 **Revision:** Rev. 3 (29 June 2026) | **Author:** Shlok (Visualization & Middleware Lead)

---

## 1. Purpose & System Overview
This report documents the text-based logic mapping, validation gate definitions, and mathematical throughput parameters for the $\text{CO}_2$-to-$\text{CaCO}_3$ rail-bed maintenance loop. It accompanies the visual block diagram (`bio_twin_caco3_loop_presentation_v4.png`) and serves as the defensible technical reference for the project jury panel[cite: 1].

---

## 🔄 2. Process Logic Map & Reject Pathways

1. **Source Stream:** Biogas flue gas from on-site combustion/gasification[cite: 1].
2. **Capture Stage:** 13X Zeolite Pressure Swing Adsorption (PSA) unit operating at 8–12 bar, producing concentrated $\text{CO}_2$[cite: 1].
3. **Mixing Stage:** Captured $\text{CO}_2$ combined with alkaline waste substrate (concrete demolition fines / Ca(OH)₂ / CaO) in a carbonation reactor[cite: 1].
4. **Conversion Stage:** Mineral carbonation reaction forms solid Calcium Carbonate ($\text{CaCO}_3$) + water[cite: 1].
5. **Pelletization Stage:** $\text{CaCO}_3$ output is dewatered, compacted, and formed into aggregate pellets[cite: 1].
6. **Quality Gate:** Pellets tested against rail ballast specifications (compressive strength and particle size distribution)[cite: 1].
   * **Pass Path (Deployment):** Approved pellets routed to automated rail-bed maintenance units[cite: 1].
   * **Reject Path (Fail-Safe Guardrail):** Failed pellets **never** re-enter the gas source stream[cite: 1]. Routed via two parallel pathways:
     * 🔄 **Mechanical Re-milling:** Crushed to fine powder and re-introduced to the Mixing stage strictly as unreacted alkaline substrate[cite: 1].
     * 🚜 **Down-cycling Bypass:** Failed batches exit the primary loop entirely for low-grade aggregate in non-structural fill or service-road stabilization[cite: 1].

---

## 🏛️ 3. Validation Checkpoints & Throughput Math

Every pass/reject event at the Quality Gate is timestamped (`event_time`) for Digital Twin historical logging[cite: 1].

* **V1 — Regulatory Gate:** Live query of emissions and output composition data against grid regulatory thresholds (`SIE-081` / `SIE-137`) before pellets are approved for use in grid-adjacent rail infrastructure[cite: 1].
* **V2 — Financial Gate:** Live query against the project’s financial twin, verifying that subsystem unit economics (capex amortization, opex per pellet-ton) protect a target **Debt Service Coverage Ratio (DSCR) $\ge$ 1.30**[cite: 1] *(Redline ceiling: **€378.93 / tonne**)*.
* **V3 — Engineering Gate (Throughput Math):** Continuously compares pellet production supply against corridor rail-bed maintenance demand[cite: 1]:

| Parameter | Value | Source & Calculation Method |
| :--- | :--- | :--- |
| **Supply (Nameplate Annual Capacity)** | **35,000 t/year** | Provided: BECCS Carbon Hub baseline[cite: 1] |
| **Supply (Derived Weekly Rate)** | **~673 t/week** (96.15 t/day) | Calculated: $35,000 \div 52$[cite: 1] |
| **Demand (Corridor Maintenance)** | **600 t/week** | Provided: 120-km corridor baseline[cite: 1] |
| **Net Surplus Margin (Supply − Demand)** | **+73 t/week (+12%)** | Calculated positive operational buffer[cite: 1] |

```text
GATE CONDITIONAL LOGIC:
IF actual_pellet_output_rate < 600 t/week 
THEN flag system_warning to Digital Twin (timestamped: event_time)
