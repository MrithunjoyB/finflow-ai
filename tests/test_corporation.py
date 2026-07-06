import corporation
from agents.evaluator import evaluate_outputs
from services.trace_logger import run_agent_with_trace


def test_run_corporation_returns_trace_and_synthesis(monkeypatch):
    def fake_agent(label):
        return lambda *args, **kwargs: (
            f"{label} financial summary risk action workflow operations "
            "recommend validate not financial advice"
        )

    monkeypatch.setattr(corporation, "founder_vision", fake_agent("founder"))
    monkeypatch.setattr(corporation, "cofounder_coordinate", fake_agent("cofounder"))
    monkeypatch.setattr(corporation, "ceo_operate", fake_agent("ceo"))
    monkeypatch.setattr(corporation, "cfo_analyze", fake_agent("cfo"))
    monkeypatch.setattr(corporation, "cmo_strategize", fake_agent("cmo"))
    monkeypatch.setattr(corporation, "cto_manage", fake_agent("cto"))
    monkeypatch.setattr(corporation, "coo_operate", fake_agent("coo"))
    monkeypatch.setattr(corporation, "creative_direct", fake_agent("creative"))
    monkeypatch.setattr(corporation, "hr_manage", fake_agent("hr"))

    result = corporation.run_corporation("revenue,expenses,risk", full_analysis=True)

    assert result["founder"].startswith("founder financial summary risk action")
    assert result["agents"]["cfo"].startswith("cfo financial summary risk action")
    assert len(result["trace"]) == 9
    assert all(item["status"] == "completed" for item in result["trace"])
    assert all("started_at" in item and "ended_at" in item for item in result["trace"])
    assert result["messages"][0]["sender"] == "User Upload"
    assert "Executive Report" in result["final_report"]
    assert result["evaluation"]["score"] == 100
    assert result["evaluation"]["passed"] is True


def test_run_corporation_routed_market_summary_only_returns_selected_agents(monkeypatch):
    def fake_agent(label):
        return lambda *args, **kwargs: (
            f"{label} financial summary risk action workflow operations "
            "recommend validate not financial advice"
        )

    monkeypatch.setattr(corporation, "founder_vision", fake_agent("founder"))
    monkeypatch.setattr(corporation, "cofounder_coordinate", fake_agent("cofounder"))
    monkeypatch.setattr(corporation, "ceo_operate", fake_agent("ceo"))
    monkeypatch.setattr(corporation, "cfo_analyze", fake_agent("cfo"))
    monkeypatch.setattr(corporation, "cmo_strategize", fake_agent("cmo"))
    monkeypatch.setattr(corporation, "cto_manage", fake_agent("cto"))
    monkeypatch.setattr(corporation, "coo_operate", fake_agent("coo"))
    monkeypatch.setattr(corporation, "creative_direct", fake_agent("creative"))
    monkeypatch.setattr(corporation, "hr_manage", fake_agent("hr"))

    result = corporation.run_corporation(
        "Campaign report with ad spend, CAC, ROAS, SEO, social, brand content, and revenue attribution.",
        full_analysis=False,
    )

    assert result["routing"]["task_type"] == "market_summary"
    assert result["selected_agent_keys"] == [
        "founder",
        "cofounder",
        "ceo",
        "cmo",
        "creative",
        "cfo",
    ]
    assert set(result["agents"]) == set(result["selected_agent_keys"])
    assert "CTO" not in result["selected_agents"]
    assert "COO" not in result["selected_agents"]
    assert "HR" not in result["selected_agents"]
    assert "cto" not in result
    assert "coo" not in result["agents"]
    assert "hr" not in result["agents"]
    assert len(result["trace"]) == len(result["selected_agent_keys"])
    assert result["evaluation"]["checks"]["agent_completeness"] is True


def test_run_agent_trace_records_completed_trace():
    output, trace = run_agent_with_trace(
        "Test Agent", "Unit test role", lambda: "finished output"
    )

    assert output == "finished output"
    assert trace["agent_name"] == "Test Agent"
    assert trace["status"] == "completed"
    assert trace["started_at"]
    assert trace["ended_at"]
    assert trace["duration_ms"] >= 0
    assert trace["output_preview"] == "finished output"


def test_run_agent_trace_records_failures():
    def broken_agent():
        raise RuntimeError("agent offline")

    output, trace = run_agent_with_trace("Broken Agent", "Failure test", broken_agent)

    assert "agent offline" in output
    assert trace["status"] == "failed"
    assert trace["error"] == "agent offline"


def test_evaluator_returns_score():
    evaluation = evaluate_outputs(
        {
            "founder": "risk assessment and caution validate before decisions",
            "cofounder": "workflow coordination observations",
            "ceo": "recommended action and KPI operational plan",
            "cfo": "financial summary revenue expense budget cash flow",
            "cmo": "market opportunity",
            "cto": "security risk",
            "coo": "operations workflow",
            "creative": "communication opportunity",
            "hr": "team observations",
        }
    )

    assert 0 <= evaluation["score"] <= 100
    assert evaluation["passed"] is True
    assert evaluation["missing_sections"] == []
    assert isinstance(evaluation["recommendations"], list)
