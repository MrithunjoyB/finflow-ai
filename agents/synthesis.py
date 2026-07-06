from config import DEMO_MODE
from utils.helpers import ask_ai
from utils.llm_providers import get_request_force_demo


STYLE_ALIASES = {
    "overall_executive": "Executive Report",
    "overall executive report": "Executive Report",
    "executive": "Executive Report",
    "cfo_financial": "CFO Financial Report",
    "founder_strategy": "Founder Strategy Report",
    "ceo_operations": "CEO Operations Report",
    "risk_audit": "Risk & Audit Report",
    "department_summary": "Department Summary",
    "recruiter_demo": "Recruiter Demo Report",
    "executive report": "Executive Report",
    "multi-agent executive report": "Executive Report",
    "cfo": "CFO Financial Report",
    "cfo financial report": "CFO Financial Report",
    "financial": "CFO Financial Report",
    "founder": "Founder Strategy Report",
    "founder strategy report": "Founder Strategy Report",
    "strategy": "Founder Strategy Report",
    "ceo": "CEO Operations Report",
    "ceo operations report": "CEO Operations Report",
    "operations": "CEO Operations Report",
    "risk": "Risk & Audit Report",
    "risk & audit report": "Risk & Audit Report",
    "audit": "Risk & Audit Report",
    "department": "Department Summary",
    "department summary": "Department Summary",
    "recruiter": "Recruiter Demo Report",
    "recruiter demo report": "Recruiter Demo Report",
    "demo": "Recruiter Demo Report",
}


