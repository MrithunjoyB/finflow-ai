from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def test_frontend_sends_selected_report_style_in_analyze_request():
    api_source = (ROOT / "frontend/src/lib/api.ts").read_text(encoding="utf-8")
    app_source = (ROOT / "frontend/src/App.tsx").read_text(encoding="utf-8")

    assert 'formData.append("report_style", reportStyle)' in api_source
    assert "selectedReportStyle.id" in app_source


def test_final_report_has_style_specific_fallback_profiles():
    source = (ROOT / "frontend/src/components/FinalReport.tsx").read_text(
        encoding="utf-8"
    )

    assert 'cfo_financial: ["Financial Summary", "Financial Signals", "Financial Risks", "CFO Action Plan"]' in source
    assert 'department_summary: ["Department Overview", "Agent-by-Agent Findings", "Department Risks", "Department Follow-ups"]' in source
    assert "FinFlow evaluated the uploaded context through a finance lens" in source
    assert "FinFlow summarized the routed departments involved in this workflow" in source


def test_report_style_selector_includes_report_and_agent_options():
    source = (ROOT / "frontend/src/lib/reportStyles.ts").read_text(encoding="utf-8")

    assert "overall_executive" in source
    assert "Overall Executive Report" in source
    for option_id in [
        "agent_founder",
        "agent_cofounder",
        "agent_ceo",
        "agent_cfo",
        "agent_cmo",
        "agent_cto",
        "agent_coo",
        "agent_creative",
        "agent_hr",
    ]:
        assert option_id in source

    assert "FINAL SYNTHESIS" in source
    assert "ROUTED AGENT SUMMARIES" in source
    assert "getReportOptionsForAgents" in source


def test_report_style_selector_removes_duplicate_broad_styles():
    source = (ROOT / "frontend/src/lib/reportStyles.ts").read_text(encoding="utf-8")

    for removed_id in [
        "cfo_financial",
        "founder_strategy",
        "ceo_operations",
        "risk_audit",
        "department_summary",
        "recruiter_demo",
    ]:
        assert removed_id not in source


def test_revenue_route_selector_options_are_context_aware():
    source = (ROOT / "frontend/src/lib/reportStyles.ts").read_text(encoding="utf-8")
    hero_source = (ROOT / "frontend/src/components/HeroSection.tsx").read_text(
        encoding="utf-8"
    )

    assert 'return [defaultReportStyle, ...routedAgentOptions]' in source
    assert "getReportOptionsForAgents(selectedAgentKeys)" in hero_source
    assert "Upload a document to activate routed agent summaries." in hero_source
