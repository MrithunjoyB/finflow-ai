import { motion } from "framer-motion";
import { Activity, ArrowLeft, BarChart3, Bot, Brain, ClipboardCheck, FileText, GitBranch, Network, Route, ShieldCheck, Upload } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const HLS_URL = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

type DetailNode = {
  id: string;
  title: string;
  short: string;
  detail: string;
};

type ArchitectureNode = DetailNode & {
  icon: LucideIcon;
};

type AgentNode = DetailNode & {
  layer: "Leadership" | "Department";
};

const pipelineNodes: ArchitectureNode[] = [
  {
    id: "upload",
    title: "Document Upload",
    short: "CSV · PDF · TXT",
    detail: "Accepts CSV, PDF, and TXT files and extracts usable financial context.",
    icon: Upload
  },
  {
    id: "router",
    title: "Task Router",
    short: "Workflow detection",
    detail: "Detects workflow type, priority, confidence, and selected agents.",
    icon: Route
  },
  {
    id: "hub",
    title: "Agent Hub",
    short: "Selected agents",
    detail: "Activates only the leadership and department agents relevant to the document.",
    icon: Network
  },
  {
    id: "trace",
    title: "Execution Trace",
    short: "Timing metadata",
    detail: "Logs each agent run with status, timing, and execution metadata.",
    icon: Activity
  },
  {
    id: "evaluator",
    title: "Evaluator Layer",
    short: "Quality gate",
    detail: "Checks synthesis quality, risks, cautions, and report readiness.",
    icon: ShieldCheck
  },
  {
    id: "report",
    title: "Final Report",
    short: "Decision-ready",
    detail: "Combines routed intelligence into a selected decision-ready report style.",
    icon: ClipboardCheck
  }
];

const agentNodes: AgentNode[] = [
  { id: "founder", title: "Founder", short: "Leadership", detail: "Strategic vision and master oversight.", layer: "Leadership" },
  { id: "cofounder", title: "Co-Founder", short: "Leadership", detail: "Scaling and cross-department coordination.", layer: "Leadership" },
  { id: "ceo", title: "CEO", short: "Leadership", detail: "Operational delegation and KPI orchestration.", layer: "Leadership" },
  { id: "cfo", title: "CFO", short: "Department", detail: "Financial analysis, risk, and forecasting.", layer: "Department" },
  { id: "cmo", title: "CMO", short: "Department", detail: "Marketing, growth, and campaign intelligence.", layer: "Department" },
  { id: "cto", title: "CTO", short: "Department", detail: "Technical systems, data flow, and automation.", layer: "Department" },
  { id: "coo", title: "COO", short: "Department", detail: "Operations, execution, and process control.", layer: "Department" },
  { id: "creative", title: "Creative", short: "Department", detail: "Brand, content, and creative direction.", layer: "Department" },
  { id: "hr", title: "HR", short: "Department", detail: "People, hiring, onboarding, and team capability.", layer: "Department" }
];

const agentLayout = [
  { x: 30, y: 21 },
  { x: 50, y: 13 },
  { x: 70, y: 21 },
  { x: 27, y: 34 },
  { x: 73, y: 34 },
  { x: 66, y: 30 },
  { x: 39, y: 32 },
  { x: 20, y: 39 },
  { x: 56, y: 27 }
];

const techStack = [
  { group: "Frontend", items: ["React", "TypeScript", "Tailwind", "Framer Motion"] },
  { group: "Backend", items: ["Python", "Flask", "Secure Upload"] },
  { group: "AI Layer", items: ["Groq", "Agent Prompts", "Task Router"] },
  { group: "Reliability", items: ["Trace Logs", "Evaluator", "Demo/Live Fallback"] }
];

