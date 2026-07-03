import io

import server


def test_api_health():
    client = server.app.test_client()

    response = client.get("/api/health")

    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "AI Corporation Online"
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

    def fake_run_corporation(raw_data, run_id=None):
        assert "Revenue" in raw_data
        assert run_id
        return {
            "run_id": run_id,
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
            )
        },
        content_type="multipart/form-data",
    )

    data = response.get_json()
    assert response.status_code == 200
    assert data["success"] is True
    assert data["run_id"]
    assert data["founder"] == "demo founder report"
    assert data["final_report"] == "demo final report"


def test_backward_compatible_health_route():
    client = server.app.test_client()

    response = client.get("/health")

    assert response.status_code == 200
