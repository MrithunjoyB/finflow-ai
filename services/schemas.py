from dataclasses import asdict, dataclass
from typing import Optional


@dataclass
class AgentMessage:
    sender: str
    receiver: str
    task: str
    priority: str
    context: str
    expected_output: str
    confidence: float = 0.0

    def to_dict(self):
        return asdict(self)


@dataclass
class AgentTrace:
    agent_name: str
    role: str
    status: str
    started_at: str
    ended_at: str
    duration_ms: int
    output_preview: str
    error: Optional[str] = None

    def to_dict(self):
        return asdict(self)
