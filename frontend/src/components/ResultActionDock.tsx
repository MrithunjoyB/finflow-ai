import { Activity, Download, FileText, Network, RefreshCw, Route } from "lucide-react";

type ResultActionDockProps = {
  onDownload: () => void;
  onNewAnalysis: () => void;
};

const items = [
  { label: "Workflow", icon: Route, target: "workflow-section" },
  { label: "Report", icon: FileText, target: "report-section" },
  { label: "Trace", icon: Activity, target: "trace-section" },
  { label: "Agents", icon: Network, target: "agents-section" }
];

export default function ResultActionDock({ onDownload, onNewAnalysis }: ResultActionDockProps) {
  function scrollTo(target: string) {
    if (target === "trace-section") {
      window.dispatchEvent(new CustomEvent("open-trace-section"));
    }
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="result-dock-wrap">
      <nav className="result-dock liquid-glass-strong" aria-label="Result actions">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} className="dock-btn" onClick={() => scrollTo(item.target)}>
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button className="dock-btn" onClick={onDownload}>
          <Download className="h-4 w-4" />
          <span>Download</span>
        </button>
        <button className="dock-btn dock-btn-warn" onClick={onNewAnalysis}>
          <RefreshCw className="h-4 w-4" />
          <span>New</span>
        </button>
      </nav>
    </div>
  );
}
