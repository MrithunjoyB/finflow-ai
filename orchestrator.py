from agents.analyst import analyze_document
from agents.reporter import generate_report
from agents.advisor import generate_advice

def run_pipeline(file_path):
    print("🔍 Agent 1: Analyzing document...")
    analysis = analyze_document(file_path)
    
    print("📊 Agent 2: Generating report...")
    report = generate_report(analysis)
    
    print("💡 Agent 3: Generating advice...")
    advice = generate_advice(analysis)
    
    return {
        "analysis": analysis,
        "report": report,
        "advice": advice
    }