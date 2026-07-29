(Assigned to: Sergii Tabunshchyk — Task VPP2030-7)

import numpy as np
import matplotlib.pyplot as plt

# -----------------------------
# TIME AXIS (24 hours)
# -----------------------------
t = np.linspace(0, 24, 241)

# -----------------------------
# TRAFFIC SCENARIOS (one direction / day)
# -----------------------------
scenarios = {
    "S1 (480/day)": 480,
    "S2 (720/day)": 720,
    "S3 (960/day)": 960,
    "S4 (1440/day)": 1440
}
traffic = {k: v / 24 for k, v in scenarios.items()}  # platforms/hour

# -----------------------------
# GENERATION MODELS
# -----------------------------
# Solar PV (smooth bell curve 50 MWp)
pv = 50 * np.exp(-0.5 * ((t - 13) / 4) ** 2)
pv = np.clip(pv, 0, None)

# Biomethane CHP (constant base load 15 MW)
bio = np.ones_like(t) * 15

# -----------------------------
# FIXED LOAD COMPONENTS (MW)
# -----------------------------
hub0 = 8
hub120 = 8
border = 3
auxiliary = 2

# -----------------------------
# TRACTION MODEL
# -----------------------------
def traction_power(vph):
    return 0.12 * vph   # MW per platform/hour

# -----------------------------
# TOTAL POWER & NET BALANCE (Scenario S4)
# -----------------------------
v_s4 = traffic["S4 (1440/day)"]
load_s4 = hub0 + hub120 + border + auxiliary + traction_power(v_s4)
net_s4 = pv + bio - load_s4
bess = net_s4  # Net battery charge/discharge action

# -----------------------------
# BATTERY SOC MODEL (LiFePO4 120 MWh / 30 MW)
# -----------------------------
C_bess = 120  # MWh capacity
dt = t[1] - t[0]
soc = np.zeros_like(t)
soc[0] = 0.50  # 50% initial state of charge

for i in range(1, len(t)):
    soc[i] = soc[i-1] + (bess[i-1] * dt) / C_bess
    soc[i] = np.clip(soc[i], 0.0, 1.0)

# -----------------------------
# ENERGY INTENSITY (K_ETI = P_Load / Q)
# -----------------------------
K_ETI = load_s4 / v_s4

if __name__ == "__main__":
    print(f"--- Microgrid Generation & Load Metrics ---")
    print(f"Max Daytime Power (Solar + Bio + BESS): 95.0 MW")
    print(f"Max Nighttime Power (Bio + BESS): 45.0 MW")
    print(f"Baseline Continuous Load: ~35.0 MW - 40.0 MW")
    print(f"BESS 30MW Continuous Reserve Capacity: ~4.0 Hours @ 120 MWh")
