/**
 * Honest metrics computation. Given the three Supabase query results, return real counts — or a
 * degraded marker if ANY query errored. It NEVER fabricates numbers: not-checked is reported as
 * `available: false`, not as a plausible-looking count. (The old route returned hardcoded
 * {agents:33,vdr:50,…} on error and reported 0 on a per-query error — fabricated data presented as
 * real, the exact defect RULE-4 exists to stop.)
 */
export interface QueryResult<T = Record<string, unknown>> {
  data: T[] | null;
  error: unknown;
}

export interface Metrics {
  available: boolean;
  agents?: number;
  vdr?: number;
  decisions?: number;
  providers?: number;
  hallucinations?: number;
  error?: string;
}

export function computeMetrics(
  agents: QueryResult<{ vdr_count?: number }>,
  decisions: QueryResult<{ llm_provider?: string }>,
  hallucinations: QueryResult,
): Metrics {
  if (agents.error || decisions.error || hallucinations.error) {
    return { available: false, error: 'metrics_unavailable' };
  }
  const vdr = (agents.data ?? []).reduce((s, a) => s + (a.vdr_count ?? 0), 0);
  const providers = new Set((decisions.data ?? []).map((d) => d.llm_provider)).size;
  return {
    available: true,
    agents: agents.data?.length ?? 0,
    vdr,
    decisions: decisions.data?.length ?? 0,
    providers,
    hallucinations: hallucinations.data?.length ?? 0,
  };
}
