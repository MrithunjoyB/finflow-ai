from pathlib import Path


CORE_AGENTS = ["founder", "cofounder", "ceo"]
DEFAULT_ROUTE_FILE = Path(__file__).resolve().parents[1] / "task_routing.yaml"


TASK_RULES = [
    {
        "task_type": "invoice_analysis",
        "keywords": ["invoice", "payment", "due", "vendor", "bill"],
        "agents": ["cfo", "coo"],
        "reason": "Detected invoice/payment/amount keywords",
        "confidence": 0.82,
    },
    {
        "task_type": "revenue_analysis",
        "keywords": ["revenue", "income", "sales", "client payment"],
        "agents": ["cfo", "ceo"],
        "reason": "Detected revenue/income/sales keywords",
        "confidence": 0.84,
    },
    {
        "task_type": "expense_review",
        "keywords": ["expense", "cost", "spend", "subscription"],
        "agents": ["cfo", "coo"],
        "reason": "Detected expense/cost/spend keywords",
        "confidence": 0.82,
    },
    {
        "task_type": "risk_assessment",
        "keywords": ["risk", "anomaly", "fraud", "late", "overdue"],
        "agents": ["cfo", "ceo", "coo"],
        "reason": "Detected risk/anomaly/fraud/late keywords",
        "confidence": 0.86,
    },
    {
        "task_type": "market_summary",
        "keywords": ["marketing", "ad", "campaign", "seo", "social"],
        "agents": ["cmo", "ceo"],
        "reason": "Detected marketing/campaign/SEO keywords",
        "confidence": 0.8,
    },
    {
        "task_type": "technical_audit",
        "keywords": ["server", "api", "security", "backend", "frontend"],
        "agents": ["cto", "coo"],
        "reason": "Detected server/API/security keywords",
        "confidence": 0.79,
    },
    {
        "task_type": "operations_review",
        "keywords": ["workflow", "process", "operations", "productivity"],
        "agents": ["coo", "ceo"],
        "reason": "Detected workflow/process/operations keywords",
        "confidence": 0.8,
    },
    {
        "task_type": "content_generation",
        "keywords": ["design", "brand", "content", "creative"],
        "agents": ["creative", "cmo"],
        "reason": "Detected design/brand/content keywords",
        "confidence": 0.78,
    },
]


def detect_task_type(text: str) -> dict:
    content = (text or "").lower()
    routes = load_task_routes()
    best_match = None
    best_score = 0

    for rule in TASK_RULES:
        score = sum(1 for keyword in rule["keywords"] if keyword in content)
        if score > best_score:
            best_match = rule
            best_score = score

    if best_match:
        route = routes.get(best_match["task_type"], {})
        selected_agents = _with_core(best_match["agents"])
        confidence = min(0.95, best_match["confidence"] + ((best_score - 1) * 0.04))
        return {
            "task_type": best_match["task_type"],
            "priority": route.get("priority", "high"),
            "selected_agents": selected_agents,
            "reason": best_match["reason"],
            "confidence": round(confidence, 2),
        }

    route = routes.get("general_finance_review", {})
    return {
        "task_type": "general_finance_review",
        "priority": route.get("priority", "normal"),
        "selected_agents": _with_core(["cfo", "coo"]),
        "reason": "No specialized route matched; using general finance review",
        "confidence": 0.62,
    }


def load_task_routes(path=DEFAULT_ROUTE_FILE):
    if not Path(path).exists():
        return {}

    routes = {}
    current = None
    list_key = None

    for raw_line in Path(path).read_text(encoding="utf-8").splitlines():
        line = raw_line.rstrip()
        stripped = line.strip()

        if not stripped or stripped.startswith("#"):
            continue

        if not line.startswith(" ") and stripped.endswith(":"):
            current = stripped[:-1]
            routes[current] = {}
            list_key = None
            continue

        if current is None or ":" not in stripped and not stripped.startswith("-"):
            continue

        if stripped.startswith("-") and list_key:
            routes[current].setdefault(list_key, []).append(stripped[1:].strip())
            continue

        key, value = stripped.split(":", 1)
        key = key.strip()
        value = value.strip().strip('"')
        if value:
            routes[current][key] = value
            list_key = None
        else:
            routes[current][key] = []
            list_key = key

    return routes


def _with_core(agents):
    selected = []
    for agent in CORE_AGENTS + agents:
        if agent not in selected:
            selected.append(agent)
    return selected
