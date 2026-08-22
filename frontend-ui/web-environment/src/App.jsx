import GateSequenceRail from "./components/GateSequenceRail";
import TelemetryFeed from "./components/TelemetryFeed";
import StatusBar from "./components/StatusBar";
import RouteScene from "./components/RouteScene";
import { useMockPayload } from "./hooks/useMockPayload";
import "./App.css";

export default function App() {
  const { payload, parseMs, status, error, parseBudgetMs } = useMockPayload();
  const loading = status === "CONNECTING" || !payload;

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <span className="app__eyebrow">Zone 2 · Checkpoint Control</span>
          <h1 className="app__title">KM 60 Corridor Gate Monitor</h1>
        </div>
        <div className={`app__connection app__connection--${status.toLowerCase()}`}>
          {status === "CONNECTING" && "Connecting to telemetry endpoint…"}
          {status === "EVALUATED" && "Live · streaming"}
          {status === "LATENCY_BREACH" && "Live · latency budget exceeded"}
          {status === "ERROR" && `Endpoint unreachable${error ? `: ${error}` : ""}`}
        </div>
      </header>

      <main className="app__layout">
        <section className="panel panel--rail">
          <h2 className="panel__title">Logic Gate Sequence</h2>
          <GateSequenceRail gates={payload?.gates} status={status} />
        </section>

        <div className="app__widgets">
          <section className="panel panel--telemetry">
            <TelemetryFeed payload={payload ?? {}} loading={loading} />
          </section>

          <section className="panel panel--status">
            <StatusBar
              parseMs={parseMs}
              parseBudgetMs={parseBudgetMs}
              tDelayHours={payload?.t_delay_hours}
              status={status}
              analytics={payload?.analytics}
            />
          </section>

          <section className="panel panel--scene">
            <h2 className="panel__title">Corridor Route</h2>
            <div className="scene__frame">
              <RouteScene gates={payload?.gates} status={status} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
