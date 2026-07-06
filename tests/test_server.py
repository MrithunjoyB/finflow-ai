import io

import server


def test_api_health():
    client = server.app.test_client()

    response = client.get("/api/health")

    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "AI Corporation Online"
    assert "live_available" in data
    assert "llm_provider" in data
    assert "available_providers" in data
    assert "csv" in data["allowed_extensions"]


def test_rejects_unsupported_file_type():
    client = server.app.test_client()

    response = client.post(
        "/api/analyze",
        data={"file": (io.BytesIO(b"not allowed"), "notes.exe")},
        content_type="multipart/form-data",
    )

    assert response.status_code == 400
    assert "Unsupported file type" in response.get_json()["error"]


def test_analyze_returns_run_id(monkeypatch):
    client = server.app.test_client()

    def fake_run_corporation(raw_data, run_id=None, full_analysis=False, force_demo=None, report_style="Executive Report"):
        assert "Revenue" in raw_data
        assert run_id
        assert full_analysis is False
        assert force_demo is True
        assert report_style == "Founder Strategy Report"
        return {
            "run_id": run_id,
            "routing": {"task_type": "revenue_analysis"},
            "report_style": report_style,
            "full_analysis": full_analysis,
            "selected_agent_keys": ["founder", "cofounder", "ceo", "cfo"],
            "selected_agents": ["Founder", "Co-Founder", "CEO", "CFO"],
            "founder": "demo founder report",
            "cfo": "demo cfo report",
            "agents": {"founder": "demo founder report", "cfo": "demo cfo report"},
            "trace": [],
            "evaluation": {"score": 100, "passed": True},
            "final_report": "demo final report",
        }

    monkeypatch.setattr(server, "run_corporation", fake_run_corporation)

    response = client.post(
        "/api/analyze",
        data={
            "file": (
                io.BytesIO(b"date,description,amount\n2026-01-01,Revenue,1000\n"),
                "sample.csv",
            ),
            "analysis_mode": "demo",
            "report_style": "Founder Strategy Report",
        },
        content_type="multipart/form-data",
    )

    data = response.get_json()
    assert response.status_code == 200
    assert data["success"] is True
    assert data["run_id"]
    assert data["routing"]["task_type"] == "revenue_analysis"
    assert data["mode_used"] == "demo"
    assert data["report_style"] == "Founder Strategy Report"
    assert data["founder"] == "demo founder report"
    assert data["final_report"] == "demo final report"


def test_backward_compatible_health_route():
    client = server.app.test_client()

    response = client.get("/health")

    assert response.status_code == 200


def test_full_analysis_false_returns_success_in_demo_mode():
    client = server.app.test_client()

    response = client.post(
        "/api/analyze",
        data={
            "full_analysis": "false",
            "file": (
                io.BytesIO(
                    b"Invoice INV-2026-0142 vendor Acme payment due total amount"
                ),
                "invoice.txt",
            ),
        },
        content_type="multipart/form-data",
    )

    data = response.get_json()
    assert response.status_code == 200
    assert data["success"] is True
    assert data["full_analysis"] is False
    assert data["routing"]["task_type"] == "invoice_analysis"
    assert data["trace"]
    assert data["final_report"]


def test_live_mode_without_provider_returns_clear_error(monkeypatch):
    client = server.app.test_client()
    monkeypatch.setattr(server, "is_live_available", lambda: False)

    response = client.post(
        "/api/analyze",
        data={
            "analysis_mode": "live",
            "file": (io.BytesIO(b"Revenue,1000"), "sample.csv"),
        },
        content_type="multipart/form-data",
    )

    data = response.get_json()
    assert response.status_code == 400
    assert data["success"] is False
    assert data["mode_used"] == "demo"
    assert data["error"] == "Live LLM Mode is unavailable. Configure a valid provider API key or switch to Demo Mode."


def test_health_with_placeholder_key_reports_live_unavailable(monkeypatch):
    client = server.app.test_client()
    monkeypatch.setattr(server, "is_live_available", lambda: False)
    monkeypatch.setattr(server, "get_available_providers", lambda: [])
    monkeypatch.setattr(server, "get_active_provider", lambda: None)

    response = client.get("/api/health")

    data = response.get_json()
    assert response.status_code == 200
    assert data["live_available"] is False
    assert data["available_providers"] == []
    assert data["llm_provider"] is None


def test_analyze_live_with_placeholder_key_returns_clean_error(monkeypatch):
    client = server.app.test_client()
    monkeypatch.setattr(server, "is_live_available", lambda: False)

    response = client.post(
        "/api/analyze",
        data={
            "analysis_mode": "live",
            "file": (io.BytesIO(b"date,description,amount\n2026-01-01,Revenue,1000\n"), "sample.csv"),
        },
        content_type="multipart/form-data",
    )

    data = response.get_json()
    assert response.status_code == 400
    assert data["success"] is False
    assert data["mode_used"] == "demo"
    assert data["error"] == "Live LLM Mode is unavailable. Configure a valid provider API key or switch to Demo Mode."


def test_health_demo_default_can_still_report_live_available(monkeypatch):
    client = server.app.test_client()
    monkeypatch.setattr(server, "DEMO_MODE", True)
    monkeypatch.setattr(server, "is_live_available", lambda: True)
    monkeypatch.setattr(server, "get_available_providers", lambda: ["groq"])
    monkeypatch.setattr(server, "get_active_provider", lambda: "groq")

    response = client.get("/api/health")

    data = response.get_json()
    assert response.status_code == 200
    assert data["demo_mode"] is True
    assert data["live_available"] is True
    assert data["available_providers"] == ["groq"]
    assert data["llm_provider"] == "groq"
