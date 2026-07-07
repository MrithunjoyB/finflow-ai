import { motion } from "framer-motion";
import { Activity, ArrowLeft, BarChart3, Bot, ClipboardCheck, FileText, Gauge, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

const OVERVIEW_VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260604_125109_19424216-4e2a-4560-b9f2-f1b5f6eb2c2e.mp4";

type FlowStep = {
  icon: LucideIcon;
  title: string;
  detail: string;
};

const productStages: FlowStep[] = [
  {
    icon: FileText,
    title: "Financial Context",
    detail: "Users upload CSV, PDF, or TXT financial and business documents such as revenue files, expense records, invoices, cash-flow notes, or campaign performance context. FinFlow treats these files as operating signals, not just text to summarize."
  },
  {
    icon: Bot,
    title: "Agent Intelligence",
    detail: "The system turns uploaded context into role-aware intelligence by activating the right business perspectives. Instead of one generic answer, FinFlow produces analysis through leadership, finance, marketing, operations, technical, creative, or HR viewpoints depending on the document."
  },
  {
    icon: ClipboardCheck,
    title: "Executive Decision",
    detail: "The final output is shaped into a decision-ready report with findings, risks, recommendations, and next actions. The goal is to help a reviewer understand what happened, what matters, what needs attention, and what should happen next."
  }
];

const differentiators = [
  {
    title: "Not a chatbot wrapper",
    text: "FinFlow does not simply send a document to one generic model and return one generic answer. It treats the uploaded context like a business task, routes it through a structured workflow, and produces role-aware intelligence from selected agents."
  },
  {
    title: "Task-routed activation",
    text: "The system detects the workflow type, priority, confidence, and document signals before activating agents. This makes the output more intentional because only the relevant leadership and department agents are used for the current file."
  },
  {
    title: "Traceable orchestration",
    text: "Every agent run is logged with status, timing, role, and execution context. This gives the project a transparent operating layer where users can inspect how the analysis moved from upload to routing, agent execution, evaluation, and report generation."
  },
  {
    title: "Demo-safe and live-ready",
    text: "FinFlow can run in deterministic demo mode for safe recruiter presentations without exposing secrets, and it can switch into live provider-backed reasoning when an API key is configured. This makes the project both portfolio-safe and technically expandable."
  }
];

const useCases = [
  { title: "Revenue Analysis", text: "Review revenue signals, income patterns, and financial performance across uploaded CSV, TXT, or PDF context. The system can route revenue-heavy documents toward finance and leadership agents for interpretation.", icon: BarChart3 },
  { title: "Expense Review", text: "Inspect costs, burn, operating efficiency, and expense categories. This helps convert raw spending information into clearer financial risk, control, and follow-up actions.", icon: Gauge },
  { title: "Market Campaign Intelligence", text: "Analyze campaign performance, CAC, ROAS, channel mix, audience growth, and revenue attribution signals. Marketing-heavy documents can activate growth, creative, and finance perspectives when relevant.", icon: Sparkles },
  { title: "Invoice Interpretation", text: "Extract payment, vendor, amount, due-date, and invoice context from uploaded files. This makes invoice documents easier to review, summarize, and route into finance-oriented recommendations.", icon: FileText },
  { title: "Cash-flow Review", text: "Understand inflows, outflows, liquidity pressure, and timing risks. Cash-flow signals can be converted into clearer operating and financial decisions.", icon: Activity },
  { title: "Recruiter Demo", text: "Showcase the routed multi-agent workflow safely without requiring real confidential company data or exposing API secrets. Demo mode keeps the product presentable while still showing routing, traceability, and report synthesis.", icon: Bot }
];

const heroBadges = ["CSV / PDF / TXT", "9 AI Agents", "Demo + Live Mode", "Traceable Reports"];
const finalBadges = ["Portfolio-safe demo mode", "Live Groq-ready", "Traceable multi-agent reports"];
const systemSignalTerms = [
  "CSV Upload",
  "PDF Upload",
  "TXT Upload",
  "Secure File Intake",
  "Workflow Detection",
  "Task Routing",
  "Priority Scoring",
  "Confidence Check",
  "Agent Selection",
  "Execution Trace",
  "Evaluator Check",
  "Report Synthesis",
  "Demo Mode",
  "Live Groq Mode"
];

const intelligenceSignalTerms = [
  "Founder Agent",
  "Co-Founder Agent",
  "CEO Agent",
  "CFO Agent",
  "CMO Agent",
  "CTO Agent",
  "COO Agent",
  "Creative Director",
  "HR Agent",
  "Revenue Analysis",
  "Expense Review",
  "Cash-flow Review",
  "Invoice Interpretation",
  "Market Campaign Intelligence",
  "Recruiter Demo"
];

const operatingLoop = [
  { title: "Detect", text: "Identify financial, operational, marketing, invoice, or risk signals from the source context.", x: 12, y: 50 },
  { title: "Assign", text: "Activate only the relevant leadership and department agents for the detected workflow.", x: 28, y: 21 },
  { title: "Reason", text: "Each selected agent analyzes the context from its own role-specific perspective.", x: 52, y: 18 },
  { title: "Verify", text: "The evaluator checks for missing context, risk signals, weak assumptions, and report readiness.", x: 83, y: 50 },
  { title: "Synthesize", text: "The system combines agent outputs into one coherent executive-ready report.", x: 60, y: 79 },
  { title: "Act", text: "Findings become recommended next steps, cautions, and decision priorities.", x: 30, y: 79 }
];

export default function ProjectOverviewPage() {
  return (
    <div className="project-brief-page text-white">
      <video className="project-brief-video" src={OVERVIEW_VIDEO_URL} autoPlay muted loop playsInline aria-hidden="true" />
      <div className="project-brief-overlay" />
      <div className="project-brief-grid" />

      <motion.main
        className="project-brief-content"
        initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <nav className="project-brief-nav">
          <Link className="route-home-link" to="/">
            <ArrowLeft className="h-4 w-4" /> Back to FinFlow Home
          </Link>
          <span className="mission-status-pill">FinFlow AI Corporation</span>
        </nav>

        <section className="project-brief-hero" aria-label="Project overview mission brief">
          <p className="eyebrow">Mission Brief</p>
          <h1>Project Overview</h1>
          <p>
            A task-routed AI finance corporation that converts uploaded financial context into traceable agent intelligence and executive-ready reports.
          </p>
          <div className="project-brief-badges">
            {heroBadges.map((badge) => <span key={badge}>{badge}</span>)}
          </div>
        </section>

        <SignalMarquee />

        <section className="project-topic-section" aria-label="FinFlow product value story">
          <div className="project-section-copy">
            <h2>From scattered financial files to decision-ready intelligence.</h2>
          </div>
          <div className="project-unified-card project-workflow-card">
            <div className="workflow-card-copy">
              <p>
                FinFlow turns scattered financial and business context into a clear review story: what the source material says, which business perspectives matter, and what decisions the reviewer can make next.
              </p>
              <div className="value-signal-strip" aria-label="Business signal progression">
                <span>Context Quality</span>
                <span>Agent Coverage</span>
                <span>Decision Readiness</span>
              </div>
            </div>
            <div className="product-stage-line" aria-hidden="true">
              <span className="product-stage-pulse pulse-one" />
              <span className="product-stage-pulse pulse-two" />
            </div>
            <div className="product-stage-grid">
              {productStages.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.article
                    className="product-stage-card"
                    key={step.title}
                    whileHover={{ y: -5, scale: 1.018 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  >
                    <span className="product-stage-index">{String(index + 1).padStart(2, "0")}</span>
                    <Icon className="h-6 w-6" />
                    <b>{step.title}</b>
                    <p>{step.detail}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="project-topic-section" aria-label="Why FinFlow is different">
          <div className="project-section-copy">
            <h2>Why FinFlow is different</h2>
          </div>
          <div className="project-unified-card project-difference-card">
            <div className="difference-copy">
              <p>
                FinFlow is designed as a routed AI workflow system rather than a single-response chatbot. It separates document intake, task routing, role-specific agent activation, trace logging, evaluation, and final synthesis so reviewers can understand how a report was produced and why certain agents were used.
              </p>
              <div className="difference-points">
                {differentiators.map((item) => {
                  return (
                    <motion.div className="difference-point" key={item.title} whileHover={{ x: 4 }}>
                      <b>{item.title}</b>
                      <p>{item.text}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="project-topic-section project-usecase-section" aria-label="FinFlow use cases">
          <div className="project-section-copy">
            <h2>What users can run through FinFlow</h2>
          </div>
          <div className="project-unified-card project-usecase-board">
            <p className="usecase-intro">
              FinFlow is built for financial and business documents where the user needs more than a summary. It can turn uploaded records, campaign notes, invoices, expense files, and cash-flow context into routed analysis, traceable agent outputs, and executive-ready recommendations.
            </p>
            {useCases.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div className="project-usecase-row" key={item.title} whileHover={{ x: 5 }}>
                  <span className="usecase-icon"><Icon className="h-4 w-4" /></span>
                  <span className="usecase-copy">
                    <b>{item.title}</b>
                    <small>{item.text}</small>
                  </span>
                  <span className="usecase-signal" aria-hidden="true"><i /></span>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="project-topic-section project-loop-section" aria-label="FinFlow intelligence loop">
          <div className="project-section-copy">
            <h2>FinFlow intelligence loop</h2>
            <p>
              While the workflow shows how a file moves through the product, the intelligence loop shows how FinFlow turns that movement into reliable reasoning: detecting signals, assigning roles, verifying outputs, and converting synthesis into action.
            </p>
          </div>
          <div className="project-unified-card project-loop-panel">
            <svg className="project-loop-path" viewBox="0 0 1000 310" preserveAspectRatio="none" aria-hidden="true">
              <path d="M95 155 C95 62 205 34 342 42 C490 50 505 96 640 84 C805 69 902 88 906 155 C910 230 802 254 655 237 C505 220 480 194 343 214 C200 235 95 225 95 155" />
            </svg>
            <span className="loop-traveler traveler-a" aria-hidden="true" />
            <span className="loop-traveler traveler-b" aria-hidden="true" />
            <div className="project-loop-nodes">
              {operatingLoop.map((node) => (
                <motion.div
                  className="project-loop-node"
                  key={node.title}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  whileHover={{ scale: 1.06, y: -3 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  <span>{node.title}</span>
                  <small>{node.text}</small>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <motion.section
          className="project-final-strip"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45 }}
        >
          <span>FinFlow turns scattered financial context into role-aware intelligence, quality-checked synthesis, and decision-ready business recommendations.</span>
          <div className="project-final-actions">
            <div className="project-final-badges">
              {finalBadges.map((badge) => <b key={badge}>{badge}</b>)}
            </div>
            <Link className="project-final-link" to="/">Back to FinFlow Home</Link>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}

function SignalMarquee() {
  const rowOne = [...systemSignalTerms, ...systemSignalTerms];
  const rowTwo = [...intelligenceSignalTerms, ...intelligenceSignalTerms];

  return (
    <section className="project-signal-marquee" aria-label="Moving finance intelligence signals">
      <div className="project-marquee-row marquee-right">
        <div className="project-marquee-track">
          {rowOne.map((term, index) => <span key={`${term}-one-${index}`}>{term}</span>)}
        </div>
      </div>
      <div className="project-marquee-row marquee-left">
        <div className="project-marquee-track">
          {rowTwo.map((term, index) => <span key={`${term}-two-${index}`}>{term}</span>)}
        </div>
      </div>
    </section>
  );
}
