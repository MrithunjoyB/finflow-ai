REQUIRED_AGENT_KEYS = {
    "founder",
    "cofounder",
    "ceo",
    "cfo",
    "cmo",
    "cto",
    "coo",
    "creative",
    "hr",
}


def evaluate_outputs(agent_outputs, required_agent_keys=None):
    combined = " ".join(str(value) for value in agent_outputs.values()).lower()
    expected_agents = set(REQUIRED_AGENT_KEYS if required_agent_keys is None else required_agent_keys)
    missing_agents = sorted(expected_agents - set(agent_outputs.keys()))

    checks = {
        "financial_summary": _contains_any(
            combined, ["financial", "revenue", "expense", "budget", "cash flow", "p&l"]
        ),
        "risk_assessment": _contains_any(
            combined, ["risk", "threat", "bottleneck", "anomaly", "security"]
        ),
        "actionable_recommendations": _contains_any(
            combined, ["action", "recommend", "directive", "next step", "prioritize"]
        ),
        "operational_observations": _contains_any(
            combined, ["workflow", "operations", "operational", "productivity", "kpi"]
        ),
        "disclaimer_or_caution": _contains_any(
            combined, ["not financial advice", "not investment advice", "validate", "review"]
        ),
        "agent_completeness": not missing_agents,
    }
    missing_sections = [name for name, passed in checks.items() if not passed]
    score = round((sum(checks.values()) / len(checks)) * 100)

    recommendations = []
    if missing_agents:
        recommendations.append(f"Restore missing agent outputs: {', '.join(missing_agents)}.")
    if "financial_summary" in missing_sections:
        recommendations.append("Strengthen CFO output with revenue, expense, budget, or cash-flow summary.")
    if "risk_assessment" in missing_sections:
        recommendations.append("Add explicit risks, anomalies, threats, or bottlenecks.")
    if "actionable_recommendations" in missing_sections:
        recommendations.append("Add concrete recommended actions or next steps.")
    if "operational_observations" in missing_sections:
        recommendations.append("Add COO/CEO operational observations, workflow notes, or KPIs.")
    if "disclaimer_or_caution" in missing_sections:
        recommendations.append("Add a caution/disclaimer telling users to validate outputs before decisions.")

    return {
        "score": score,
        "passed": score >= 80,
        "missing_sections": missing_sections,
        "recommendations": recommendations,
        "checks": checks,
    }


def _contains_any(text, keywords):
    return any(keyword in text for keyword in keywords)
