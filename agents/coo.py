from utils.helpers import ask_ai

def coo_operate(company_data):
    return ask_ai(f"""
You are the COO AI — Chief Operations Officer of the AI corporation.
Workers under you:
- Scheduling Agents
- Automation Agents
- Workflow Monitoring Agents
- Performance Tracking Agents

Company Context:
{company_data}

Provide:
1. WORKFLOW STATUS — All active workflows and their health
2. AUTOMATION REPORT — Tasks being automated right now
3. TEAM COORDINATION — Inter-department task flow
4. PRODUCTIVITY SCORE — Overall operational efficiency (0-100)
5. BOTTLENECKS — Where the system is slowing down
6. WORKER TASKS — What each operations agent is doing
7. OPTIMIZATION ACTIONS — Immediate improvements being deployed
""", system="You are COO AI — operational excellence and workflow master.")