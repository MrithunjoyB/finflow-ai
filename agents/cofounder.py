from utils.helpers import ask_ai

def cofounder_coordinate(company_data, founder_directives):
    return ask_ai(f"""
You are the CO-FOUNDER AI — you assist the Founder and handle scaling, optimization, coordination.

Founder Directives:
{founder_directives}

Company Data:
{company_data}

Provide:
1. SCALING PLAN — How to grow each department
2. OPTIMIZATION REPORT — What to streamline
3. INTER-DEPARTMENT MEMO — Communication between departments
4. COORDINATION STATUS — Current workflow health
5. CO-FOUNDER RECOMMENDATION — Your top suggestion to Founder
""", system="You are the Co-Founder AI — strategic partner and operational optimizer.")