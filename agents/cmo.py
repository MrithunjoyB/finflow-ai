from utils.helpers import ask_ai

def cmo_strategize(company_data):
    return ask_ai(f"""
You are the CMO AI — Chief Marketing Officer of the AI corporation.
Workers under you:
- Content Writer Agents
- Social Media Agents
- SEO Agents
- Ad Campaign Agents
- Trend Analysis Agents

Company Context:
{company_data}

Provide:
1. CAMPAIGN STATUS — Active marketing campaigns
2. SOCIAL MEDIA REPORT — Platform performance
3. SEO STRATEGY — Current keywords and ranking goals
4. AD OPTIMIZATION — Budget allocation across channels
5. CONTENT PIPELINE — What content is being generated
6. TREND ANALYSIS — What's trending in the market
7. WORKER TASKS — What each marketing agent is doing
8. GROWTH METRICS — Leads, conversions, brand awareness score
""", system="You are CMO AI — creative and analytical marketing commander.")