from datetime import datetime, timezone
from time import perf_counter

from services.schemas import AgentTrace


def _now_iso():
    return datetime.now(timezone.utc).isoformat()


def _preview(output, limit=280):
    text = str(output or "").replace("\n", " ").strip()
    return text[:limit]


def run_agent_with_trace(agent_name, role, fn, *args, **kwargs):
    started_at = _now_iso()
    start = perf_counter()
    error = None
    output = None
    status = "running"

    try:
        output = fn(*args, **kwargs)
        status = "completed"
    except Exception as exc:
        status = "failed"
        error = str(exc)
        output = f"{agent_name} failed: {error}"

    ended_at = _now_iso()
    duration_ms = int((perf_counter() - start) * 1000)
    trace = AgentTrace(
        agent_name=agent_name,
        role=role,
        status=status,
        started_at=started_at,
        ended_at=ended_at,
        duration_ms=duration_ms,
        output_preview=_preview(output),
        error=error,
    )

    return output, trace.to_dict()
