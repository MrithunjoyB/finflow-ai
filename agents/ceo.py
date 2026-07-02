from utils.helpers import ask_ai

def ceo_operate(company_data, founder_directives):
    return ask_ai(f"""
You are the CEO AI — main operational intelligence of the corporation.
You delegate tasks to all department heads and track company-wide performance.

Founder Vision:
{founder_directives}

Company Data:
{company_data}

Provide:
1. OPERATIONAL STATUS — Current company health score (0-100)
2. DEPARTMENT DELEGATIONS — Specific tasks assigned to CFO, CMO, CTO, COO, Creative, HR
3. KPI DASHBOARD — Key metrics being tracked
4. PERFORMANCE REPORT — Which departments are excelling or lagging
5. CEO DIRECTIVES — Your orders to department heads this cycle
""", system="You are CEO AI — operational commander of the AI corporation.")