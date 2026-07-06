import { useEffect, useMemo, useState } from "react";
import { CircleCheck, Maximize2 } from "lucide-react";
import AnalysisModal from "./AnalysisModal";
import InteractiveCard from "./InteractiveCard";
import Reveal from "./Reveal";
import type { AnalyzeResponse } from "../types/api";

type AgentKey = "founder" | "cofounder" | "ceo" | "cfo" | "cmo" | "cto" | "coo" | "creative" | "hr";
type AgentTab = readonly [AgentKey, string, string];

const leadership = [
  ["founder", "Founder", "Strategic Vision"],
  ["cofounder", "Co-Founder", "Coordination Report"],
  ["ceo", "CEO", "Operational Intelligence"]
] as const satisfies readonly AgentTab[];

const departments = [
  ["cfo", "CFO", "Finance Department"],
  ["cmo", "CMO", "Marketing Department"],
  ["cto", "CTO", "Technology Department"],
  ["coo", "COO", "Operations Department"],
  ["creative", "Creative", "Brand & Design"],
  ["hr", "HR", "People & Culture"]
] as const satisfies readonly AgentTab[];

export default function AgentTabs({ response }: { response?: AnalyzeResponse | null }) {
  const [leadTab, setLeadTab] = useState(0);
  const [deptTab, setDeptTab] = useState(0);
  const visibleKeys = useMemo(() => getVisibleAgentKeys(response), [response]);
  const visibleSet = useMemo(() => new Set(visibleKeys), [visibleKeys]);
  const visibleLeadership = useMemo(() => leadership.filter(([key]) => visibleSet.has(key)), [visibleSet]);
  const visibleDepartments = useMemo(() => departments.filter(([key]) => visibleSet.has(key)), [visibleSet]);
  const analysisLabel = response?.full_analysis ? "Full Corporation Analysis." : "Selected routed agents.";

  useEffect(() => {
    if (leadTab >= visibleLeadership.length) setLeadTab(0);
  }, [leadTab, visibleLeadership.length]);

  useEffect(() => {
    if (deptTab >= visibleDepartments.length) setDeptTab(0);
  }, [deptTab, visibleDepartments.length]);

  if (!visibleLeadership.length && !visibleDepartments.length) return null;

  return (
    <Reveal>
      <div id="agents-section" className="grid scroll-mt-8 gap-8">
        {visibleLeadership.length > 0 && (
          <TabBlock title="Leadership Intelligence" subtitle={`Strategic layer · ${analysisLabel}`} tabs={visibleLeadership} active={leadTab} onChange={setLeadTab} response={response} />
        )}
        {visibleDepartments.length > 0 && (
          <TabBlock title="Department Reports" subtitle={`Operational departments · ${analysisLabel}`} tabs={visibleDepartments} active={deptTab} onChange={setDeptTab} response={response} />
        )}
      </div>
    </Reveal>
  );
}

function TabBlock({
  title,
  subtitle,
  tabs,
  active,
  onChange,
  response
}: {
  title: string;
  subtitle: string;
  tabs: readonly AgentTab[];
  active: number;
  onChange: (index: number) => void;
  response?: AnalyzeResponse | null;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const current = tabs[Math.min(active, tabs.length - 1)];
  if (!current) return null;
  const value = String(response?.agents?.[current[0]] || response?.[current[0]] || "Run an analysis to populate this agent output.");
  const preview = summarize(value);

  return (
    <section>
      <div className="mb-4">
        <p className="eyebrow">{title}</p>
        <h2 className="section-title">{subtitle}</h2>
      </div>
      <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab, index) => (
          <button key={tab[1]} className={`tab-btn ${active === index ? "active" : ""}`} onClick={() => { onChange(index); setModalOpen(false); }}>
            {tab[1]}
          </button>
        ))}
      </div>
      <InteractiveCard className="agent-report-card p-6" intensity={2} enableTilt={false}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="field-label">{current[1]} AI · {current[2]}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="status-chip green"><CircleCheck className="h-3.5 w-3.5" /> Ready</span>
              <span className="report-badge">{current[1]} Intelligence</span>
            </div>
          </div>
          <button className="btn-secondary" onClick={() => setModalOpen(true)}>
            <Maximize2 className="h-4 w-4" />
            View Full Analysis
          </button>
        </div>

        <div className="mt-5 rounded-[1.2rem] bg-white/[.025] p-4">
          <p className="text-sm leading-7 text-white/72">{preview}</p>
        </div>

      </InteractiveCard>
      <AnalysisModal
        open={modalOpen}
        title={`${current[1]} Full Analysis`}
        subtitle={current[2]}
        badge={`${current[1]} Intelligence`}
        content={value}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}

function summarize(value: string) {
  const first = value.replace(/\s+/g, " ").trim();
  if (first.length <= 260) return first;
  return `${first.slice(0, 260).replace(/\s+\S*$/, "")}...`;
}

export function getVisibleAgentKeys(response?: AnalyzeResponse | null): AgentKey[] {
  const allowed = new Set<AgentKey>([
    "founder",
    "cofounder",
    "ceo",
    "cfo",
    "cmo",
    "cto",
    "coo",
    "creative",
    "hr"
  ]);

  const source = response?.full_analysis
    ? Array.from(allowed)
    : response?.selected_agent_keys?.length
      ? response.selected_agent_keys
      : response?.routing?.selected_agents?.length
        ? response.routing.selected_agents
        : response?.agents
          ? Object.keys(response.agents)
          : [];

  return source.filter((key): key is AgentKey => allowed.has(key as AgentKey));
}
