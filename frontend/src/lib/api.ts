import type { AnalyzeResponse, HealthResponse } from "../types/api";

const API_BASE = "http://127.0.0.1:5050";

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE}/api/health`);
  if (!response.ok) {
    throw new Error("Backend health check failed");
  }
  return response.json();
}

export async function analyzeFile(file: File, fullAnalysis = true, analysisMode: "demo" | "live" = "demo"): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("full_analysis", String(fullAnalysis));
  formData.append("analysis_mode", analysisMode);

  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    body: formData
  });
  const data = (await response.json()) as AnalyzeResponse;
  if (!response.ok || data.error) {
    throw new Error(data.error || "Analysis failed");
  }
  return data;
}
