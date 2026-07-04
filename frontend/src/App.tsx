import { useEffect, useMemo, useState } from "react";
import BackgroundFX from "./components/BackgroundFX";
import HeroSection from "./components/HeroSection";
import UploadMission from "./components/UploadMission";
import MissionTimeline, { type TimelineStatus } from "./components/MissionTimeline";
import WorkflowPanel from "./components/WorkflowPanel";
import FinanceSnapshot from "./components/FinanceSnapshot";
import FinalReport from "./components/FinalReport";
import EvaluatorScore from "./components/EvaluatorScore";
import AgentTrace from "./components/AgentTrace";
import AgentTabs from "./components/AgentTabs";
import ResultActionDock from "./components/ResultActionDock";
import { analyzeFile, getHealth } from "./lib/api";
import type { AnalyzeResponse, HealthResponse } from "./types/api";

const agentKeys = ["founder", "cofounder", "ceo", "cfo", "cmo", "cto", "coo", "creative", "hr"] as const;

export default function App() {
  const [health, setHealth] = useState<HealthResponse>();
  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState("");
  const [response, setResponse] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timelineStatus, setTimelineStatus] = useState<TimelineStatus>("idle");
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    getHealth().then(setHealth).catch(() => setHealth(undefined));
  }, []);

  useEffect(() => {
    if (timelineStatus !== "running") return;
    const timer = window.setInterval(() => setActiveStage((stage) => Math.min(stage + 1, 7)), 780);
    return () => window.clearInterval(timer);
  }, [timelineStatus]);

  function handleFile(nextFile: File) {
    setFile(nextFile);
    setResponse(null);
    setError(null);
    setTimelineStatus("idle");
    setActiveStage(0);
    setFileText("");
    if (/\.(csv|txt)$/i.test(nextFile.name)) {
      const reader = new FileReader();
      reader.onload = () => setFileText(String(reader.result || ""));
      reader.readAsText(nextFile);
    }
  }

  async function handleLaunch() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    setActiveStage(0);
    setTimelineStatus("running");
    try {
      const result = await analyzeFile(file, true);
      setResponse(result);
      setTimelineStatus("completed");
      setActiveStage(7);
      window.setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    } catch (err) {
      setTimelineStatus("failed");
      setError(err instanceof Error ? err.message : "Analysis failed. Run python3 server.py and try again.");
    } finally {
      setLoading(false);
    }
  }

  const fullReport = useMemo(() => buildDownloadText(response), [response]);

  async function copyFinalReport() {
    if (!response?.final_report) return;
    await navigator.clipboard.writeText(response.final_report);
  }

  function downloadReport() {
    const blob = new Blob([fullReport], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "finflow_corporation_report.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  function startNewAnalysis() {
    setResponse(null);
    setFile(null);
    setFileText("");
    setError(null);
    setTimelineStatus("idle");
    setActiveStage(0);
    window.setTimeout(() => document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  return (
    <div className="min-h-screen text-white">
      <BackgroundFX />
      <main className="page-stack">
        <HeroSection health={health} />
        <UploadMission health={health} file={file} loading={loading} error={error} onFile={handleFile} onLaunch={handleLaunch} />
        {(loading || timelineStatus !== "idle") && <MissionTimeline activeIndex={activeStage} status={timelineStatus} />}

        {response && (
          <section id="results" className="shell grid gap-6 pb-32 pt-10">
            <WorkflowPanel routing={response.routing} />
            <FinanceSnapshot response={response} fileText={fileText} />
            <FinalReport report={response.final_report} onCopy={copyFinalReport} onDownload={downloadReport} />
            <EvaluatorScore evaluation={response.evaluation} />
            <AgentTrace trace={response.trace} />
            <AgentTabs response={response} />
            <ResultActionDock onDownload={downloadReport} onNewAnalysis={startNewAnalysis} />
          </section>
        )}
      </main>

      <footer className="py-12 text-center text-[.68rem] uppercase tracking-[.18em] text-white/30">
        FinFlow AI Corporation · Task-Routed Finance Operations · Traceable Multi-Agent Workflow
      </footer>
    </div>
  );
}

function buildDownloadText(response: AnalyzeResponse | null) {
  if (!response) return "";
  const sections = [
    `FINFLOW AI CORPORATION REPORT`,
    `Run ID: ${response.run_id || "n/a"}`,
    `Route: ${response.routing?.task_type || "n/a"}`,
    "",
    response.final_report || "",
    "",
    "TRACE",
    ...(response.trace || []).map((item) => `${item.agent_name} · ${item.status} · ${item.duration_ms}ms`),
    "",
    "AGENT OUTPUTS",
    ...agentKeys.map((key) => `\n${key.toUpperCase()}\n${response[key] || ""}`)
  ];
  return sections.join("\n");
}
