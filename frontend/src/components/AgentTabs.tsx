import { useState } from "react";
import { CircleCheck, Maximize2 } from "lucide-react";
import AnalysisModal from "./AnalysisModal";
import InteractiveCard from "./InteractiveCard";
import Reveal from "./Reveal";
import type { AnalyzeResponse } from "../types/api";

const leadership = [
  ["founder", "Founder", "Strategic Vision"],
  ["cofounder", "Co-Founder", "Coordination Report"],
  ["ceo", "CEO", "Operational Intelligence"]
] as const;

const departments = [
  ["cfo", "CFO", "Finance Department"],
  ["cmo", "CMO", "Marketing Department"],
  ["cto", "CTO", "Technology Department"],
  ["coo", "COO", "Operations Department"],
  ["creative", "Creative", "Brand & Design"],
  ["hr", "HR", "People & Culture"]
] as const;

export default function AgentTabs({ response }: { response?: AnalyzeResponse | null }) {
  const [leadTab, setLeadTab] = useState(0);
  const [deptTab, setDeptTab] = useState(0);
  return (
    <Reveal>
      <div id="agents-section" className="grid scroll-mt-8 gap-8">
        <TabBlock title="Leadership Intelligence" subtitle="Strategic layer." tabs={leadership} active={leadTab} onChange={setLeadTab} response={response} />
        <TabBlock title="Department Reports" subtitle="Operational departments." tabs={departments} active={deptTab} onChange={setDeptTab} response={response} />
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
  tabs: readonly (readonly [keyof AnalyzeResponse, string, string])[];
  active: number;
  onChange: (index: number) => void;
  response?: AnalyzeResponse | null;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const current = tabs[active];
  const value = String(response?.[current[0]] || "Run an analysis to populate this agent output.");
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
