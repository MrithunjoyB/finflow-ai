export type HealthResponse = {
  status: string;
  demo_mode: boolean;
  live_available: boolean;
  llm_provider: string;
  available_providers: string[];
  supported_providers?: string[];
  allowed_extensions: string[];
};

export type RoutingResult = {
  task_type: string;
  priority: string;
  selected_agents: string[];
  reason: string;
  confidence: number;
};

export type AgentTrace = {
  agent_name: string;
  role: string;
  status: "running" | "completed" | "failed" | string;
  started_at?: string;
  ended_at?: string;
  duration_ms: number;
  output_preview?: string;
  error?: string | null;
};

export type EvaluationResult = {
  score: number;
  passed: boolean;
  missing_sections: string[];
  recommendations: string[];
  checks?: Record<string, boolean>;
};

export type AnalyzeResponse = {
  success: boolean;
  error?: string;
  run_id: string;
  full_analysis?: boolean;
  mode_used?: "demo" | "live" | string;
  llm_provider?: string | null;
  report_style?: string;
  routing?: RoutingResult;
  selected_agents?: string[];
  selected_agent_keys?: string[];
  agents?: Record<string, string>;
  trace?: AgentTrace[];
  evaluation?: EvaluationResult;
  final_report?: string;
  founder?: string;
  cofounder?: string;
  ceo?: string;
  cfo?: string;
  cmo?: string;
  cto?: string;
  coo?: string;
  creative?: string;
  hr?: string;
};
