import { Activity, AlertCircle, ArrowRight, BarChart3, Check, Cpu, FileText, GitBranch, Megaphone, Menu, Network, Palette, Plus, Route, Server, Sparkles, UserCheck, Users, Workflow, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import InteractiveCard from "./InteractiveCard";
import MissionControlMenu from "./MissionControlMenu";
import type { AnalyzeResponse, HealthResponse } from "../types/api";
import { defaultReportStyle, getReportOptionsForAgents, reportStyleGroups, type ReportStyleConfig } from "../lib/reportStyles";

const capabilities = ["Task Routing", "9 AI Agents", "Executive Reports", "Trace Logs", "Evaluator Checked"];

const reportStyleIcons = {
  overall_executive: FileText,
  agent_founder: Sparkles,
  agent_cofounder: Users,
  agent_ceo: Activity,
  agent_cfo: BarChart3,
  agent_cmo: Megaphone,
  agent_cto: Cpu,
  agent_coo: Workflow,
  agent_creative: Palette,
  agent_hr: UserCheck
} as const;

type HeroSectionProps = {
  health?: HealthResponse;
  analysisMode: "demo" | "live";
  onAnalysisModeChange: (mode: "demo" | "live") => void;
  selectedReportStyle: ReportStyleConfig;
  onReportStyleChange: (style: ReportStyleConfig) => void;
  response?: AnalyzeResponse | null;
};

export default function HeroSection({ health, analysisMode, onAnalysisModeChange, selectedReportStyle, onReportStyleChange, response }: HeroSectionProps) {
  const backendOnline = Boolean(health);
  const [reportPickerOpen, setReportPickerOpen] = useState(false);
  const [liveWarningOpen, setLiveWarningOpen] = useState(false);
  const [missionControlOpen, setMissionControlOpen] = useState(false);
  const reportPickerRef = useRef<HTMLDivElement | null>(null);
  const modeSelectorRef = useRef<HTMLDivElement | null>(null);
  const selectedAgentKeys = getSelectedAgentKeys(response);
  const reportOptions = getReportOptionsForAgents(selectedAgentKeys);
  const hasAnalysis = Boolean(response);

  useEffect(() => {
    if (!reportOptions.some((style) => style.id === selectedReportStyle.id)) {
      onReportStyleChange(defaultReportStyle);
    }
  }, [onReportStyleChange, reportOptions, selectedReportStyle.id]);

  useEffect(() => {
    if (!reportPickerOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!reportPickerRef.current?.contains(event.target as Node)) {
        setReportPickerOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setReportPickerOpen(false);
    };
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [reportPickerOpen]);

  useEffect(() => {
    if (!liveWarningOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!modeSelectorRef.current?.contains(event.target as Node)) {
        setLiveWarningOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLiveWarningOpen(false);
    };
    const timer = window.setTimeout(() => setLiveWarningOpen(false), 6500);
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [liveWarningOpen]);

  return (
    <section className="hero-shell">
      <div className="hero-grid">
        <motion.div
          className="hero-panel"
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <nav className="flex items-center justify-between gap-4">
            <div className="hero-mark">finflow</div>
            <button
              className="hero-menu"
              type="button"
              aria-label="Open FinFlow Mission Control"
              aria-expanded={missionControlOpen}
              onClick={() => setMissionControlOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </nav>

          <div className="grid gap-8 py-10 lg:py-12">
            <motion.div
              className="liquid-glass grid h-16 w-16 place-items-center rounded-2xl text-cyanx shadow-[0_0_42px_rgba(81,231,255,.16)]"
              animate={{ y: [0, -6, 0], opacity: [0.86, 1, 0.86] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-7 w-7" />
            </motion.div>

            <div>
              <p className="eyebrow">Task-Routed AI Finance Operations</p>
              <h1 className="hero-headline mt-5">
                Activate an <span className="hero-accent">AI corporation</span> for{" "}
                <span className="hero-accent">financial documents.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/58">
                FinFlow AI routes invoices, transactions, and expense reports through a traceable AI corporation to generate executive reports, risk checks, department insights, and action plans.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="btn-primary" onClick={() => document.getElementById("mission-input")?.scrollIntoView({ behavior: "smooth" })}>
                Launch Finance Mission <ArrowRight className="h-4 w-4" />
              </button>
              <button className="btn-secondary" onClick={() => document.getElementById("workflow-preview")?.scrollIntoView({ behavior: "smooth" })}>
                View Agent Workflow
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {capabilities.map((item, index) => (
                <motion.span
                  key={item}
                  className="cap-pill"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + index * 0.045 }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow text-white/35">Finance Operations Intelligence</p>
            <p className="mt-3 max-w-xl text-xl font-medium tracking-[-.035em] text-white/78 sm:text-2xl">
              From raw documents to <span className="font-serif italic text-white">executive decisions.</span>
            </p>
            <div className="quote-line mt-6">FinFlow AI Corporation</div>
          </div>
        </motion.div>

        <div className="right-panel">
          <div className="status-strip">
            <StatusPill icon={<Server className="h-3.5 w-3.5" />} label={backendOnline ? "Backend Online" : "Backend Offline"} tone={backendOnline ? "online" : "offline"} />
            <ModeSelector
              health={health}
              mode={analysisMode}
              warningOpen={liveWarningOpen}
              selectorRef={modeSelectorRef}
              onCloseWarning={() => setLiveWarningOpen(false)}
              onSelect={(mode) => {
                if (mode === "demo") {
                  onAnalysisModeChange("demo");
                  setLiveWarningOpen(false);
                  return;
                }
                if (health?.live_available) {
                  onAnalysisModeChange("live");
                  setLiveWarningOpen(false);
                  return;
                }
                onAnalysisModeChange("demo");
                setLiveWarningOpen(true);
              }}
            />
            <StatusPill icon={<Activity className="h-3.5 w-3.5" />} label="API 5050" tone="neutral" />
          </div>

          <InteractiveCard className="liquid-glass-strong p-5" enableTilt={false} intensity={2}>
            <div className="flex items-start gap-4">
              <div className="liquid-glass grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-cyanx">
                <Network className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-medium tracking-[-.04em] text-white">AI Finance Mission Active</h2>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Upload a document and watch task routing, leadership agents, department agents, evaluator checks, and final executive synthesis.
                </p>
              </div>
            </div>
          </InteractiveCard>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[2.5rem]">
            <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(81,231,255,.11),transparent_58%)] blur-2xl" />
            <motion.div
              className="command-core"
              animate={{ scale: [1, 1.018, 1], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
            >
              {Array.from({ length: 12 }).map((_, index) => (
                <span key={index} className="core-ray" style={{ transform: `rotate(${index * 32.7}deg)` }} />
              ))}

              <div className="globe-stage" aria-hidden="true">
                <div className="globe-shadow" />
                <div className="finance-globe">
                  <span className="globe-highlight" />
                  <span className="globe-equator" />
                  <span className="globe-lat lat-1" />
                  <span className="globe-lat lat-2" />
                  <span className="globe-lat lat-3" />
                  <span className="globe-lat lat-4" />
                  {Array.from({ length: 8 }).map((_, index) => (
                    <span key={index} className="globe-lon" style={{ transform: `rotateY(${index * 22.5}deg)` }} />
                  ))}
                  <span className="globe-scan scan-a" />
                  <span className="globe-scan scan-b" />
                </div>
              </div>

              <div className="globe-caption">
                <span>Evaluator Quality Layer</span>
                <strong>Trace verified</strong>
              </div>
            </motion.div>
          </div>

          <InteractiveCard className="report-picker-shell liquid-glass-strong p-4" enableTilt={false} intensity={2}>
            <div id="workflow-preview" className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Feature icon={<Route />} title="Task Routing" body="Detects workflow type and activates selected agents." />
                <Feature icon={<GitBranch />} title="Agent Trace" body="Logs each agent run with status and duration." />
              </div>
              <div className={`report-style-wrapper ${reportPickerOpen ? "is-open" : ""}`} ref={reportPickerRef}>
                <InteractiveCard className="report-style-card flex items-center gap-4 rounded-[1.5rem] p-4" intensity={3}>
                  <div className="grid h-16 w-14 shrink-0 place-items-center rounded-xl bg-white/[.06] text-white/75">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold uppercase tracking-[.14em] text-white">{selectedReportStyle.cardTitle}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/48">{selectedReportStyle.description}</p>
                  </div>
                  <div className="relative shrink-0">
                    <motion.button
                      className="report-style-plus liquid-glass grid h-10 w-10 place-items-center rounded-full text-white/75"
                      aria-label="Choose report style"
                      aria-expanded={reportPickerOpen}
                      aria-haspopup="listbox"
                      onClick={() => setReportPickerOpen((value) => !value)}
                      animate={{ rotate: reportPickerOpen ? 45 : 0 }}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ duration: 0.22 }}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.button>
                  </div>
                </InteractiveCard>
                <AnimatePresence>
                  {reportPickerOpen && (
                    <motion.button
                      key="report-style-shield"
                      className="report-style-shield"
                      aria-label="Close report style selector"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setReportPickerOpen(false)}
                    />
                  )}
                  {reportPickerOpen && (
                    <motion.div
                      key="report-style-popover"
                      className="report-style-popover"
                      role="listbox"
                      aria-label="Choose report or agent summary style"
                      initial={{ opacity: 0, y: 24, scale: 0.96, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: 18, scale: 0.97, filter: "blur(8px)" }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {reportStyleGroups.map((group) => {
                        const options = reportOptions.filter((style) => style.group === group);
                        if (!options.length && group === "ROUTED AGENT SUMMARIES" && !hasAnalysis) {
                          return (
                            <div className="report-style-group" key={group}>
                              <div className="report-style-group-label">{group}</div>
                              <div className="report-style-empty">Upload a document to activate routed agent summaries.</div>
                            </div>
                          );
                        }
                        if (!options.length) return null;
                        return (
                          <div className="report-style-group" key={group}>
                            <div className="report-style-group-label">{group}</div>
                            {options.map((style) => {
                              const Icon = reportStyleIcons[style.id as keyof typeof reportStyleIcons] || FileText;
                              const selected = selectedReportStyle.id === style.id;
                              return (
                                <button
                                  key={style.id}
                                  className={`report-style-option ${selected ? "active" : ""}`}
                                  role="option"
                                  aria-selected={selected}
                                  onClick={() => {
                                    onReportStyleChange(style);
                                    setReportPickerOpen(false);
                                  }}
                                >
                                  <span className="report-style-icon"><Icon className="h-4 w-4" /></span>
                                  <span className="min-w-0 flex-1 text-left">
                                    <b>{style.label}</b>
                                    <small>{style.description}</small>
                                  </span>
                                  {selected && <Check className="h-4 w-4 text-greenx" />}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </InteractiveCard>
        </div>
      </div>
      <MissionControlMenu open={missionControlOpen} onClose={() => setMissionControlOpen(false)} />
    </section>
  );
}

function getSelectedAgentKeys(response?: AnalyzeResponse | null) {
  if (!response) return [];
  if (response.full_analysis) {
    return ["founder", "cofounder", "ceo", "cfo", "cmo", "cto", "coo", "creative", "hr"];
  }
  if (response.selected_agent_keys?.length) return response.selected_agent_keys;
  if (response.routing?.selected_agents?.length) return response.routing.selected_agents;
  if (response.agents) return Object.keys(response.agents);
  return [];
}

function StatusPill({ icon, label, tone }: { icon: ReactNode; label: string; tone: "online" | "offline" | "warning" | "neutral" }) {
  const toneClass = tone === "online" ? "text-greenx" : tone === "offline" ? "text-redx" : tone === "warning" ? "text-amberx" : "text-white/58";
  return (
    <span className={`nav-pill ${tone === "online" ? "online" : tone === "offline" ? "offline" : tone === "warning" ? "warning" : ""}`}>
      <span className={`mr-2 inline-flex align-[-2px] ${toneClass}`}>{icon}</span>
      {label}
    </span>
  );
}

function ModeSelector({
  health,
  mode,
  warningOpen,
  selectorRef,
  onSelect,
  onCloseWarning
}: {
  health?: HealthResponse;
  mode: "demo" | "live";
  warningOpen: boolean;
  selectorRef: RefObject<HTMLDivElement | null>;
  onSelect: (mode: "demo" | "live") => void;
  onCloseWarning: () => void;
}) {
  const liveAvailable = Boolean(health?.live_available);
  const provider = providerLabel(health?.llm_provider);
  const supported = "Groq, OpenAI, Anthropic Claude, Gemini, OpenRouter, or Ollama";

  return (
    <div className="mode-selector-wrap" ref={selectorRef}>
      <div className="mode-selector liquid-glass" aria-label="Analysis mode selector">
        <button className={`mode-segment ${mode === "demo" ? "active" : ""}`} onClick={() => onSelect("demo")} type="button">
          Demo
        </button>
        <button className={`mode-segment ${mode === "live" ? "active" : ""} ${liveAvailable ? "" : "disabled"}`} onClick={() => onSelect("live")} type="button">
          Live
        </button>
      </div>
      {mode === "live" && liveAvailable && <span className="mode-provider">Live LLM: {provider}</span>}
      {warningOpen && (
        <motion.div
          className="mode-warning liquid-glass-strong"
          initial={{ opacity: 0, y: -6, scale: 0.96, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -4, scale: 0.96, filter: "blur(8px)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amberx" />
              <div>
                <b>Live LLM Mode unavailable</b>
                <p>Live LLM Mode is unavailable. Configure a valid LLM provider API key in .env and restart the backend, or continue in Demo Mode.</p>
                <small>Supported: {supported}. Demo Mode uses safe sample responses without API cost.</small>
              </div>
            </div>
            <button className="mode-warning-close" type="button" onClick={onCloseWarning} aria-label="Close live mode warning">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function providerLabel(provider?: string) {
  const labels: Record<string, string> = {
    groq: "Groq",
    openai: "OpenAI",
    anthropic: "Anthropic Claude",
    gemini: "Gemini",
    openrouter: "OpenRouter",
    ollama: "Ollama"
  };
  return labels[(provider || "").toLowerCase()] || "Provider";
}

function Feature({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <InteractiveCard className="rounded-[1.5rem] p-4" intensity={3}>
      <div className="text-cyanx/80 [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
      <h3 className="mt-4 text-sm font-semibold uppercase tracking-[.14em] text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/48">{body}</p>
    </InteractiveCard>
  );
}
