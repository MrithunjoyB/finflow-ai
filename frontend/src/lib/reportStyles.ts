export type ReportStyleConfig = {
  title: string;
  cardTitle: string;
  displayTitle: string;
  sectionHeading: string;
  buttonLabel: string;
  description: string;
};

export const reportStyles: ReportStyleConfig[] = [
  {
    title: "Executive Report",
    cardTitle: "Multi-Agent Executive Report",
    displayTitle: "Multi-Agent Executive Report",
    sectionHeading: "Multi-agent executive output.",
    buttonLabel: "Open Full Executive Report",
    description: "Founder, CEO, CFO, COO, and department-agent insights synthesized into one decision-ready report."
  },
  {
    title: "CFO Financial Report",
    cardTitle: "CFO Financial Report",
    displayTitle: "CFO Financial Report",
    sectionHeading: "Financial intelligence output.",
    buttonLabel: "Open Full Financial Report",
    description: "Financial analysis, expenses, risk, and cash-flow focus."
  },
  {
    title: "Founder Strategy Report",
    cardTitle: "Founder Strategy Report",
    displayTitle: "Founder Strategy Report",
    sectionHeading: "Strategic intelligence output.",
    buttonLabel: "Open Full Strategy Report",
    description: "Strategic direction, opportunity, and long-term positioning."
  },
  {
    title: "CEO Operations Report",
    cardTitle: "CEO Operations Report",
    displayTitle: "CEO Operations Report",
    sectionHeading: "Operations intelligence output.",
    buttonLabel: "Open Full Operations Report",
    description: "Execution, KPI, delegation, and operating priorities."
  },
  {
    title: "Risk & Audit Report",
    cardTitle: "Risk & Audit Report",
    displayTitle: "Risk & Audit Report",
    sectionHeading: "Risk and audit intelligence output.",
    buttonLabel: "Open Full Risk Report",
    description: "Risks, anomalies, evaluator checks, and compliance-style review."
  },
  {
    title: "Department Summary",
    cardTitle: "Department Summary",
    displayTitle: "Department Summary",
    sectionHeading: "Department intelligence output.",
    buttonLabel: "Open Full Department Summary",
    description: "CFO, CMO, CTO, COO, Creative, and HR perspectives."
  },
  {
    title: "Recruiter Demo Report",
    cardTitle: "Recruiter Demo Report",
    displayTitle: "Recruiter Demo Report",
    sectionHeading: "Recruiter-ready project summary.",
    buttonLabel: "Open Full Demo Report",
    description: "Portfolio-friendly summary explaining the AI corporation workflow."
  }
];

export const defaultReportStyle = reportStyles[0];
