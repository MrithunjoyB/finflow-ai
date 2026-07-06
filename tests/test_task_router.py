from services.task_router import detect_task_type


def test_detect_task_type_identifies_invoice_analysis():
    result = detect_task_type(
        "Invoice INV-2026-0142 from vendor Acme Cloud. Payment due date and bill total."
    )

    assert result["task_type"] == "invoice_analysis"
    assert result["priority"] == "high"
    assert {"founder", "cofounder", "ceo", "cfo", "coo"}.issubset(
        result["selected_agents"]
    )
    assert result["confidence"] >= 0.8


def test_detect_task_type_identifies_revenue_analysis():
    result = detect_task_type(
        "date,category,description,amount,type\n2026-01-03,Revenue,Client payment,12500,income"
    )

    assert result["task_type"] == "revenue_analysis"
    assert "cfo" in result["selected_agents"]
    assert "ceo" in result["selected_agents"]


def test_detect_task_type_falls_back_to_general_finance_review():
    result = detect_task_type("General quarterly document with mixed financial notes.")

    assert result["task_type"] == "general_finance_review"
    assert result["selected_agents"] == ["founder", "cofounder", "ceo", "cfo", "coo"]
    assert result["confidence"] < 0.7


def test_detect_task_type_routes_marketing_to_cmo_and_creative():
    result = detect_task_type(
        "Campaign plan for SEO, social media ads, brand content, audience growth, and conversion."
    )

    assert result["task_type"] == "market_summary"
    assert "cmo" in result["selected_agents"]
    assert "creative" in result["selected_agents"]
    assert "ceo" in result["selected_agents"]
    assert "cfo" not in result["selected_agents"]
    assert "cto" not in result["selected_agents"]
    assert "coo" not in result["selected_agents"]
    assert "hr" not in result["selected_agents"]


def test_detect_task_type_routes_marketing_finance_metrics_to_cfo():
    result = detect_task_type(
        "Campaign report: ad spend $4200, CAC $18, ROAS 3.4x, revenue attribution, conversion rate, influencer engagement."
    )

    assert result["task_type"] == "market_summary"
    assert {"founder", "cofounder", "ceo", "cmo", "creative", "cfo"}.issubset(
        result["selected_agents"]
    )
    assert "cto" not in result["selected_agents"]
    assert "coo" not in result["selected_agents"]
    assert "hr" not in result["selected_agents"]
    assert "CFO" in result["reason"]