export default function SystemArchitecturePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [activeNode, setActiveNode] = useState<DetailNode | null>(null);
  const detailNode = activeNode || null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let destroyed = false;
    let hlsInstance: { destroy: () => void } | null = null;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_URL;
      return;
    }

    import("hls.js").then(({ default: Hls }) => {
      if (destroyed || !Hls.isSupported()) return;
      const hls = new Hls({ enableWorker: true });
      hls.loadSource(HLS_URL);
      hls.attachMedia(video);
      hlsInstance = hls;
    });

    return () => {
      destroyed = true;
      hlsInstance?.destroy();
    };
  }, []);

  return (
    <div className="architecture-cinema-page text-white">
      <video ref={videoRef} className="architecture-video-bg" autoPlay muted loop playsInline aria-hidden="true" />
      <div className="architecture-video-overlay" />
      <div className="architecture-grid-glow" />

      <main className="architecture-cinema-content">
        <nav className="architecture-top-nav">
          <Link className="route-home-link" to="/">
            <ArrowLeft className="h-4 w-4" /> Back to FinFlow Home
          </Link>
          <span className="mission-status-pill">FinFlow AI Corporation</span>
        </nav>

        <header className="architecture-hero-copy">
          <p className="eyebrow">AI Corporation Blueprint</p>
          <h1>System Architecture</h1>
          <p>A live technical map of how FinFlow routes documents through a task-routed AI corporation.</p>
        </header>

        <section className="architecture-map-shell" aria-label="FinFlow architecture pipeline">
          <div className="architecture-map">
            <svg className="architecture-lines" viewBox="0 0 1200 540" preserveAspectRatio="none" aria-hidden="true">
              <path className="pipeline-line" d="M90 270 C210 270 210 270 330 270 C455 270 455 270 580 270 C705 270 705 270 830 270 C950 270 950 270 1110 270" />
              <path className="pipeline-line glow" d="M90 270 C210 270 210 270 330 270 C455 270 455 270 580 270 C705 270 705 270 830 270 C950 270 950 270 1110 270" />
            </svg>
            <span className="data-packet packet-a" />
            <span className="data-packet packet-b" />
            <span className="data-packet packet-c" />
            <span className="data-packet packet-d" />

            <div className="pipeline-node-row">
              {pipelineNodes.map((node) => (
                node.id === "hub" ? (
                  <button
                    className="pipeline-hub-spacer"
                    key={node.id}
                    type="button"
                    onMouseEnter={() => setActiveNode(node)}
                    onFocus={() => setActiveNode(node)}
                    onMouseLeave={() => setActiveNode(null)}
                    onBlur={() => setActiveNode(null)}
                    aria-label="Agent Hub"
                  />
                ) : (
                  <PipelineNode key={node.id} node={node} active={activeNode?.id === node.id} onHover={setActiveNode} />
                )
              ))}
            </div>

            <AgentHub
              active={activeNode?.id === "hub" || agentNodes.some((agent) => agent.id === activeNode?.id)}
              onHover={() => setActiveNode(pipelineNodes[2])}
              onLeave={() => setActiveNode(null)}
            />
            <AgentConstellation activeAgentId={agentNodes.find((agent) => agent.id === activeNode?.id)?.id} onAgentHover={setActiveNode} />

            {detailNode && (
              <motion.aside
                className="architecture-detail-panel"
                initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.28 }}
              >
                <span>{detailNode.short}</span>
                <h2>{detailNode.title}</h2>
                <p>{detailNode.detail}</p>
              </motion.aside>
            )}
          </div>
        </section>

        <section className="architecture-tech-strip" aria-label="Technology Stack">
          <b>Technology Stack</b>
          <div className="architecture-tech-groups">
            {techStack.map((stack) => (
              <div className="architecture-tech-group" key={stack.group}>
                <span>{stack.group}</span>
                <p>{stack.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function PipelineNode({ node, active, onHover }: { node: ArchitectureNode; active: boolean; onHover: (node: DetailNode | null) => void }) {
  const Icon = node.icon;
  return (
    <motion.button
      className={`pipeline-node ${active ? "active" : ""}`}
      type="button"
      onMouseEnter={() => onHover(node)}
      onFocus={() => onHover(node)}
      onClick={() => onHover(node)}
      onMouseLeave={() => onHover(null)}
      onBlur={() => onHover(null)}
      whileHover={{ y: -6, scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
    >
      <Icon className="h-5 w-5" />
      <b>{node.title}</b>
      <small>{node.short}</small>
    </motion.button>
  );
}

function AgentHub({
  active,
  onHover,
  onLeave
}: {
  active: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <div className={`agent-hub-system ${active ? "active" : ""}`} onMouseEnter={onHover} onMouseLeave={onLeave}>
      <div className="agent-hub-core">
        <Brain className="h-7 w-7" />
        <b>Agent Hub</b>
        <span>Selected agents</span>
      </div>
      <GitBranch className="agent-hub-mark h-5 w-5" />
      <Bot className="agent-hub-bot h-5 w-5" />
      <FileText className="agent-hub-file h-5 w-5" />
      <BarChart3 className="agent-hub-chart h-5 w-5" />
    </div>
  );
}

function AgentConstellation({ activeAgentId, onAgentHover }: { activeAgentId?: string; onAgentHover: (node: AgentNode | null) => void }) {
  return (
    <div className="architecture-agent-layer" aria-label="9-agent corporation constellation">
      <svg className="architecture-agent-connectors" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <marker id="agent-arrow" markerHeight="5" markerWidth="6" orient="auto" refX="5.5" refY="2.5">
            <path d="M0,0 L6,2.5 L0,5 Z" fill="rgba(81,231,255,.5)" />
          </marker>
        </defs>
        {agentNodes.map((agent, index) => (
          <line
            className="map-agent-line"
            key={`${agent.id}-line`}
            markerEnd="url(#agent-arrow)"
            x1="50"
            x2={agentLayout[index].x}
            y1="46"
            y2={agentLayout[index].y}
          />
        ))}
      </svg>
      {agentNodes.map((agent, index) => (
        <motion.button
          className={`map-agent-node map-agent-node-${index + 1} ${activeAgentId === agent.id ? "active" : ""}`}
          key={agent.id}
          style={{ left: `${agentLayout[index].x}%`, top: `${agentLayout[index].y}%` }}
          type="button"
          title={agent.title}
          aria-label={`${agent.title} ${agent.layer} agent`}
          onMouseEnter={() => onAgentHover(agent)}
          onFocus={() => onAgentHover(agent)}
          onClick={() => onAgentHover(agent)}
          onMouseLeave={() => onAgentHover(null)}
          onBlur={() => onAgentHover(null)}
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="agent-node-dot" />
          <span>{agent.title}</span>
        </motion.button>
      ))}
    </div>
  );
}
