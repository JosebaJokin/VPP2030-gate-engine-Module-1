import "./StatusBar.css";

export default function StatusBar({ parseMs, parseBudgetMs, tDelayHours, status, analytics }) {
  const withinBudget = parseMs != null && parseMs <= parseBudgetMs;

  return (
    <div className="statusbar">
      <div className="statusbar__item">
        <span className="statusbar__k">Token parse</span>
        <span className={`statusbar__v ${withinBudget ? "ok" : "warn"}`}>
          {parseMs != null ? `${parseMs} ms` : "…"}
          <span className="statusbar__budget"> / {parseBudgetMs} ms budget</span>
        </span>
      </div>
      <div className="statusbar__item">
        <span className="statusbar__k">T_delay</span>
        <span className="statusbar__v">
          {tDelayHours != null
            ? `${(tDelayHours * 3600).toFixed(0)} s (${tDelayHours} h)`
            : status === "CONNECTING"
            ? "…"
            : "n/a — hold active"}
        </span>
      </div>
      <div className="statusbar__item">
        <span className="statusbar__k">Cost_Total saved</span>
        <span className={`statusbar__v ${analytics ? "ok" : ""}`}>
          {analytics
            ? `€${analytics.cost_total_saved_eur.toLocaleString()}`
            : status === "CONNECTING"
            ? "…"
            : "n/a"}
        </span>
      </div>
      <div className="statusbar__item">
        <span className="statusbar__k">CO₂ avoided</span>
        <span className="statusbar__v">
          {analytics?.co2_avoided_kg != null ? `${analytics.co2_avoided_kg.toLocaleString()} kg` : "n/a"}
        </span>
      </div>
      <div className="statusbar__item">
        <span className="statusbar__k">Payload mode</span>
        <span className="statusbar__v">stateless · manifest_id_hash</span>
      </div>
    </div>
  );
}
