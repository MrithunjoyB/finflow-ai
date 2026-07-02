from agents.founder import founder_vision
from agents.cofounder import cofounder_coordinate
from agents.ceo import ceo_operate
from agents.cfo import cfo_analyze
from agents.cmo import cmo_strategize
from agents.cto import cto_manage
from agents.coo import coo_operate
from agents.creative import creative_direct
from agents.hr import hr_manage
import time

def run_corporation(financial_data, company_context="AI Finance Corporation"):
    results = {}
    
    print("🏛️ FOUNDER AI activating...")
    results["founder"] = founder_vision(financial_data)
    time.sleep(1)
    
    print("🤝 CO-FOUNDER AI coordinating...")
    results["cofounder"] = cofounder_coordinate(financial_data, results["founder"])
    time.sleep(1)
    
    print("👔 CEO AI delegating...")
    results["ceo"] = ceo_operate(financial_data, results["founder"])
    time.sleep(1)
    
    print("💰 CFO AI analyzing finances...")
    results["cfo"] = cfo_analyze(financial_data)
    time.sleep(1)
    
    print("📣 CMO AI planning marketing...")
    results["cmo"] = cmo_strategize(financial_data)
    time.sleep(1)
    
    print("⚙️ CTO AI managing tech...")
    results["cto"] = cto_manage(financial_data)
    time.sleep(1)
    
    print("🔄 COO AI optimizing operations...")
    results["coo"] = coo_operate(financial_data)
    time.sleep(1)
    
    print("🎨 Creative Director AI directing...")
    results["creative"] = creative_direct(financial_data)
    time.sleep(1)
    
    print("👥 HR Manager AI managing team...")
    results["hr"] = hr_manage(financial_data)
    
    return results