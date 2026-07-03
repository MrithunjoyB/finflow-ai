def synthesize_report(agent_outputs, trace=None, evaluation=None):
    trace = trace or []
    evaluation = evaluation or {}

    report_lines = [
        "# FinFlow AI Corporation Executive Report",
        "",
        "## Executive Summary",
        "FinFlow processed the uploaded financial context through a traceable 9-agent corporation workflow. The system combines strategic, financial, operational, technical, marketing, creative, and HR perspectives into one executive report.",
        "",
        "## Financial Snapshot",
        _compact(agent_outputs.get("cfo")),
        "",
        "## Risks",
        "- Review cash flow, expense concentration, operational bottlenecks, data quality, and any anomalies flagged by the CFO, CTO, or COO agents.",
        _compact(agent_outputs.get("founder"), 500),
        "",
        "## Opportunities",
        "- Use CEO delegations, CMO growth insights, and Creative positioning to convert finance findings into concrete operating experiments.",
        _compact(agent_outputs.get("cmo"), 500),
        "",
        "## Recommended Actions",
        "- Validate extracted figures against the original document before making decisions.",
        "- Prioritize CFO recommendations for budget health, revenue tracking, and risk control.",
        "- Convert CEO and COO outputs into follow-up tasks with owners and due dates.",
        "- Use the trace data to inspect failed, slow, or low-confidence agent steps.",
        "",
        "## Agent Coverage",
        f"- Agents completed: {_completed_count(trace)}/9",
        f"- Evaluation score: {evaluation.get('score', 'not evaluated')}",
        "",
        "## Department Highlights",
    ]

    for title, key in [
        ("Founder Strategic Direction", "founder"),
        ("Co-Founder Coordination", "cofounder"),
        ("CEO Operating Plan", "ceo"),
        ("CFO Financial Analysis", "cfo"),
        ("CMO Market Perspective", "cmo"),
        ("CTO Technical Review", "cto"),
        ("COO Operations Review", "coo"),
        ("Creative Direction", "creative"),
        ("HR Resource View", "hr"),
    ]:
        report_lines.extend([f"### {title}", _compact(agent_outputs.get(key)), ""])

    report_lines.extend(
        [
            "## Disclaimer",
            "This prototype is for workflow demonstration and educational review. It is not financial, legal, tax, investment, or professional advice.",
        ]
    )
    return "\n".join(report_lines)


def synthesize_executive_report(agent_outputs):
    return synthesize_report(agent_outputs)


def _compact(content, limit=800):
    text = str(content or "No output available.").strip()
    return text if len(text) <= limit else text[:limit].rstrip() + "..."


def _completed_count(trace):
    return sum(1 for item in trace if item.get("status") == "completed")