AGENT_SUMMARY_BLUEPRINTS = {
    "agent_founder": {
        "title": "FinFlow AI Corporation Founder Summary",
        "agent": "Founder",
        "focus": "founder vision, market opportunity, growth thesis, positioning, moat, and long-term direction",
        "sections": [
            ("Founder Perspective", ["Frame the uploaded context as a strategic opportunity, constraint, or directional signal.", "Assess how the workflow supports founder-level choices around positioning and durable advantage."]),
            ("Strategic Signals", ["Look for evidence of market pull, revenue potential, audience fit, and differentiation.", "Connect short-term operational or financial signals to the long-term company thesis."]),
            ("Founder Risks", ["Founder-level decisions can be distorted by weak attribution, incomplete data, or unsupported assumptions.", "A promising strategic bet still needs finance and execution validation."]),
            ("Founder Next Moves", ["Choose one highest-leverage strategic bet.", "Pressure-test positioning, market segment, and moat assumptions.", "Convert the thesis into a measurable experiment."]),
        ],
    },
    "agent_cofounder": {
        "title": "FinFlow AI Corporation Co-Founder Summary",
        "agent": "Co-Founder",
        "focus": "business-model validation, execution partnership, scaling tradeoffs, and coordination",
        "sections": [
            ("Co-Founder Perspective", ["Translate founder direction into an executable coordination plan.", "Validate whether the uploaded context supports a scalable operating model."]),
            ("Validation Signals", ["Identify dependencies between leadership, finance, growth, operations, and technical work.", "Look for evidence that the business model can scale without breaking ownership or economics."]),
            ("Partnership Risks", ["Scaling too quickly can amplify unclear ownership, weak unit economics, or incomplete process design.", "Cross-functional work can drift without explicit decision rights."]),
            ("Co-Founder Follow-ups", ["Map critical dependencies.", "Define ownership across leadership and departments.", "Create a validation checkpoint before scaling."]),
        ],
    },
    "agent_ceo": {
        "title": "FinFlow AI Corporation CEO Summary",
        "agent": "CEO",
        "focus": "execution priorities, company focus, operating cadence, ownership, and delivery risk",
        "sections": [
            ("CEO Perspective", ["Convert the uploaded context into company priorities, ownership, and operating cadence.", "Connect leadership intent to department-level execution."]),
            ("Execution Signals", ["Identify workstreams that need owners, KPIs, deadlines, or escalation.", "Assess whether demand, revenue, or finance signals create operating load."]),
            ("Operating Risks", ["Execution risk rises when priorities, ownership, capacity, or metrics are unclear.", "Campaign or revenue activity may exceed operational readiness."]),
            ("CEO Priorities", ["Assign owners and operating metrics.", "Set a review cadence.", "Escalate blockers that affect delivery."]),
        ],
    },
    "agent_cfo": {
        "title": "FinFlow AI Corporation CFO Summary",
        "agent": "CFO",
        "focus": "finance, revenue, cost, CAC, ROAS, spend efficiency, controls, and financial risk",
        "sections": [
            ("CFO Perspective", ["Analyze the uploaded context through revenue quality, cost structure, budget discipline, and financial control.", "Use CAC, ROAS, spend efficiency, and attribution signals where present."]),
            ("Financial Signals", ["Review revenue, costs, ad spend, CAC, ROAS, cash-flow timing, and budget variance.", "Validate whether performance claims are supported by source data."]),
            ("Finance Risks", ["Weak attribution can overstate performance.", "Unvalidated costs can hide margin pressure or cash-flow risk."]),
            ("CFO Follow-ups", ["Reconcile figures with the uploaded source.", "Build a budget variance view.", "Flag financial risks for human review."]),
        ],
    },
    "agent_cmo": {
        "title": "FinFlow AI Corporation CMO Summary",
        "agent": "CMO",
        "focus": "marketing channels, campaign performance, audience growth, positioning, and demand signals",
        "sections": [
            ("CMO Perspective", ["Interpret the uploaded context through channel performance, audience, positioning, and demand generation.", "Connect marketing activity to revenue attribution where possible."]),
            ("Growth Signals", ["Review SEO, social, conversion, channel mix, campaign creative, and audience quality.", "Identify messaging or targeting signals that support growth."]),
            ("Marketing Risks", ["Paid growth may hide weak conversion or attribution.", "Audience growth can be low quality without channel-level evidence."]),
            ("CMO Follow-ups", ["Prioritize the strongest channel signal.", "Refine targeting and message tests.", "Coordinate with CFO before increasing spend."]),
        ],
    },
    "agent_cto": {
        "title": "FinFlow AI Corporation CTO Summary",
        "agent": "CTO",
        "focus": "systems, automation, data pipeline, technical architecture, API reliability, and security",
        "sections": [
            ("CTO Perspective", ["Assess the workflow from systems, automation, data pipeline, API, backend, frontend, and security angles.", "Identify where technical improvements can reduce manual finance operations work."]),
            ("Technical Signals", ["Review data extraction quality, architecture, automation readiness, and reliability.", "Look for security or integration issues that affect trust."]),
            ("System Risks", ["Weak data pipelines can reduce report reliability.", "Security and API issues can create operational or compliance exposure."]),
            ("CTO Follow-ups", ["Validate ingestion and extraction quality.", "Prioritize automation and reliability fixes.", "Document technical risks for review."]),
        ],
    },
    "agent_coo": {
        "title": "FinFlow AI Corporation COO Summary",
        "agent": "COO",
        "focus": "operations, workflow, capacity, process, bottlenecks, and execution readiness",
        "sections": [
            ("COO Perspective", ["Translate the uploaded context into workflow, capacity, process, and execution readiness.", "Identify where operating systems need clearer ownership."]),
            ("Process Signals", ["Review bottlenecks, productivity, handoffs, capacity, and operating cadence.", "Connect finance or growth activity to execution impact."]),
            ("Operating Bottlenecks", ["Demand or finance activity can create bottlenecks if capacity is not ready.", "Poor process ownership can delay follow-through."]),
            ("COO Follow-ups", ["Assign workflow owners.", "Remove the highest-impact bottleneck.", "Create a simple operating cadence."]),
        ],
    },
    "agent_creative": {
        "title": "FinFlow AI Corporation Creative Director Summary",
        "agent": "Creative Director",
        "focus": "brand, content, creative fatigue, messaging, visual direction, and user experience",
        "sections": [
            ("Creative Perspective", ["Interpret the uploaded context through brand, content, messaging, creative fatigue, and UX direction.", "Connect business findings to stronger storytelling."]),
            ("Brand Signals", ["Review content themes, audience response, visual clarity, campaign messaging, and creative angles.", "Identify what creative direction supports the detected workflow."]),
            ("Creative Risks", ["Creative fatigue can weaken engagement.", "Misaligned messaging can reduce conversion or trust."]),
            ("Creative Follow-ups", ["Draft new creative angles.", "Refresh messaging based on strongest signals.", "Coordinate with CMO on campaign tests."]),
        ],
    },
    "agent_hr": {
        "title": "FinFlow AI Corporation HR Summary",
        "agent": "HR",
        "focus": "people, hiring, training, team capability, resource allocation, and workforce risk",
        "sections": [
            ("HR Perspective", ["Assess the uploaded context through team capability, role clarity, staffing, and enablement.", "Connect operational priorities to people capacity."]),
            ("People Signals", ["Review ownership, skill gaps, training needs, resource allocation, and workforce readiness.", "Identify whether the workflow requires new capability or role definition."]),
            ("Workforce Risks", ["Execution can stall if owners, training, or staffing are unclear.", "Team capacity may not match growth or operational demands."]),
            ("HR Follow-ups", ["Assign accountable owners.", "Identify skill or hiring gaps.", "Create training or enablement follow-ups."]),
        ],
    },
}


