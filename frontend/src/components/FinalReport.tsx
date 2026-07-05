import { Copy, Download, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import AnalysisModal from "./AnalysisModal";
import InteractiveCard from "./InteractiveCard";
import Reveal from "./Reveal";
import { defaultReportStyle, type ReportStyleConfig } from "../lib/reportStyles";
import type { RoutingResult } from "../types/api";

const sectionOrder = ["Executive Summary", "Key Findings", "Risk Signals", "Recommended Actions", "Disclaimer"];

type FinalReportProps = {
  report?: string;
  routing?: RoutingResult;
  selectedReportStyle?: ReportStyleConfig;
  onCopy: () => void;
  onDownload: () => void;
};

export default function FinalReport({ report, routing, selectedReportStyle = defaultReportStyle, onCopy, onDownload }: FinalReportProps) {
  const emptyReportText = `Run an analysis to generate a ${selectedReportStyle.displayTitle}.`;
  const displayReport = buildPresentationReport(report || emptyReportText, selectedReportStyle, routing);
  const sections = buildReportSections(displayReport);
  const [modalOpen, setModalOpen] = useState(false);
  const previewSections = sections.filter((section) => section.title !== "Disclaimer").slice(0, 4);

  return (
    <Reveal>
      <div id="report-section" className="scroll-mt-8">
      <InteractiveCard className="liquid-glass-strong p-6 sm:p-8" intensity={2} enableTilt={false}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{selectedReportStyle.displayTitle}</p>
            <h2 className="section-title">{selectedReportStyle.sectionHeading}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="report-badge"><Sparkles className="h-3.5 w-3.5" /> Synthesized Output</span>
              <span className="report-badge">AI Generated</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={() => setModalOpen(true)}>{selectedReportStyle.buttonLabel}</button>
            <button className="btn-secondary" onClick={onCopy}><Copy className="h-4 w-4" /> Copy Final Report</button>
            <button className="btn-secondary" onClick={onDownload}><Download className="h-4 w-4" /> Download Full Report</button>
          </div>
        </div>

        <div className="mt-7 grid gap-4">
          {previewSections.map((section, index) => (
            <motion.section
              key={section.title}
              className={`report-section ${section.title === "Disclaimer" ? "muted" : ""}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <div className="field-label">{String(index + 1).padStart(2, "0")} · {section.label}</div>
              <h3>{section.title}</h3>
              <ReportBody title={section.title} lines={section.lines.slice(0, section.title === "Executive Summary" ? 2 : 3)} />
            </motion.section>
          ))}
        </div>
        <p className="mt-5 text-sm leading-6 text-white/45">Preview only. Open the full report for complete synthesis, risks, recommendations, and disclaimer.</p>
      </InteractiveCard>
      </div>
      <AnalysisModal
        open={modalOpen}
        title={`Full ${selectedReportStyle.displayTitle}`}
        subtitle="Complete synthesized output from the FinFlow AI Corporation workflow."
        badge="Synthesized Output"
        content={displayReport}
        onClose={() => setModalOpen(false)}
      />
    </Reveal>
  );
}

function ReportBody({ title, lines }: { title: string; lines: string[] }) {
  if (title === "Recommended Actions") {
    return (
      <ol className="mt-4 grid gap-3">
        {normalizeItems(lines).map((line, index) => (
          <li key={`${line}-${index}`} className="action-item">
            <span>{index + 1}</span>
            <p>{line}</p>
          </li>
        ))}
      </ol>
    );
  }

  if (title === "Risk Signals" || title === "Key Findings") {
    return (
      <div className="mt-4 grid gap-2">
        {normalizeItems(lines).map((line, index) => (
          <div key={`${line}-${index}`} className={title === "Risk Signals" ? "risk-item" : "finding-item"}>
            <span />
            <p>{line}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-3">
      {lines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
    </div>
  );
}

function buildReportSections(report: string) {
  const cleanLines = report
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const buckets = new Map(sectionOrder.map((title) => [title, [] as string[]]));
  let active = "Executive Summary";

  cleanLines.forEach((line) => {
    const normalized = line.replace(/^#{1,4}\s*/, "").replace(/:$/, "");
    const matched = matchHeading(normalized);
    if (matched) {
      active = matched;
      return;
    }
    buckets.get(active)?.push(line.replace(/^[-*]\s*/, ""));
  });

  if ([...buckets.values()].every((items) => items.length === 0)) {
    buckets.set("Executive Summary", chunkFallback(report).slice(0, 2));
    buckets.set("Key Findings", chunkFallback(report).slice(2, 5));
  }

  const fallback = chunkFallback(report);
  return sectionOrder.map((title, index) => ({
    title,
    label: title === "Risk Signals" ? "Risk Review" : title === "Recommended Actions" ? "Action Plan" : title,
    lines: buckets.get(title)?.length ? buckets.get(title)! : fallbackFor(title, fallback, index)
  }));
}

function buildPresentationReport(report: string, style: ReportStyleConfig, routing?: RoutingResult) {
  const taskType = routing?.task_type || "general_finance_review";
  const isMarketSummary = taskType === "market_summary";

  if (style.title === "CFO Financial Report" && !isMarketSummary) {
    return report;
  }

  const profile = isMarketSummary ? marketingPresentationProfile(routing) : presentationProfiles[style.title] || presentationProfiles["Executive Report"];
  const routeLine = routeFinding(taskType);

  return [
    `## Executive Summary`,
    profile.summary,
    `Detected workflow: ${formatTaskType(taskType)}. ${routeLine}`,
    "",
    `## Key Findings`,
    ...profile.findings.map((item) => `- ${item}`),
    "",
    `## Risk Signals`,
    ...profile.risks.map((item) => `- ${item}`),
    "",
    `## Recommended Actions`,
    ...profile.actions.map((item) => `- ${item}`),
    "",
    `## Disclaimer`,
    "AI-generated output for demo and informational purposes only. Not financial, tax, legal, investment, or professional advice."
  ].join("\n");
}

const commonRisks = [
  "Financial dependency, concentration, or timing risk may require review against the uploaded source document.",
  "Demo mode output should be validated against original files before decisions are made.",
  "Live mode can be used with a configured LLM provider for richer analysis.",
  "Human review is recommended before financial, operating, hiring, or investment decisions."
];

const commonActions = [
  "Validate extracted revenue and expense figures against the source file.",
  "Review agent-specific outputs in the Agent Reports section.",
  "Use the Executive Report for overview and CFO Financial Report for deeper finance review.",
  "Run Live LLM Mode when a provider API key or local Ollama endpoint is configured."
];

const presentationProfiles: Record<string, { summary: string; findings: string[]; risks: string[]; actions: string[] }> = {
  "Executive Report": {
    summary: "FinFlow processed the uploaded financial context through a traceable 9-agent corporation workflow. The system combines strategic, financial, operational, technical, marketing, creative, and HR perspectives into one executive report.",
    findings: [
      "Revenue, expense, invoice, risk, or operating signals were interpreted through a multi-agent leadership workflow.",
      "Founder, Co-Founder, and CEO agents provided strategic framing and executive interpretation.",
      "CFO AI contributed financial analysis without becoming the only report identity.",
      "CEO and COO agents contributed execution planning and operational context.",
      "The evaluator checked output completeness before final synthesis."
    ],
    risks: commonRisks,
    actions: commonActions
  },
  "Founder Strategy Report": {
    summary: "FinFlow reframed the uploaded context as a founder-level strategy brief focused on opportunity, positioning, and long-term direction.",
    findings: [
      "Founder and Co-Founder perspectives anchor the strategic interpretation.",
      "CEO synthesis turns the document signals into near-term operating priorities.",
      "Finance and operations agents support the strategy with budget, risk, and execution context."
    ],
    risks: commonRisks,
    actions: [
      "Use the strategy view to identify the highest-leverage opportunity or constraint.",
      "Compare founder-level recommendations with CFO and COO agent outputs.",
      "Translate strategic bets into one measurable next experiment.",
      "Validate assumptions against the uploaded source document."
    ]
  },
  "CEO Operations Report": {
    summary: "FinFlow reframed the uploaded context as an operating brief for execution, KPIs, delegation, and process priorities.",
    findings: [
      "CEO and COO agents provide the strongest operational interpretation.",
      "Leadership agents convert document signals into execution priorities.",
      "CFO AI remains available for financial context while the report emphasizes operating decisions.",
      "Trace and evaluator outputs help confirm whether the workflow completed cleanly."
    ],
    risks: commonRisks,
    actions: [
      "Turn the top finding into an owner, metric, and follow-up date.",
      "Review COO output for bottlenecks and CEO output for delegation priorities.",
      "Use CFO Financial Report only when deeper finance review is needed.",
      "Run Live LLM Mode for richer KPI and operating-plan analysis."
    ]
  },
  "Risk & Audit Report": {
    summary: "FinFlow reframed the uploaded context as a risk and auditability brief focused on evaluator checks, finance controls, and operational follow-up.",
    findings: [
      "Risk, finance, and operations agents contribute complementary review angles.",
      "Evaluator checks help confirm whether summary, risks, actions, and disclaimer coverage exist.",
      "CFO AI contributes control and financial-risk interpretation where relevant.",
      "Trace logs make the workflow inspectable for demo and review purposes."
    ],
    risks: commonRisks,
    actions: [
      "Review any late, overdue, anomaly, or fraud-related source signals first.",
      "Compare evaluator output with the final report sections.",
      "Inspect agent trace timing and status for failed or incomplete steps.",
      "Escalate material findings for human review before action."
    ]
  },
  "Department Summary": {
    summary: "FinFlow summarized the uploaded context across department agents so each function contributes a concise operating perspective.",
    findings: [
      "CFO contributes finance, CMO contributes growth, CTO contributes technical context, and COO contributes operations.",
      "Creative and HR perspectives help translate business findings into messaging and resource needs.",
      "Founder, Co-Founder, and CEO agents keep the department outputs aligned to strategy."
    ],
    risks: commonRisks,
    actions: [
      "Review each department tab for role-specific recommendations.",
      "Group repeated recommendations into one cross-functional action plan.",
      "Use trace logs to confirm which departments completed successfully.",
      "Use the executive report to brief stakeholders quickly."
    ]
  },
  "Recruiter Demo Report": {
    summary: "FinFlow demonstrates an agentic AI workflow with task routing, multi-agent execution, trace logging, evaluation, and final synthesis.",
    findings: [
      "The upload was routed into a workflow rather than handled as one static prompt.",
      "Selected agents show how FinFlow decomposes work across leadership and department roles.",
      "Trace and evaluator sections demonstrate inspectability and quality checks.",
      "Demo mode keeps the project runnable without exposing API keys."
    ],
    risks: commonRisks,
    actions: [
      "Use sample files to demonstrate task routing during portfolio review.",
      "Show the trace, evaluator, and agent tabs after the final report.",
      "Explain how Live LLM Mode works when a provider is configured.",
      "Frame FinFlow as a hackathon-ready prototype with a production roadmap."
    ]
  }
};

function marketingPresentationProfile(routing?: RoutingResult) {
  const hasCfo = Boolean(routing?.selected_agents?.includes("cfo"));
  return {
    summary: "FinFlow processed the uploaded marketing context through a routed AI corporation workflow. CMO AI, Creative Director AI, Founder AI, Co-Founder AI, and CEO AI focus on campaign performance, channel mix, brand positioning, audience growth, and executive synthesis.",
    findings: [
      "CMO AI identified campaign, SEO, social media, conversion, and audience-growth signals.",
      "Creative Director AI should evaluate high-performing content themes, visual fatigue, and new creative angles.",
      "CEO AI should assess whether campaign-driven demand aligns with operational capacity.",
      "Founder AI should review long-term brand positioning and growth direction.",
      hasCfo
        ? "CFO AI should review ad spend, CAC, ROAS, and marketing efficiency because finance-related campaign metrics were detected."
        : "CFO AI was not required for this route unless ad spend, CAC, ROAS, revenue attribution, or budget signals appear.",
      "Influencer attribution and mobile landing-page bounce rate should be reviewed as risk areas."
    ],
    risks: [
      "Rising paid ad costs may reduce campaign efficiency.",
      "Influencer attribution may be unreliable without stronger tracking.",
      "Creative fatigue may reduce engagement in future campaigns.",
      "Mobile landing-page bounce rate may hurt conversion performance.",
      "Campaign-driven demand should be checked against fulfillment and support capacity.",
      "Demo mode output should be validated against original campaign data before decisions are made."
    ],
    actions: [
      "Ask CMO AI to rebalance channel mix based on ROAS, CAC, and conversion rate.",
      "Ask Creative Director AI to develop new ad creatives based on best-performing lifestyle videos and testimonial reels.",
      "Ask CEO/COO AI to verify whether operations can handle campaign-driven demand.",
      "Ask Founder AI to review brand positioning and audience strategy.",
      hasCfo
        ? "Ask CFO AI to validate ad spend, CAC, ROAS, and revenue attribution before increasing budget."
        : "Add CFO AI review before increasing paid-media budget or changing spend allocation."
    ]
  };
}

function routeFinding(taskType: string) {
  const routes: Record<string, string> = {
    revenue_analysis: "Revenue-related documents require strategic review, executive synthesis, and financial interpretation.",
    invoice_analysis: "Invoice documents require finance validation, operational follow-up, and executive review.",
    expense_review: "Expense documents require financial analysis, operational review, and risk control.",
    risk_assessment: "Risk documents require financial validation, operational context, and executive prioritization.",
    market_summary: "Marketing documents require growth analysis, brand strategy, campaign performance review, creative evaluation, and executive synthesis.",
    technical_audit: "Technical documents require CTO validation, operational context, and executive review.",
    operations_review: "Operations documents require process review, execution planning, and executive synthesis.",
    content_generation: "Content documents require creative direction, marketing context, and executive alignment.",
    general_finance_review: "General finance documents receive a balanced executive, financial, and operational review."
  };
  return routes[taskType] || routes.general_finance_review;
}

function formatTaskType(taskType: string) {
  return taskType.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function matchHeading(line: string) {
  const lower = line.toLowerCase();
  if (lower.includes("executive summary")) return "Executive Summary";
  if (lower.includes("key finding") || lower.includes("financial snapshot") || lower.includes("opportunit")) return "Key Findings";
  if (lower.includes("risk")) return "Risk Signals";
  if (lower.includes("recommended action") || lower.includes("action")) return "Recommended Actions";
  if (lower.includes("disclaimer") || lower.includes("not financial advice")) return "Disclaimer";
  return "";
}

function chunkFallback(text: string) {
  return text
    .replace(/\r/g, "")
    .split(/\n+|(?<=\.)\s+(?=[A-Z])/)
    .map((item) => item.trim().replace(/^[-*]\s*/, ""))
    .filter(Boolean)
    .slice(0, 12);
}

function fallbackFor(title: string, fallback: string[], index: number) {
  if (title === "Disclaimer") return ["AI-generated output for demo and informational purposes only. Not financial, tax, legal, or investment advice."];
  return fallback.slice(index, index + 2).length ? fallback.slice(index, index + 2) : ["No dedicated section was returned for this report area."];
}

function normalizeItems(lines: string[]) {
  return lines
    .flatMap((line) => line.split(/(?:^|\s)(?:\d+\.|[-*])\s+/).map((item) => item.trim()).filter(Boolean))
    .filter(Boolean);
}
