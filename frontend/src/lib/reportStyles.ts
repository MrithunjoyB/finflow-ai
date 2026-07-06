export type ReportStyleCategory = "overall" | "agent";
export type ReportStyleGroup = "FINAL SYNTHESIS" | "ROUTED AGENT SUMMARIES";
export type AgentKey = "founder" | "cofounder" | "ceo" | "cfo" | "cmo" | "cto" | "coo" | "creative" | "hr";

export type ReportStyleConfig = {
  id: string;
  title: string;
  label: string;
  category: ReportStyleCategory;
  group: ReportStyleGroup;
  agent?: string;
  agentKey?: AgentKey;
  cardTitle: string;
  displayTitle: string;
  sectionHeading: string;
  buttonLabel: string;
  description: string;
};

export const defaultReportStyle: ReportStyleConfig = {
  id: "overall_executive",
  title: "Overall Executive Report",
  label: "Overall Executive Report",
  category: "overall",
  group: "FINAL SYNTHESIS",
  cardTitle: "Overall Executive Report",
  displayTitle: "Overall Executive Report",
  sectionHeading: "Combined executive intelligence output.",
  buttonLabel: "Open Full Executive Report",
  description: "Combined decision-ready synthesis from all routed agents."
};

export const agentSummaryOptions: Record<AgentKey, ReportStyleConfig> = {
  founder: {
    id: "agent_founder",
    title: "Founder Summary",
    label: "Founder Summary",
    category: "agent",
    group: "ROUTED AGENT SUMMARIES",
    agent: "Founder",
    agentKey: "founder",
    cardTitle: "Founder Summary",
    displayTitle: "Founder Summary",
    sectionHeading: "Founder perspective output.",
    buttonLabel: "Open Full Founder Summary",
    description: "Founder-agent strategy perspective based on the routed workflow."
  },
  cofounder: {
    id: "agent_cofounder",
    title: "Co-Founder Summary",
    label: "Co-Founder Summary",
    category: "agent",
    group: "ROUTED AGENT SUMMARIES",
    agent: "Co-Founder",
    agentKey: "cofounder",
    cardTitle: "Co-Founder Summary",
    displayTitle: "Co-Founder Summary",
    sectionHeading: "Co-Founder perspective output.",
    buttonLabel: "Open Full Co-Founder Summary",
    description: "Validation, business model, coordination, and scaling perspective."
  },
  ceo: {
    id: "agent_ceo",
    title: "CEO Summary",
    label: "CEO Summary",
    category: "agent",
    group: "ROUTED AGENT SUMMARIES",
    agent: "CEO",
    agentKey: "ceo",
    cardTitle: "CEO Summary",
    displayTitle: "CEO Summary",
    sectionHeading: "CEO perspective output.",
    buttonLabel: "Open Full CEO Summary",
    description: "Execution, company priorities, ownership, and operating focus."
  },
  cfo: {
    id: "agent_cfo",
    title: "CFO Summary",
    label: "CFO Summary",
    category: "agent",
    group: "ROUTED AGENT SUMMARIES",
    agent: "CFO",
    agentKey: "cfo",
    cardTitle: "CFO Summary",
    displayTitle: "CFO Summary",
    sectionHeading: "CFO perspective output.",
    buttonLabel: "Open Full CFO Summary",
    description: "Finance-agent perspective based on the routed workflow."
  },
  cmo: {
    id: "agent_cmo",
    title: "CMO Summary",
    label: "CMO Summary",
    category: "agent",
    group: "ROUTED AGENT SUMMARIES",
    agent: "CMO",
    agentKey: "cmo",
    cardTitle: "CMO Summary",
    displayTitle: "CMO Summary",
    sectionHeading: "CMO perspective output.",
    buttonLabel: "Open Full CMO Summary",
    description: "Marketing, channels, campaign performance, audience, and growth."
  },
  cto: {
    id: "agent_cto",
    title: "CTO Summary",
    label: "CTO Summary",
    category: "agent",
    group: "ROUTED AGENT SUMMARIES",
    agent: "CTO",
    agentKey: "cto",
    cardTitle: "CTO Summary",
    displayTitle: "CTO Summary",
    sectionHeading: "CTO perspective output.",
    buttonLabel: "Open Full CTO Summary",
    description: "Systems, automation, data pipeline, architecture, and security."
  },
  coo: {
    id: "agent_coo",
    title: "COO Summary",
    label: "COO Summary",
    category: "agent",
    group: "ROUTED AGENT SUMMARIES",
    agent: "COO",
    agentKey: "coo",
    cardTitle: "COO Summary",
    displayTitle: "COO Summary",
    sectionHeading: "COO perspective output.",
    buttonLabel: "Open Full COO Summary",
    description: "Workflow, capacity, process, execution, and operating bottlenecks."
  },
  creative: {
    id: "agent_creative",
    title: "Creative Director Summary",
    label: "Creative Director Summary",
    category: "agent",
    group: "ROUTED AGENT SUMMARIES",
    agent: "Creative Director",
    agentKey: "creative",
    cardTitle: "Creative Director Summary",
    displayTitle: "Creative Director Summary",
    sectionHeading: "Creative Director perspective output.",
    buttonLabel: "Open Full Creative Director Summary",
    description: "Brand, content, creative fatigue, messaging, and UX direction."
  },
  hr: {
    id: "agent_hr",
    title: "HR Summary",
    label: "HR Summary",
    category: "agent",
    group: "ROUTED AGENT SUMMARIES",
    agent: "HR",
    agentKey: "hr",
    cardTitle: "HR Summary",
    displayTitle: "HR Summary",
    sectionHeading: "HR perspective output.",
    buttonLabel: "Open Full HR Summary",
    description: "People, hiring, capability, training, and workforce risk."
  }
};

export const reportStyleGroups: ReportStyleGroup[] = ["FINAL SYNTHESIS", "ROUTED AGENT SUMMARIES"];
export const reportStyles: ReportStyleConfig[] = [defaultReportStyle, ...Object.values(agentSummaryOptions)];

export function getReportOptionsForAgents(agentKeys: string[] = []) {
  const seen = new Set<string>();
  const routedAgentOptions = agentKeys
    .filter((key): key is AgentKey => key in agentSummaryOptions)
    .filter((key) => {
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((key) => agentSummaryOptions[key]);

  return [defaultReportStyle, ...routedAgentOptions];
}