STYLE_BLUEPRINTS = {
    "Executive Report": {
        "title": "FinFlow AI Corporation Multi-Agent Executive Report",
        "sections": [
            ("Executive Summary", [
                "FinFlow synthesized the uploaded context through a balanced AI corporation workflow spanning leadership, finance, operations, growth, technical, creative, and people perspectives.",
                "The output is designed for executive review: what happened, what matters, what risks need attention, and what actions should happen next.",
            ]),
            ("Key Findings", [
                "Leadership agents framed the document signals into strategic and operating priorities.",
                "Finance and operations agents translated the source context into budget, revenue, cost, execution, and control implications.",
                "Department agents added growth, technical, creative, and HR context so the report is not limited to one role.",
            ]),
            ("Risks", [
                "Important figures should be validated against the uploaded source before decisions are made.",
                "Revenue, cost, operational capacity, and attribution assumptions may require human review.",
            ]),
            ("Recommended Actions", [
                "Use the executive report for a fast cross-functional briefing.",
                "Review agent-specific tabs for department-level evidence and recommendations.",
                "Assign owners to the highest-priority financial, operational, and growth follow-ups.",
            ]),
        ],
    },
    "CFO Financial Report": {
        "title": "FinFlow AI Corporation CFO Financial Report",
        "sections": [
            ("Financial Summary", [
                "This report focuses on financial intelligence: revenue quality, spend efficiency, cost exposure, budget discipline, and financial risk.",
                "CFO AI should be treated as the primary lens, with other agents supporting context around execution and strategy.",
            ]),
            ("Financial Signals", [
                "Review revenue, client payment, CAC, ROAS, ad spend, budget, recurring cost, and margin-related signals in the uploaded document.",
                "Compare spend efficiency against the expected return before increasing budget or campaign investment.",
                "Flag any cash-flow timing, concentration, or attribution uncertainty for follow-up.",
            ]),
            ("Financial Risks", [
                "Rising costs, weak attribution, delayed payments, or unclear spend ownership can reduce capital efficiency.",
                "Marketing finance metrics such as CAC and ROAS should be validated before decisions are made.",
                "Demo-mode output is informational and should not be treated as financial advice.",
            ]),
            ("CFO Actions", [
                "Validate extracted figures against the source document.",
                "Calculate spend efficiency, revenue contribution, and budget variance where source data supports it.",
                "Use live mode for deeper provider-backed financial analysis when a valid key is configured.",
            ]),
        ],
    },
    "Founder Strategy Report": {
        "title": "FinFlow AI Corporation Founder Strategy Report",
        "sections": [
            ("Strategic Summary", [
                "This report reframes the uploaded context as a founder-level strategy brief focused on market opportunity, positioning, moat, and long-term direction.",
                "Founder and Co-Founder perspectives anchor the growth thesis while finance and operations provide reality checks.",
            ]),
            ("Growth Thesis", [
                "Identify whether the document points to a scalable revenue motion, stronger brand wedge, operational leverage, or clearer customer segment.",
                "Evaluate how campaign, finance, or operations signals support a defensible market position.",
                "Look for evidence that the company can turn short-term findings into durable strategic advantage.",
            ]),
            ("Strategic Risks", [
                "A promising growth signal may fail if positioning, unit economics, or operating capacity are weak.",
                "Attribution gaps and unvalidated assumptions can distort founder-level strategy decisions.",
            ]),
            ("Founder Actions", [
                "Define the strongest strategic bet suggested by the uploaded document.",
                "Pressure-test positioning, audience, channel, and moat assumptions.",
                "Translate the strategy into one measurable experiment with a clear owner and success metric.",
            ]),
        ],
    },
    "CEO Operations Report": {
        "title": "FinFlow AI Corporation CEO Operations Report",
        "sections": [
            ("Operating Summary", [
                "This report turns the uploaded context into an execution brief for priorities, ownership, capacity, and coordination.",
                "CEO and COO lenses lead the analysis, with finance and department agents contributing constraints and dependencies.",
            ]),
            ("Execution Signals", [
                "Identify workstreams that need ownership, measurable KPIs, deadlines, or cross-functional coordination.",
                "Check whether campaign demand, revenue activity, or finance findings create operational load.",
            ]),
            ("Operating Risks", [
                "Execution risk increases when source data lacks owners, timelines, capacity assumptions, or operating metrics.",
                "Demand generation should be checked against fulfillment, support, staffing, and process readiness.",
            ]),
            ("CEO Actions", [
                "Assign owners and next milestones to the highest-priority operational follow-ups.",
                "Use COO output to identify process bottlenecks and CEO output to drive delegation.",
                "Convert report findings into a short operating cadence with metrics and review dates.",
            ]),
        ],
    },
    "Risk & Audit Report": {
        "title": "FinFlow AI Corporation Risk & Audit Report",
        "sections": [
            ("Risk Summary", [
                "This report prioritizes risk visibility, auditability, controls, and decision caution.",
                "It reviews financial, operational, attribution, compliance, and data-quality concerns before recommending action.",
            ]),
            ("Audit Findings", [
                "Review whether the uploaded document contains unclear figures, weak attribution, late payments, overdue items, anomalies, or unsupported assumptions.",
                "Trace logs and evaluator checks provide evidence that the workflow completed and produced required sections.",
            ]),
            ("Control Gaps", [
                "Missing source validation, weak campaign attribution, unclear ownership, or incomplete financial evidence can create control gaps.",
                "Human review is required before financial, legal, tax, compliance, or investment decisions.",
            ]),
            ("Mitigation Plan", [
                "Validate source figures and assumptions before action.",
                "Escalate material financial or operational risks to a human reviewer.",
                "Use agent traces and evaluator output to inspect any missing, failed, or low-confidence workflow steps.",
            ]),
        ],
    },
    "Department Summary": {
        "title": "FinFlow AI Corporation Department Summary",
        "sections": [
            ("Department Overview", [
                "FinFlow summarized the departments selected by the task router instead of forcing every department into the report.",
                "Leadership agents keep the routed department outputs aligned to strategy and execution.",
            ]),
            ("Agent-by-Agent Findings", [
                "Selected department agents contribute role-specific evidence based on the uploaded context.",
                "Unselected departments are intentionally omitted so the report matches the detected workflow.",
            ]),
            ("Department Risks", [
                "Cross-functional risk increases if department recommendations conflict or lack clear ownership.",
                "Routed outputs should be validated against the original uploaded source before action.",
            ]),
            ("Department Follow-ups", [
                "Review only the visible department tabs for detailed role-specific recommendations.",
                "Assign owners to the selected departments that require follow-up.",
            ]),
        ],
    },
    "Recruiter Demo Report": {
        "title": "FinFlow AI Corporation Recruiter Demo Report",
        "sections": [
            ("Project Demo Summary", [
                "FinFlow demonstrates a task-routed multi-agent AI corporation that accepts finance-related documents and turns them into traceable executive reports.",
                "The project shows routing, agent decomposition, trace logging, evaluator checks, Demo Mode, and Live provider support.",
            ]),
            ("System Capabilities Demonstrated", [
                "The system detects workflow type, selects relevant agents, runs a 9-agent corporation, records traces, evaluates output completeness, and synthesizes a final report.",
                "Demo Mode keeps the project runnable without secrets; Live Mode supports provider-backed analysis when configured.",
            ]),
            ("Technical Differentiators", [
                "Recruiters can inspect architecture, safe config handling, provider abstraction, frontend polish, routing logic, and test coverage.",
                "Agent tabs and trace logs show that the project is more than a single-prompt wrapper.",
            ]),
            ("Recruiter Talking Points", [
                "Upload a sample file, show routing, inspect trace logs, open agent reports, and compare report styles.",
                "Explain how Groq or another provider can be enabled without exposing keys.",
            ]),
        ],
    },
}


