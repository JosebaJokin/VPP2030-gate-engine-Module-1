import "./GateSequenceRail.css";

const GATES = [
  { key: "gate1_identity", label: "GATE 1", sub: "Identity Match" },
  { key: "gate2_weight", label: "GATE 2", sub: "Weigh-In-Motion" },
  { key: "gate3_compliance", label: "GATE 3", sub: "Compliance" },
];

function stateToClass(state) {
  if (!state || state === "PENDING") return "pending";
  if (state === "PASS") return "pass";
  return "fail";
}

export default function GateSequenceRail({ gates, status }) {
  return (
    <div className="rail" role="group" aria-label="Gate sequence status">
      {GATES.map((gate, i) => {
        const state = gates?.[gate.key] ?? "PENDING";
        const cls = status === "CONNECTING" ? "pending" : stateToClass(state);
        return (
          <div className="rail-node" key={gate.key}>
            <div className={`lamp lamp--${cls}`}>
              <span className="lamp-core" />
            </div>
            <div className="rail-label">
              <span className="rail-label__id">{gate.label}</span>
              <span className="rail-label__sub">{gate.sub}</span>
              <span className={`rail-state rail-state--${cls}`}>
                {status === "CONNECTING" ? "READING…" : state.replace(/_/g, " ")}
              </span>
            </div>
            {i < GATES.length - 1 && (
              <div className={`rail-track rail-track--${cls === "fail" ? "pending" : cls}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
