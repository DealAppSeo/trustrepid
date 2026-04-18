import { getAgents, TIER_COLORS, formatRepId } from '@/lib/engine';

export const revalidate = 30;

export default async function LeaderboardPage() {
  const agents = await getAgents(20).catch(() => null);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-amber-400 font-mono text-lg font-bold">
          TrustRepID<span className="text-gray-500">.dev</span>
        </a>
        <a href="/install" className="bg-amber-500 hover:bg-amber-400 text-gray-950
          px-4 py-2 rounded font-mono text-sm font-medium">Install SDK →</a>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Leaderboard</h1>
            <p className="text-gray-500 text-sm font-mono">
              Live RepID rankings · updated every 30s
            </p>
          </div>
          <a href="/score"
            className="border border-gray-700 hover:border-gray-500 text-gray-300
              px-4 py-2 rounded font-mono text-sm transition-colors">
            Score Agent →
          </a>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 px-4 py-3 text-xs text-gray-500
            font-mono uppercase tracking-wide border-b border-gray-800">
            <span>#</span>
            <span className="col-span-2">Agent</span>
            <span>RepID</span>
            <span>Tier</span>
          </div>
          {agents === null ? (
            <div className="px-4 py-12 text-center text-gray-600 font-mono text-sm">
              Engine offline
            </div>
          ) : agents.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-600 font-mono text-sm">
              No agents registered yet
            </div>
          ) : (
            agents.map((agent, i) => {
              const tier = TIER_COLORS[agent.tier];
              return (
                <a key={agent.id} href={`/score?id=${agent.id}`}
                  className="grid grid-cols-5 px-4 py-4 border-b border-gray-800
                    last:border-0 hover:bg-gray-800/50 transition-colors">
                  <span className={`font-mono font-bold text-sm ${
                    i === 0 ? 'text-amber-400' :
                    i === 1 ? 'text-gray-300' :
                    i === 2 ? 'text-amber-700' : 'text-gray-600'
                  }`}>{i + 1}</span>
                  <div className="col-span-2">
                    <div className="font-mono font-medium text-gray-200">
                      {agent.agent_name}
                    </div>
                    <div className="text-gray-600 text-xs font-mono truncate max-w-[160px]">
                      {agent.erc8004_address.slice(0, 10)}...
                    </div>
                  </div>
                  <span className="font-mono font-bold text-amber-400">
                    {formatRepId(agent.current_repid)}
                  </span>
                  <span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5
                      rounded text-xs font-mono border
                      ${tier.bg} ${tier.text} ${tier.border}`}>
                      {tier.emoji}
                    </span>
                  </span>
                </a>
              );
            })
          )}
        </div>

        <p className="text-center text-gray-700 text-xs font-mono mt-6">
          RepID is earned through constitutional behavior —
          not purchased, not transferable, not assignable.
        </p>
      </div>
    </main>
  );
}