def synthesize_report(agent_outputs, trace=None, evaluation=None, report_style="Executive Report", routing=None):
    trace = trace or []
    evaluation = evaluation or {}
    style = normalize_report_style(report_style)
    force_demo = get_request_force_demo()
    use_demo = DEMO_MODE if force_demo is None else bool(force_demo)

    if use_demo:
        return _demo_style_report(style, agent_outputs, trace, evaluation, routing)

    try:
        return _live_style_report(style, agent_outputs, trace, evaluation, routing)
    except Exception as exc:
        fallback = _demo_style_report(style, agent_outputs, trace, evaluation, routing)
        return f"{fallback}\n\n## Live Synthesis Fallback\nLive report generation failed cleanly: {exc}"


def synthesize_executive_report(agent_outputs):
    return synthesize_report(agent_outputs)


def normalize_report_style(report_style):
    key = str(report_style or "Executive Report").strip().lower()
    if key in AGENT_SUMMARY_BLUEPRINTS:
        return key
    return STYLE_ALIASES.get(key, "Executive Report")


def _demo_style_report(style, agent_outputs, trace, evaluation, routing):
    blueprint = _blueprint(style)
    lines = [f"# {blueprint['title']}", ""]
    route = (routing or {}).get("task_type", "general_finance_review")
    if style in AGENT_SUMMARY_BLUEPRINTS:
        lines.extend([f"_{_agent_route_note(style, agent_outputs)}_", ""])

    for heading, bullets in _style_sections(style, agent_outputs, routing):
        lines.extend([f"## {heading}"])
        for bullet in bullets:
            lines.append(f"- {bullet}")
        lines.append("")

    lines.extend(
        [
            "## Workflow Evidence",
            f"- Detected route: {route}",
            f"- Agents completed: {_completed_count(trace)}/9",
            f"- Evaluation score: {evaluation.get('score', 'not evaluated')}",
            f"- Relevant agent signal: {_style_agent_signal(style, agent_outputs)}",
            "",
            "## Disclaimer",
            "This prototype is for workflow demonstration and educational review. It is not financial, legal, tax, investment, or professional advice.",
        ]
    )
    return "\n".join(lines)


