import { Activity, ArrowRight, FileText, GitBranch, Menu, Network, Plus, Route, Server, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import InteractiveCard from "./InteractiveCard";
import type { HealthResponse } from "../types/api";

const capabilities = ["Task Routing", "9 AI Agents", "CFO Reports", "Trace Logs", "Demo Mode Ready"];

export default function HeroSection({ health }: { health?: HealthResponse }) {
  const backendOnline = Boolean(health);

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
            <button className="hero-menu" aria-label="Open navigation">
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
                FinFlow AI routes invoices, transactions, and expense reports through traceable AI agents to generate CFO-style reports, risk checks, and action plans.
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
            <StatusPill icon={<Sparkles className="h-3.5 w-3.5" />} label={health?.demo_mode ? "Demo Mode ON" : backendOnline ? "Live LLM Mode" : "Mode Unknown"} tone={health?.demo_mode ? "online" : "warning"} />
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
                  Upload a document and watch task routing, agent execution, evaluator checks, and final CFO synthesis.
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

              <motion.div
                className="core-center-badge"
                animate={{ y: [0, -4, 0], boxShadow: ["0 20px 60px rgba(81,231,255,.16)", "0 28px 82px rgba(81,231,255,.26)", "0 20px 60px rgba(81,231,255,.16)"] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div>
                  <b>Finance Command Core</b>
                  <span>Multi-Agent Routing Active</span>
                  <small><i /> Evaluator Pass · Quality Gate Online</small>
                </div>
              </motion.div>

              <div className="globe-caption">
                <span>Evaluator Quality Layer</span>
                <strong>Trace verified</strong>
              </div>
            </motion.div>
          </div>

          <InteractiveCard className="liquid-glass-strong p-4" enableTilt={false} intensity={2}>
            <div id="workflow-preview" className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Feature icon={<Route />} title="Task Routing" body="Detects workflow type and activates selected agents." />
                <Feature icon={<GitBranch />} title="Agent Trace" body="Logs each agent run with status and duration." />
              </div>
              <InteractiveCard className="flex items-center gap-4 rounded-[1.5rem] p-4" intensity={3}>
                <div className="grid h-16 w-14 shrink-0 place-items-center rounded-xl bg-white/[.06] text-white/75">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold uppercase tracking-[.14em] text-white">CFO-Style Final Report</h3>
                  <p className="mt-1 text-sm leading-6 text-white/48">Executive summary, risks, key findings, and recommended actions.</p>
                </div>
                <button className="liquid-glass grid h-10 w-10 shrink-0 place-items-center rounded-full text-white/75" aria-label="Report preview">
                  <Plus className="h-4 w-4" />
                </button>
              </InteractiveCard>
            </div>
          </InteractiveCard>
        </div>
      </div>
    </section>
  );
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

function Feature({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <InteractiveCard className="rounded-[1.5rem] p-4" intensity={3}>
      <div className="text-cyanx/80 [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
      <h3 className="mt-4 text-sm font-semibold uppercase tracking-[.14em] text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/48">{body}</p>
    </InteractiveCard>
  );
}
