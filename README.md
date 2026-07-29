# Repository Architecture & Governance Guidelines

**Repository Name:** `vpp2030-gate-engine`

**Target Milestone:** September 15, 2026 (Pilot-Ready Prototype & Master Deck)

This workspace is structured around three core engineering pillars. To ensure clean version control and eliminate Jira comment clutter, **all code, schemas, and assets must be pushed directly to your designated repository directories**:

---

### 📂 Directory Structure & Scope

```
vpp2030-gate-engine/
├── 📂 backend-sandbox/         (Assigned: Sergii)
├── 📂 digital-twin-ui/         (Assigned: Nelia)
├── 📂 telemetry-api/           (Assigned: Shlok)
├── 📂 schemas/                 (Shared / Core Engineering)
├── 📂 tests/                   (Shared / QA)
└── 📂 docs/                    (Assigned: Joseba / Systems)

```

#### **1. 📂 `backend-sandbox/**`

* **Assigned:** Sergii
* **Scope:**
* Mock telemetry generators simulating live freight traffic (OCR license plates, RFID transponder tags, rail WIM scales).
* Sub-500ms 3-Gate decision engine evaluation logic (Identity match, $\pm 5\%$ weight delta, Customs Hash verification).
* Border-latency operational matrix and passive, read-only "Shadow Mode" processing execution.



#### **2. 📂 `digital-twin-ui/**`

* **Assigned:** Nelia
* **Scope:**
* High-fidelity Figma exports, SCADA control room dashboard wireframes, and Zone 2 (Km 60) interactive UI components.
* Signal indicator lights (Green = Express Pass / Red = Secondary Shunt) and live telemetry counters.
* Master Presentation Deck graphics assembly and visual layout integration.



#### **3. 📂 `telemetry-api/**`

* **Assigned:** Shlok
* **Scope:**
* Frontend web execution environment and API ingestion endpoints.
* Webhook integrations parsing JSON payloads between the backend sandbox and the SCADA UI.
* Latency benchmarking line ensuring total end-to-end processing executes in **<500 milliseconds**.



#### **4. 📂 `schemas/` & `tests/**`

* **Assigned:** Shared / Core Engineering
* **Scope:** Standardized JSON data contracts for incoming truck feeds, unit test scripts, and payload validation suites.

---

### ⚠️ Governance Rule & Definition of Done (DoD)

All engineering iterations, logic maps, technical schemas, and financial models must strictly adhere to the following **Definition of Done**:

1. **Sub-500ms Latency Benchmark:** The automated gate decision engine must receive multi-sensor payloads (OCR, RFID, WIM, Customs Hash), evaluate all 3 logic gates, and issue a pass/shunt command in **less than 500 milliseconds**.
2. **Stateless Security Boundary ("Shadow Mode"):** The simulation sandbox must run without persistent database writes to ensure complete security isolation during shadow testing.
3. **No Code / File Dumping in Jira:** Jira is strictly reserved for updating task statuses (*To Do*, *In Progress*, *Done*). All code, JSON schemas, and Figma links must be pushed to GitHub or Figma, with the direct PR/frame link referenced in Jira.
4. **Venture Economic & Grant Boundaries:** Financial outputs must preserve our standardized SaaS/PaaS pricing structure (R.1 Setup + R.2 Annual Subscription), maintain a minimum **Debt Service Coverage Ratio (DSCR) of 1.3**.

---