def _live_style_report(style, agent_outputs, trace, evaluation, routing):
    prompt = _style_prompt(style, agent_outputs, trace, evaluation, routing)
    return ask_ai(
        prompt,
        system=(
            "You are FinFlow AI Corporation's final synthesis layer. "
            "Write concise, decision-ready reports with the exact requested report style, sections, and language. "
            "Never expose API keys. Include a short disclaimer."
        ),
        force_demo=False,
    )


def _style_prompt(style, agent_outputs, trace, evaluation, routing):
    blueprint = _blueprint(style)
    sections = _style_sections(style, agent_outputs, routing)
    section_names = ", ".join(heading for heading, _bullets in sections)
    agent_context = "\n\n".join(
        f"{key.upper()}:\n{_compact(value, 900)}" for key, value in agent_outputs.items()
    )
    return f"""
Selected report style: {style}
Required title: {blueprint['title']}
Required sections, in this style-specific structure: {section_names}

Instructions:
- Do not reuse the generic executive report. Generate a style-specific report for: {style}.
- Make this report genuinely different from other styles.
- If style starts with agent_, generate a {blueprint.get('agent', 'agent')} Summary from the {blueprint.get('agent', 'agent')} AI perspective.
- If the selected agent was not part of the routed workflow, include this note: "{_agent_route_note(style, agent_outputs)}"
- If style is CFO Financial Report, focus on budget, revenue, cost, CAC, ROAS, spend efficiency, and financial risk.
- If style is Founder Strategy Report, focus on market opportunity, growth thesis, positioning, moat, and long-term direction.
- If style is CEO Operations Report, focus on capacity, execution priorities, bottlenecks, coordination, and operating cadence.
- If style is Risk & Audit Report, use risk-first language around controls, attribution, financial risk, operational risk, and mitigation.
- If style is Department Summary, summarize participating departments agent-by-agent.
- If style is Recruiter Demo Report, explain routing, traceability, evaluator checks, and demo value for project review.
- Use markdown headings and bullets. Return parseable sections in this shape: title, label, sections with eyebrow, title, body, bullets, and actions.
- Do not reuse the same Executive Summary / Key Findings / Recommended Actions language for every style.

Routing: {routing or {}}
Evaluation: {evaluation or {}}
Trace completed: {_completed_count(trace)}/9

Agent outputs:
{agent_context}
""".strip()


