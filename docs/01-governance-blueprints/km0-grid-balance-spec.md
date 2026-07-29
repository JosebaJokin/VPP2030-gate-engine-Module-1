# ⚡ Km 0 Hub: Centralized Generation & Grid Balance Modeling

📌 **Jira Reference:** User Story 1.1 (`VPP2030-7`)  
📌 **Assignee:** Sergii Tabunshchyk (Senior Engineering Analyst)  
📌 **Status:** `Done` | **Simulation Code:** [`backend-engine/simulations/grid_balance_sim.py`](../../backend-engine/simulations/grid_balance_sim.py)

---

## ⚙️ 1. Physical Generation & Storage Assets

| Asset Type | Capacity / Rating | Operating Behavior |
| :--- | :--- | :--- |
| **Solar PV Tracking Array** | **50 MWp** | Bell-curve solar yield centered at 13:00 hrs ($P_{50}$ yield). |
| **Biomass Methane CHP Turbine** | **15 MW** | Continuous $24/7$ baseload generation. |
| **$\text{LiFePO}_4$ BESS Array** | **30 MW / 120 MWh** | Grid-forming energy storage for peak shaving & frequency regulation. |

---

## 📊 2. Microgrid Load Profile & Power Balance

### Consumer Load Breakdown
* **Hub 0 Terminal Load:** $8.0\text{ MW}$
* **Km 120 Destination Hub:** $8.0\text{ MW}$
* **Km 60 Border Checkpoint Terminal:** $3.0\text{ MW}$
* **Auxiliary & Cooling Systems:** $2.0\text{ MW}$
* **Max Traction Demand (Scenario S4 - 1,440 shuttles/day):** $12.0\text{ MW}$
* **Total Baseline Load:** $33.0\text{ MW}$ *(With 20% safety reserve buffer $\approx \mathbf{40.0\text{ MW}}$)*

---

## 🧮 3. Power Generation Limits & Mathematical Equations

### Maximum Instantaneous Capacity
* **Daytime Available Peak Power:**
  $$P_{\text{max}} = P_{\text{PV}} + P_{\text{Bio}} + P_{\text{BESS}} = 50\text{ MW} + 15\text{ MW} + 30\text{ MW} = \mathbf{95\text{ MW}}$$
* **Nighttime Available Capacity (No Solar):**
  $$P_{\text{night}} = P_{\text{Bio}} + P_{\text{BESS}} = 15\text{ MW} + 30\text{ MW} = \mathbf{45\text{ MW}}$$

> **⚠️ BESS Endurance Constraint:**  
> The 30 MW BESS capacity backed by 120 MWh storage can sustain maximum discharge for **4.0 hours continuous duration** ($120\text{ MWh} \div 30\text{ MW} = 4\text{ hours}$) before requiring solar surplus recharge.

### Battery State of Charge ($\text{SOC}$) Differential Equation
$$\text{SOC}(t) = \text{SOC}_0 + \frac{1}{C} \int_{0}^{t} P_{\text{BESS}}(\tau) \, d\tau$$
*Where $C = 120\text{ MWh}$ capacity, initialized at $\text{SOC}_0 = 50\%$.*

### System Energy Intensity ($K_{\text{ETI}}$)
$$K_{\text{ETI}}(t) = \frac{P_{\text{Load}}(t)}{Q(t)}$$
*Where $Q(t)$ is the shuttle platform throughput rate (platforms/hour).*
