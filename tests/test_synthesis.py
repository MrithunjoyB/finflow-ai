from agents import synthesis
from utils.llm_providers import request_force_demo


AGENT_OUTPUTS = {
    "founder": "positioning growth thesis moat long-term direction",
    "cofounder": "coordination scaling plan",
    "ceo": "execution capacity priorities operating cadence",
    "cfo": "revenue budget CAC ROAS ad spend capital efficiency",
    "cmo": "campaign SEO audience conversion channel mix",
    "coo": "operations bottlenecks fulfillment capacity",
    "creative": "brand creative fatigue content angles",
}


def test_demo_cfo_report_differs_from_founder_report():
    with request_force_demo(True):
        cfo_report = synthesis.synthesize_report(
            AGENT_OUTPUTS,
            report_style="CFO Financial Report",
            routing={"task_type": "market_summary"},
        )
        founder_report = synthesis.synthesize_report(
            AGENT_OUTPUTS,
            report_style="Founder Strategy Report",
            routing={"task_type": "market_summary"},
        )

    assert cfo_report != founder_report
    assert "Financial Summary" in cfo_report
    assert "CAC" in cfo_report
    assert "ROAS" in cfo_report
    assert "Strategic Summary" in founder_report
    assert "Growth Thesis" in founder_report
    assert "moat" in founder_report.lower()


def test_demo_cfo_report_differs_from_department_summary():
    routed_outputs = {
        "founder": "positioning and strategic direction",
        "cofounder": "coordination plan",
        "ceo": "executive priorities",
        "cmo": "campaign SEO conversion audience growth",
        "creative": "brand content creative fatigue",
        "cfo": "ad spend CAC ROAS revenue attribution budget risk",
    }

    with request_force_demo(True):
        cfo_report = synthesis.synthesize_report(
            routed_outputs,
            report_style="CFO Financial Report",
            routing={"task_type": "market_summary", "selected_agents": list(routed_outputs)},
        )
        department_report = synthesis.synthesize_report(
            routed_outputs,
            report_style="Department Summary",
            routing={"task_type": "market_summary", "selected_agents": list(routed_outputs)},
        )

    assert cfo_report != department_report
    assert "## Financial Summary" in cfo_report
    assert "CAC" in cfo_report
    assert "ROAS" in cfo_report
    assert "## Department Overview" in department_report
    assert "CMO" in department_report
    assert "Creative Director" in department_report
    assert "CFO" in department_report
    assert "CTO" not in department_report
    assert "COO" not in department_report
    assert "HR" not in department_report


def test_demo_recruiter_report_has_project_language():
    with request_force_demo(True):
        report = synthesis.synthesize_report(
            AGENT_OUTPUTS,
            report_style="Recruiter Demo Report",
            routing={"task_type": "revenue_analysis"},
        )

    assert "Project Demo Summary" in report
    assert "trace" in report.lower()
    assert "demo mode" in report.lower()
    assert "recruiters" in report.lower()


def test_demo_agent_summary_optional_perspective_when_not_routed():
    with request_force_demo(True):
        report = synthesis.synthesize_report(
            {"founder": "strategy", "ceo": "execution", "cfo": "revenue cost risk"},
            report_style="agent_cto",
            routing={"task_type": "revenue_analysis", "selected_agents": ["founder", "ceo", "cfo"]},
        )

    assert "CTO Summary" in report
    assert "CTO Perspective" in report
    assert "not part of the routed workflow" in report
    assert "optional perspective" in report


def test_stable_report_style_ids_are_accepted():
    with request_force_demo(True):
        overall_report = synthesis.synthesize_report(
            AGENT_OUTPUTS,
            report_style="overall_executive",
            routing={"task_type": "market_summary"},
        )
        cfo_report = synthesis.synthesize_report(
            AGENT_OUTPUTS,
            report_style="cfo_financial",
            routing={"task_type": "market_summary"},
        )
        founder_report = synthesis.synthesize_report(
            AGENT_OUTPUTS,
            report_style="agent_founder",
            routing={"task_type": "market_summary"},
        )

    assert "Executive Summary" in overall_report
    assert "Financial Summary" in cfo_report
    assert "Founder Summary" in founder_report
    assert "Founder Perspective" in founder_report


def test_live_synthesis_prompt_receives_report_style(monkeypatch):
    captured = {}

    def fake_ask_ai(prompt, system, force_demo=False):
        captured["prompt"] = prompt
        captured["system"] = system
        captured["force_demo"] = force_demo
        return "## Strategic Summary\n- live founder strategy\n\n## Founder Actions\n- choose a growth thesis"

    monkeypatch.setattr(synthesis, "ask_ai", fake_ask_ai)

    with request_force_demo(False):
        report = synthesis.synthesize_report(
            AGENT_OUTPUTS,
            report_style="agent_cfo",
            routing={"task_type": "revenue_analysis"},
        )

    assert "agent_cfo" in captured["prompt"]
    assert "CFO Summary" in captured["prompt"]
    assert "CFO AI perspective" in captured["prompt"]
    assert captured["force_demo"] is False
    assert "live founder strategy" in report
