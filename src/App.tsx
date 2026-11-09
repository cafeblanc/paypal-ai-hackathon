import LiveStreamView from "./components/LiveStreamView";
import ErrorBoundary from "./components/ErrorBoundary";

export function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <LiveStreamView />
      </div>
    </ErrorBoundary>
  );
}

export default App;
