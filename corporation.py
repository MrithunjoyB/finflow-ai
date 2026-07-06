from agents.ceo import ceo_operate
from agents.cfo import cfo_analyze
from agents.cmo import cmo_strategize
from agents.cofounder import cofounder_coordinate
from agents.coo import coo_operate
from agents.creative import creative_direct
from agents.cto import cto_manage
from agents.evaluator import evaluate_outputs
from agents.founder import founder_vision
from agents.hr import hr_manage
from agents.synthesis import normalize_report_style, synthesize_report
from services.schemas import AgentMessage
from services.task_router import detect_task_type
from services.trace_logger import run_agent_with_trace
from utils.llm_providers import request_force_demo


AGENT_ROLES = {
    "founder": ("Founder AI", "Strategic vision and master oversight"),
    "cofounder": ("Co-Founder AI", "Scaling and cross-department coordination"),
    "ceo": ("CEO AI", "Operational delegation and KPI orchestration"),
    "cfo": ("CFO AI", "Financial analysis, risk, and forecasting"),
    "cmo": ("CMO AI", "Market insight and growth strategy"),
    "cto": ("CTO AI", "Technical validation and security review"),
    "coo": ("COO AI", "Workflow optimization and operational execution"),
    "creative": ("Creative Director AI", "Brand, content, and UX direction"),
    "hr": ("HR Manager AI", "Resource allocation and team performance"),
}


def run_corporation(
    financial_data,
    company_context="AI Finance Corporation",
    run_id=None,
    full_analysis=False,
    force_demo=None,
    report_style="Executive Report",
):
    with request_force_demo(force_demo):
        return _run_corporation(
            financial_data,
            company_context=company_context,
            run_id=run_id,
            full_analysis=full_analysis,
            report_style=report_style,
        )


def _run_corporation(
    financial_data,
    company_context="AI Finance Corporation",
    run_id=None,
    full_analysis=False,
    report_style="Executive Report",
):
    agent_outputs = {}
    trace = []
    messages = []
    routing = detect_task_type(financial_data)
    selected_agent_keys = _selected_agent_keys(routing, full_analysis)
    selected_agents = set(selected_agent_keys)

    def run(key, fn, *args):
        agent_name, role = AGENT_ROLES[key]
        output, agent_trace = run_agent_with_trace(agent_name, role, fn, *args)
        agent_outputs[key] = output
        trace.append(agent_trace)
        return output

    messages.append(
        AgentMessage(
            sender="User Upload",
            receiver="Founder AI",
            task="analyze_financial_context",
            priority="high",
            context=company_context,
            expected_output="Strategic direction, risk assessment, and executive directives",
            confidence=1.0,
        ).to_dict()
    )

    print("🏛️ FOUNDER AI activating...")
    founder = run("founder", founder_vision, financial_data)

    messages.append(
        AgentMessage(
            sender="Founder AI",
            receiver="Co-Founder AI",
            task="coordinate_strategy",
            priority="high",
            context="Founder directives and uploaded financial context",
            expected_output="Scaling plan and inter-department memo",
            confidence=0.88,
        ).to_dict()
    )
    print("🤝 CO-FOUNDER AI coordinating...")
    run("cofounder", cofounder_coordinate, financial_data, founder)

    messages.append(
        AgentMessage(
            sender="Founder AI",
            receiver="CEO AI",
            task="delegate_department_work",
            priority="high",
            context="Founder directives and company data",
            expected_output="Department delegations, KPI dashboard, and operating plan",
            confidence=0.9,
        ).to_dict()
    )
    print("👔 CEO AI delegating...")
    run("ceo", ceo_operate, financial_data, founder)

    department_plan = [
        ("cfo", cfo_analyze, "💰 CFO AI analyzing finances..."),
        ("cmo", cmo_strategize, "📣 CMO AI planning marketing..."),
        ("cto", cto_manage, "⚙️ CTO AI managing tech..."),
        ("coo", coo_operate, "🔄 COO AI optimizing operations..."),
        ("creative", creative_direct, "🎨 Creative Director AI directing..."),
        ("hr", hr_manage, "👥 HR Manager AI managing team..."),
    ]

    for key, fn, log_line in department_plan:
        if key not in selected_agents:
            continue

        agent_name, role = AGENT_ROLES[key]
        messages.append(
            AgentMessage(
                sender="CEO AI",
                receiver=agent_name,
                task=f"department_review_{key}",
                priority="normal" if key not in {"cfo", "cto"} else "high",
                context="Uploaded financial context and CEO operating priorities",
                expected_output=role,
                confidence=0.82,
            ).to_dict()
        )
        print(log_line)
        run(key, fn, financial_data)

    evaluation = evaluate_outputs(agent_outputs, required_agent_keys=selected_agent_keys)
    selected_report_style = normalize_report_style(report_style)
    final_report = synthesize_report(
        agent_outputs,
        trace=trace,
        evaluation=evaluation,
        report_style=selected_report_style,
        routing=routing,
    )

    return {
        **agent_outputs,
        "run_id": run_id,
        "routing": routing,
        "report_style": selected_report_style,
        "full_analysis": full_analysis,
        "selected_agent_keys": selected_agent_keys,
        "selected_agents": [_display_agent_name(key) for key in selected_agent_keys],
        "agents": agent_outputs,
        "messages": messages,
        "trace": trace,
        "final_report": final_report,
        "evaluation": evaluation,
    }


def _selected_agent_keys(routing, full_analysis):
    if full_analysis:
        return list(AGENT_ROLES.keys())

    selected = []
    for key in routing.get("selected_agents", []):
        if key in AGENT_ROLES and key not in selected:
            selected.append(key)
    return selected


def _display_agent_name(key):
    name = AGENT_ROLES[key][0]
    if name == "HR Manager AI":
        return "HR"
    return name.replace(" AI", "")
