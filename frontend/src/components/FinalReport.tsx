import { Copy, Download, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import AnalysisModal from "./AnalysisModal";
import InteractiveCard from "./InteractiveCard";
import Reveal from "./Reveal";
import { defaultReportStyle, type ReportStyleConfig } from "../lib/reportStyles";
import type { RoutingResult } from "../types/api";

const sectionOrder = ["Executive Summary", "Key Findings", "Risk Signals", "Recommended Actions", "Disclaimer"];
const styleSectionTitles: Record<string, [string, string, string, string]> = {
  overall_executive: ["Executive Summary", "Cross-functional Findings", "Enterprise Risks", "Recommended Executive Actions"],
  executive: ["Executive Summary", "Cross-functional Findings", "Enterprise Risks", "Recommended Executive Actions"],
  cfo_financial: ["Financial Summary", "Financial Signals", "Financial Risks", "CFO Action Plan"],
  founder_strategy: ["Strategic Summary", "Growth Thesis", "Strategic Risks", "Founder Action Plan"],
  ceo_operations: ["Operating Summary", "Execution Signals", "Operating Risks", "CEO Action Plan"],
  risk_audit: ["Risk Summary", "Audit Findings", "Control Gaps", "Mitigation Plan"],
  department_summary: ["Department Overview", "Agent-by-Agent Findings", "Department Risks", "Department Follow-ups"],
  recruiter_demo: ["Project Demo Summary", "System Capabilities Demonstrated", "Technical Differentiators", "Recruiter Talking Points"],
  agent_founder: ["Founder Perspective", "Strategic Signals", "Founder Risks", "Founder Next Moves"],
  agent_cofounder: ["Co-Founder Perspective", "Validation Signals", "Partnership Risks", "Co-Founder Follow-ups"],
  agent_ceo: ["CEO Perspective", "Execution Signals", "Operating Risks", "CEO Priorities"],
  agent_cfo: ["CFO Perspective", "Financial Signals", "Finance Risks", "CFO Follow-ups"],
  agent_cmo: ["CMO Perspective", "Growth Signals", "Marketing Risks", "CMO Follow-ups"],
  agent_cto: ["CTO Perspective", "Technical Signals", "System Risks", "CTO Follow-ups"],
  agent_coo: ["COO Perspective", "Process Signals", "Operating Bottlenecks", "COO Follow-ups"],
  agent_creative: ["Creative Perspective", "Brand Signals", "Creative Risks", "Creative Follow-ups"],
  agent_hr: ["HR Perspective", "People Signals", "Workforce Risks", "HR Follow-ups"],
  "Executive Report": ["Executive Summary", "Cross-functional Findings", "Enterprise Risks", "Recommended Executive Actions"],
  "CFO Financial Report": ["Financial Summary", "Financial Signals", "Financial Risks", "CFO Action Plan"],
  "Founder Strategy Report": ["Strategic Summary", "Growth Thesis", "Strategic Risks", "Founder Action Plan"],
  "CEO Operations Report": ["Operating Summary", "Execution Signals", "Operating Risks", "CEO Action Plan"],
  "Risk & Audit Report": ["Risk Summary", "Audit Findings", "Control Gaps", "Mitigation Plan"],
  "Department Summary": ["Department Overview", "Agent-by-Agent Findings", "Department Risks", "Department Follow-ups"],
  "Recruiter Demo Report": ["Project Demo Summary", "System Capabilities Demonstrated", "Technical Differentiators", "Recruiter Talking Points"]
};

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
              <ReportBody title={section.title} lines={section.lines.slice(0, isSummaryTitle(section.title) ? 2 : 3)} />
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
  if (isActionTitle(title)) {
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

  if (isRiskTitle(title) || isSignalTitle(title)) {
    return (
      <div className="mt-4 grid gap-2">
        {normalizeItems(lines).map((line, index) => (
          <div key={`${line}-${index}`} className={isRiskTitle(title) ? "risk-item" : "finding-item"}>
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

  const parsedSections: { title: string; label: string; lines: string[] }[] = [];
  let activeSection: { title: string; label: string; lines: string[] } | null = null;

  cleanLines.forEach((line) => {
    const heading = parseMarkdownHeading(line);
    if (heading) {
      activeSection = { title: heading, label: headingLabel(heading), lines: [] };
      parsedSections.push(activeSection);
      return;
    }
    if (activeSection) {
      activeSection.lines.push(line.replace(/^[-*]\s*/, ""));
    }
  });

  const usableSections = parsedSections.filter((section) => section.lines.length && section.title.toLowerCase() !== "disclaimer");
  if (usableSections.length >= 2) {
    return usableSections;
  }

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

function parseMarkdownHeading(line: string) {
  const match = line.match(/^#{1,4}\s+(.+)$/);
  if (!match) return "";
  return match[1].replace(/:$/, "").trim();
}

function headingLabel(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("risk") || lower.includes("audit") || lower.includes("control")) return "Risk Review";
  if (lower.includes("action") || lower.includes("plan") || lower.includes("mitigation")) return "Action Plan";
  if (lower.includes("summary")) return "Summary";
  if (lower.includes("signal") || lower.includes("finding")) return "Signal Review";
  return title;
}

function isSummaryTitle(title: string) {
  return title.toLowerCase().includes("summary") || title.toLowerCase().includes("overview");
}

function isActionTitle(title: string) {
  const lower = title.toLowerCase();
  return lower.includes("action") || lower.includes("plan") || lower.includes("follow-up") || lower.includes("talking point") || lower.includes("mitigation");
}

function isRiskTitle(title: string) {
  const lower = title.toLowerCase();
  return lower.includes("risk") || lower.includes("audit") || lower.includes("control gap");
}

function isSignalTitle(title: string) {
  const lower = title.toLowerCase();
  return lower.includes("finding") || lower.includes("signal") || lower.includes("thesis") || lower.includes("capabilit") || lower.includes("differentiator");
}

function buildPresentationReport(report: string, style: ReportStyleConfig, routing?: RoutingResult) {
  if (hasUsableReportSections(report) && hasExpectedStyleSections(report, style)) {
    return report;
  }

  const taskType = routing?.task_type || "general_finance_review";
  const profile = style.category === "agent"
    ? agentPresentationProfile(style, routing)
    : style.id === "department_summary" || style.title === "Department Summary"
    ? departmentPresentationProfile(routing)
    : presentationProfiles[style.id] || presentationProfiles[style.title] || presentationProfiles.executive;
  const routeLine = routeFinding(taskType);
  const [summaryTitle, findingsTitle, risksTitle, actionsTitle] = styleSectionTitles[style.id] || styleSectionTitles[style.title] || styleSectionTitles.executive;

  return [
    `## ${summaryTitle}`,
    profile.summary,
    `Detected workflow: ${formatTaskType(taskType)}. ${routeLine}`,
    "",
    `## ${findingsTitle}`,
    ...profile.findings.map((item) => `- ${item}`),
    "",
    `## ${risksTitle}`,
    ...profile.risks.map((item) => `- ${item}`),
    "",
    `## ${actionsTitle}`,
    ...profile.actions.map((item) => `- ${item}`),
    "",
    `## Disclaimer`,
    "AI-generated output for demo and informational purposes only. Not financial, tax, legal, investment, or professional advice."
  ].join("\n");
}

function hasUsableReportSections(report: string) {
  const headingCount = report
    .split("\n")
    .filter((line) => /^#{1,4}\s+\S+/.test(line.trim()))
    .length;
  return headingCount >= 2;
}

function hasExpectedStyleSections(report: string, style: ReportStyleConfig) {
  const expectedTitles = styleSectionTitles[style.id] || styleSectionTitles[style.title] || styleSectionTitles.executive;
  const lowerReport = report.toLowerCase();
  const exactMatches = expectedTitles.filter((title) => lowerReport.includes(title.toLowerCase())).length;
  if (exactMatches >= 2) return true;
  return style.id === "executive" && /executive summary|key findings|recommended actions/i.test(report);
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
  overall_executive: {
    summary: "FinFlow synthesized the uploaded context into an overall executive report using only the agents routed for this workflow.",
    findings: [
      "Selected leadership and department agents contributed the decision-ready signals.",
      "The report combines routed perspectives instead of showing unrelated departments.",
      "Trace and evaluator data support inspection of the workflow before action."
    ],
    risks: commonRisks,
    actions: commonActions
  },
  executive: {
    summary: "FinFlow processed the uploaded financial context through a traceable AI corporation workflow. The system combines strategic, financial, operational, technical, marketing, creative, and people perspectives into one executive synthesis.",
    findings: [
      "Leadership agents framed the document signals into strategic and operating priorities.",
      "Selected finance and department agents translated the source context into budget, revenue, cost, execution, and control implications.",
      "The evaluator checked whether the workflow produced summary, risk, action, and disclaimer coverage."
    ],
    risks: commonRisks,
    actions: commonActions
  },
  cfo_financial: {
    summary: "FinFlow evaluated the uploaded context through a finance lens, focusing on revenue quality, campaign spend, CAC, ROAS, cost efficiency, budget allocation, margin pressure, attribution quality, and financial control risk.",
    findings: [
      "CFO AI should prioritize revenue, cost, ad spend, CAC, ROAS, cash-flow timing, and budget variance signals.",
      "Marketing or operating activity should be translated into financial efficiency before budget is increased.",
      "Attribution quality matters: weak campaign tracking can make CAC, ROAS, and revenue contribution look stronger than they are.",
      "Capital allocation should favor channels or departments with measurable return, clean ownership, and validated source data."
    ],
    risks: [
      "Rising spend without verified revenue attribution can create false confidence in campaign efficiency.",
      "CAC, ROAS, margin, or budget figures may be incomplete if the uploaded file lacks source-level detail.",
      "Delayed payments, recurring costs, or unclear owners can create cash-flow and control risk.",
      "Demo mode output must be validated against the original file before financial decisions."
    ],
    actions: [
      "Validate all revenue, cost, CAC, ROAS, and spend figures against the uploaded source.",
      "Create a simple budget variance and spend-efficiency view before increasing allocation.",
      "Flag any weak attribution, delayed payment, or margin-pressure signal for human finance review.",
      "Compare CFO findings with the selected agent tabs before finalizing the action plan."
    ]
  },
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
  "CFO Financial Report": {
    summary: "FinFlow evaluated the uploaded context through a finance lens, focusing on revenue quality, campaign spend, CAC, ROAS, cost efficiency, budget allocation, margin pressure, attribution quality, and financial control risk.",
    findings: [
      "CFO AI should prioritize revenue, cost, ad spend, CAC, ROAS, cash-flow timing, and budget variance signals.",
      "Marketing or operating activity should be translated into financial efficiency before budget is increased.",
      "Attribution quality matters: weak campaign tracking can make CAC, ROAS, and revenue contribution look stronger than they are.",
      "Capital allocation should favor channels or departments with measurable return, clean ownership, and validated source data."
    ],
    risks: [
      "Rising spend without verified revenue attribution can create false confidence in campaign efficiency.",
      "CAC, ROAS, margin, or budget figures may be incomplete if the uploaded file lacks source-level detail.",
      "Delayed payments, recurring costs, or unclear owners can create cash-flow and control risk.",
      "Demo mode output must be validated against the original file before financial decisions."
    ],
    actions: [
      "Validate all revenue, cost, CAC, ROAS, and spend figures against the uploaded source.",
      "Create a simple budget variance and spend-efficiency view before increasing allocation.",
      "Flag any weak attribution, delayed payment, or margin-pressure signal for human finance review.",
      "Compare CFO findings with the selected agent tabs before finalizing the action plan."
    ]
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

function agentPresentationProfile(style: ReportStyleConfig, routing?: RoutingResult) {
  const agentKey = style.id.replace("agent_", "");
  const routed = Boolean(routing?.selected_agents?.includes(agentKey));
  const optionalNote = routed
    ? `${style.agent} was part of the routed workflow for this document.`
    : `${style.agent} was not part of the routed workflow; summary is generated as an optional perspective.`;
  const profiles: Record<string, { focus: string; findings: string[]; risks: string[]; actions: string[] }> = {
    agent_founder: {
      focus: "founder vision, growth thesis, positioning, competitive edge, and long-term direction",
      findings: ["Frame the uploaded context as a strategic opportunity or constraint.", "Identify the strongest growth thesis and the assumptions behind it.", "Connect short-term document signals to positioning and durable advantage."],
      risks: ["Founder-level decisions can be distorted by weak attribution or incomplete source data.", "A strong idea may fail if finance or execution signals do not support the thesis."],
      actions: ["Define the highest-leverage strategic bet.", "Pressure-test the market position and moat.", "Turn the thesis into one measurable experiment."]
    },
    agent_cofounder: {
      focus: "business-model validation, execution partnership, scaling tradeoffs, and cross-functional coordination",
      findings: ["Validate whether the document supports a scalable operating model.", "Translate founder vision into coordination requirements.", "Identify dependencies between finance, growth, operations, and product work."],
      risks: ["Scaling too early can amplify weak unit economics or unclear ownership.", "Cross-functional work can drift if responsibilities are not explicit."],
      actions: ["Map the critical dependencies.", "Define ownership between leadership and departments.", "Create a validation checkpoint before scaling."]
    },
    agent_ceo: {
      focus: "execution priorities, company focus, operating cadence, ownership, and delivery risk",
      findings: ["Convert the uploaded signals into execution priorities.", "Identify which work needs owners, KPIs, and deadlines.", "Connect leadership intent to department-level action."],
      risks: ["Execution risk rises when priorities, ownership, or capacity are unclear.", "Campaign or revenue activity may exceed operating readiness."],
      actions: ["Assign owners and operating metrics.", "Set a follow-up cadence.", "Escalate blockers that affect delivery."]
    },
    agent_cfo: {
      focus: "finance, revenue, cost, CAC, ROAS, spend efficiency, controls, and financial risk",
      findings: ["Review revenue, cost, budget, CAC, ROAS, and cash-flow signals.", "Validate attribution before increasing spend.", "Look for margin pressure, delayed payment, and control gaps."],
      risks: ["Weak attribution can overstate performance.", "Unvalidated costs can hide margin pressure.", "Finance decisions require source-file validation."],
      actions: ["Reconcile figures with the uploaded source.", "Build a budget variance view.", "Flag financial risks for human review."]
    },
    agent_cmo: {
      focus: "marketing channels, campaign performance, audience growth, positioning, and demand signals",
      findings: ["Review channel mix, conversion, audience, SEO, social, and campaign performance.", "Identify messaging or targeting signals that support growth.", "Connect marketing activity to revenue attribution where possible."],
      risks: ["Paid growth may hide weak conversion or attribution.", "Audience growth can be low quality without channel-level evidence."],
      actions: ["Prioritize the strongest channel signal.", "Refine targeting and message tests.", "Coordinate with CFO before increasing spend."]
    },
    agent_cto: {
      focus: "systems, automation, data pipeline, technical architecture, API reliability, and security",
      findings: ["Review technical architecture, data flow, automation, API, backend, frontend, and security signals.", "Identify where systems can reduce manual finance work.", "Check whether technical risk affects reliability or scale."],
      risks: ["Weak data pipelines can reduce report reliability.", "Security and API issues can create operational or compliance exposure."],
      actions: ["Validate data ingestion and extraction quality.", "Prioritize automation and reliability fixes.", "Document technical risks for review."]
    },
    agent_coo: {
      focus: "operations, workflow, capacity, process, bottlenecks, and execution readiness",
      findings: ["Review process flow, capacity, productivity, and operational bottlenecks.", "Connect document signals to day-to-day execution impact.", "Identify where ownership or workflow clarity is missing."],
      risks: ["Demand or finance activity can create bottlenecks if capacity is not ready.", "Poor process ownership can delay follow-through."],
      actions: ["Assign workflow owners.", "Remove the highest-impact bottleneck.", "Create a simple operating cadence."]
    },
    agent_creative: {
      focus: "brand, content, creative fatigue, messaging, visual direction, and user experience",
      findings: ["Review content themes, brand positioning, creative fatigue, and messaging clarity.", "Identify what creative direction supports the detected workflow.", "Connect campaign or product signals to stronger storytelling."],
      risks: ["Creative fatigue can weaken engagement.", "Misaligned messaging can reduce conversion or trust."],
      actions: ["Draft new creative angles.", "Refresh messaging based on strongest signals.", "Coordinate with CMO on campaign tests."]
    },
    agent_hr: {
      focus: "people, hiring, training, team capability, resource allocation, and workforce risk",
      findings: ["Review staffing, capability, ownership, and training implications.", "Identify whether the workflow requires new skills or role clarity.", "Connect operational priorities to people capacity."],
      risks: ["Execution can stall if owners, training, or staffing are unclear.", "Team capacity may not match growth or operational demands."],
      actions: ["Assign accountable owners.", "Identify skill or hiring gaps.", "Create training or enablement follow-ups."]
    }
  };
  const profile = profiles[style.id] || profiles.agent_ceo;
  return {
    summary: `FinFlow generated a ${style.label} focused on ${profile.focus}. ${optionalNote}`,
    findings: [optionalNote, ...profile.findings],
    risks: profile.risks,
    actions: profile.actions
  };
}

function departmentPresentationProfile(routing?: RoutingResult) {
  const selectedDepartments = (routing?.selected_agents || [])
    .filter((agent) => !["founder", "cofounder", "ceo"].includes(agent))
    .map(agentLabel);
  const departmentText = selectedDepartments.length ? selectedDepartments.join(", ") : "no department agents";

  return {
    summary: `FinFlow summarized the routed departments involved in this workflow, highlighting how ${departmentText} and the leadership agents interpreted the uploaded context.`,
    findings: [
      `Selected departments for this run: ${departmentText}.`,
      "Founder, Co-Founder, and CEO provide leadership framing, but department output stays scoped to routed agents.",
      "Unselected departments are intentionally omitted so the report does not imply CTO, COO, or HR review when those agents were not routed.",
      "Each visible department tab should be treated as the detailed source for role-specific recommendations."
    ],
    risks: [
      "Department recommendations may conflict if ownership and sequencing are not clarified.",
      "Adding unselected departments to the summary can create noise and confuse the detected workflow.",
      "Routed department output should be validated against original source data before action.",
      "Demo mode output should be treated as a prototype summary, not professional advice."
    ],
    actions: [
      "Review only the selected department tabs shown below the report.",
      "Assign an owner for each routed department follow-up.",
      "Use full analysis only when all departments are intentionally needed.",
      "Keep the final action plan aligned with the detected workflow chips."
    ]
  };
}

function agentLabel(agent: string) {
  const labels: Record<string, string> = {
    cfo: "CFO",
    cmo: "CMO",
    cto: "CTO",
    coo: "COO",
    creative: "Creative Director",
    hr: "HR"
  };
  return labels[agent] || agent;
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
