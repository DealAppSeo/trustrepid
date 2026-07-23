// Live counts from the engine's PUBLIC endpoints. The prior direct-Supabase
// counts 401/return-0 under RLS (that was the ticker's "0 agents scored").
const ENGINE_URL =
  process.env.NEXT_PUBLIC_REPID_ENGINE_URL ||
  'https://repid-engine-production.up.railway.app';

async function engineJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${ENGINE_URL}${path}`, { next: { revalidate: 60 } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export default async function LiveMetricsBar() {
  const [mintedRes, boardRes, halRes] = await Promise.all([
    engineJson<{ agents?: unknown[] }>('/api/v1/agents/minted?limit=500'),
    engineJson<{ providers?: unknown[] }>('/api/v1/leaderboard'),
    engineJson<{ total_classifications?: number; audit_chain_length?: number }>('/api/v1/hal/stats'),
  ]);

  const agents = Array.isArray(mintedRes?.agents) ? mintedRes!.agents!.length : 0;
  const providers = Array.isArray(boardRes?.providers) ? boardRes!.providers!.length : 0;
  const decisions = halRes?.total_classifications ?? 0;
  const vdrTotal = halRes?.audit_chain_length ?? 0;

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
      <span>● Designed toward EU AI Act Art. 14 (human oversight)</span>
      <span>● Bootstrapping mode: labeled by design</span>
    </div>
  );
}
