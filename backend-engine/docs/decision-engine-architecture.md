# 🏗️ Phase 1 Decision Engine & Distributed Validation Pipeline Architecture

## Executive Summary
To achieve sub-500ms execution latency under a baseline load of 1,200 trucks/day at the Dorohusk checkpoint, the Phase 1 Digital Twin operates as the final decision layer of a distributed validation pipeline. 

Heavy, computationally intensive operations (OCR image analysis, document verification, customs carnet parsing, and radiation/X-ray checks) occur asynchronously upstream at digital hubs and corridor checkpoints. The final Decision Engine (`sandbox/server.js`) simply verifies that mandatory validation states are satisfied before returning an operational clearance decision (`EXPRESS_PASS` or `INSPECTION_DIVERSION`).

---

## 📐 End-to-End Pipeline Diagram

---

Proposed Architecture
                    DIGITAL HUB
         (Certified Border Pre-processing)

• CMR / MRN Validation

• Customs Declaration

• T1 / TIR Documents

• Phytosanitary Certificates

• Veterinary Certificates

• Carrier & Consignee Verification

▼

Digital Twin Initialized

▼


Distributed Validation Pipeline


 RFID Scan ──┐
 OCR Verification ──┤
 WIM Weight Check ──┤
 Dimension Profile ──┤
 Seal Verification ──┤
 Radiation Monitor ──┤
 X-Ray Status ──┤
 Risk Assessment ───┤

▼

Digital Twin State Update

▼
Validation Status Matrix

Identity ............... PASS

Weight ................. PASS

Manifest ............... PASS

Seal ................... PASS

Radiation .............. PASS

X-Ray .................. PASS

Documents .............. PASS

Risk Score ............. LOW

                           ▼

                Phase 1 Decision Engine


          Gate 1 → Identity Match
                  │
          Gate 2 → Weight Δ ≤ ±2.5%
                  │
          Gate 3 → Manifest SHA-256 Match
                  │
                  ▼
        Operational Decision (<500 ms)

      ┌─────────────────────────────┐
      │      EXPRESS_PASS           │
      └──────────────┬──────────────┘
                     │
                     ▼
              Continue Processing

                     OR

      ┌─────────────────────────────┐
      │ INSPECTION_DIVERSION        │
      └─────────────────────────────┘

---

## 🔑 Key Engineering Advantages
1. **Sub-500ms Execution SLA:** The gate microservice only executes boolean state checks and SHA-256 hash comparisons, keeping server processing under 10ms.
2. **Read-Only Shadow Sandbox:** Operates passively without disrupting live customs databases.
3. **Phase 2 Compatibility:** Maintains 100% compatibility with future civil infrastructure expansion without altering the core backend logic.