def _style_sections(style, agent_outputs, routing):
    if style in AGENT_SUMMARY_BLUEPRINTS:
        blueprint = AGENT_SUMMARY_BLUEPRINTS[style]
        agent_key = style.replace("agent_", "")
        output = agent_outputs.get(agent_key)
        signal = _compact(output, 260) if output else _agent_route_note(style, agent_outputs)
        sections = []
        for index, (heading, bullets) in enumerate(blueprint["sections"]):
            next_bullets = list(bullets)
            if index == 1:
                next_bullets.append(f"Available routed signal: {signal}")
            sections.append((heading, next_bullets))
        return sections

    if style != "Department Summary":
        return STYLE_BLUEPRINTS[style]["sections"]

    selected_keys = [key for key in agent_outputs if key in AGENT_LABELS]
    leadership = [AGENT_LABELS[key] for key in selected_keys if key in {"founder", "cofounder", "ceo"}]
    departments = [AGENT_LABELS[key] for key in selected_keys if key not in {"founder", "cofounder", "ceo"}]
    department_text = ", ".join(departments) if departments else "no department agents"
    leadership_text = ", ".join(leadership) if leadership else "leadership agents"
    route = (routing or {}).get("task_type", "general_finance_review")

    return [
        (
            "Department Overview",
            [
                f"FinFlow summarized the routed workflow for {route}, using {leadership_text} to frame the selected department work.",
                f"Selected departments for this run: {department_text}. Unselected departments are omitted from this report.",
            ],
        ),
        (
            "Agent-by-Agent Findings",
            [
                f"{AGENT_LABELS[key]} contributed: {_compact(agent_outputs.get(key), 220)}"
                for key in selected_keys
                if key not in {"founder", "cofounder", "ceo"}
            ]
            or ["No department-specific agent output was selected for this route."],
        ),
        (
            "Department Risks",
            [
                "Department recommendations should be checked for ownership, timing, and conflicts before execution.",
                f"The report should stay scoped to {department_text}; adding unselected departments can create noisy or misleading follow-up.",
            ],
        ),
        (
            "Department Follow-ups",
            [
                "Review the visible department tabs only; they match the routed agents for this workflow.",
                "Assign owners and due dates to the selected department recommendations.",
                "Use full analysis only when every department perspective is intentionally required.",
            ],
        ),
    ]


def _style_agent_signal(style, agent_outputs):
    if style in AGENT_SUMMARY_BLUEPRINTS:
        agent_key = style.replace("agent_", "")
        return _compact(agent_outputs.get(agent_key), 180) if agent_outputs.get(agent_key) else _agent_route_note(style, agent_outputs)

    priority_agents = {
        "Executive Report": ["founder", "ceo", "cfo", "coo"],
        "CFO Financial Report": ["cfo"],
        "Founder Strategy Report": ["founder", "cofounder"],
        "CEO Operations Report": ["ceo", "coo"],
        "Risk & Audit Report": ["cfo", "coo", "cto"],
        "Department Summary": ["cfo", "cmo", "cto", "coo", "creative", "hr"],
        "Recruiter Demo Report": ["founder", "ceo", "cfo", "cmo"],
    }[style]
    snippets = [_compact(agent_outputs.get(agent), 180) for agent in priority_agents if agent_outputs.get(agent)]
    return " | ".join(snippets) if snippets else "No focused agent signal was available."


def _blueprint(style):
    return AGENT_SUMMARY_BLUEPRINTS.get(style) or STYLE_BLUEPRINTS[style]


def _agent_route_note(style, agent_outputs):
    agent = AGENT_SUMMARY_BLUEPRINTS.get(style, {}).get("agent", "This agent")
    agent_key = style.replace("agent_", "")
    if agent_key in agent_outputs:
        return f"{agent} was part of the routed workflow for this document."
    return f"{agent} was not part of the routed workflow; summary is generated as an optional perspective."


def _compact(content, limit=800):
    text = str(content or "No output available.").strip()
    return text if len(text) <= limit else text[:limit].rstrip() + "..."


def _completed_count(trace):
    return sum(1 for item in trace if item.get("status") == "completed")


AGENT_LABELS = {
    "founder": "Founder",
    "cofounder": "Co-Founder",
    "ceo": "CEO",
    "cfo": "CFO",
    "cmo": "CMO",
    "cto": "CTO",
    "coo": "COO",
    "creative": "Creative Director",
    "hr": "HR",
}
