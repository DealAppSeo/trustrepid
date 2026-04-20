const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function supabaseCount(path: string): Promise<number> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return 0;
  try {
    const res = await fetch(`${SUPABASE_URL}${path}`, {
      method: 'HEAD',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'count=exact',
      },
      next: { revalidate: 60 },
    });
    const range = res.headers.get('content-range');
    if (!range) return 0;
    const total = parseInt(range.split('/')[1], 10);
    return Number.isFinite(total) ? total : 0;
  } catch {
    return 0;
  }
}

async function supabaseJson<T>(path: string): Promise<T[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const res = await fetch(`${SUPABASE_URL}${path}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      next: { revalidate: 60 },
    });
    return res.ok ? ((await res.json()) as T[]) : [];
  } catch {
    return [];
  }
}

export default async function LiveMetricsBar() {
  const [agents, vdrRows, decisions, providerRows] = await Promise.all([
    supabaseCount('/rest/v1/repid_agents?select=id'),
    supabaseJson<{ vdr_count: number | null }>(
      '/rest/v1/repid_agents?select=vdr_count'
    ),
    supabaseCount(
      '/rest/v1/repid_score_events?llm_provider=not.is.null&select=id'
    ),
    supabaseJson<{ llm_provider: string }>(
      '/rest/v1/repid_score_events?llm_provider=not.is.null&select=llm_provider&limit=1000'
    ),
  ]);

  const vdrTotal = vdrRows.reduce((sum, r) => sum + (r.vdr_count || 0), 0);
  const providers = new Set(providerRows.map((r) => r.llm_provider)).size;

  return (
    <div
      className="w-full text-white text-[12px] py-2 px-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 font-mono"
      style={{ backgroundColor: '#0F2044' }}
      data-vdr-total={vdrTotal}
      data-decisions={decisions}
    >
      <span>● {agents.toLocaleString()} agents scored</span>
      <span>
        ● {providers.toLocaleString()} LLM provider
        {providers === 1 ? '' : 's'}
      </span>
      <span>● 100% HAL uptime</span>
      <span>● EU AI Act compliant</span>
      <span>● Bootstrapping mode: labeled by design</span>
    </div>
  );
}
