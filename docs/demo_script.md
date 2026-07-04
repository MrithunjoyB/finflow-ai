# 60-Second Demo Script

## Opening Problem

Small teams often lose hours reviewing invoices, expense CSVs, and finance reports by hand. They need quick summaries, risk signals, and recommended actions, but enterprise finance tools can be too heavy for early-stage teams.

## What FinFlow Does

FinFlow AI Corporation is a task-routed multi-agent finance operations prototype. A user uploads a PDF, CSV, or TXT file. FinFlow parses the document, detects the finance workflow, routes the work to the right agents, logs every agent step, evaluates output completeness, and synthesizes a final executive report.

## Live Demo Steps

1. Start the Flask backend with `python3 server.py`.
2. Start the React frontend with `cd frontend && npm run dev`.
3. Open `http://localhost:5173`.
4. Upload `samples/sample_invoice.txt`.
5. Show the detected route: `invoice_analysis`.
6. Show the final executive report.
7. Show the trace timeline with agent status and duration.
8. Open department tabs to show the 9-agent corporation structure.

## Architecture Explanation

The system keeps a leadership layer with Founder, Co-Founder, and CEO agents. Then a task router selects relevant department agents such as CFO, COO, CMO, CTO, Creative, and HR. Each agent call is traced. The evaluator checks whether the outputs contain core finance review sections. The synthesis agent combines everything into one report.

## Why It Matters

This is not just a prompt demo. It shows routing, orchestration, traceability, demo-safe execution, and API compatibility, which are important building blocks for agentic AI systems.

## Closing Pitch

FinFlow is a hackathon and internship-ready prototype for autonomous finance operations. It is intentionally lightweight today, but the architecture creates a clear path toward stronger evaluation, forecasting, anomaly detection, secure accounts, and real finance integrations.
