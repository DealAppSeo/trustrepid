import { getAgents, getPublicStats, formatRepId } from '@/lib/engine';

export const dynamic = 'force-dynamic';

export default async function PacificaPage() {
  const [agents, stats] = await Promise.all([
    getAgents(4).catch(() => []),
    getPublicStats(),
  ]);
  const sophia = agents.find(a => a.agent_name === 'SOPHIA');

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 px-6 py-4">
        <a href="/" className="text-amber-400 font-mono text-lg font-bold">
          TrustRepID<span className="text-gray-500">.dev</span>
        </a>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-16 pb-24">
        <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-700
          rounded-full px-4 py-1.5 text-xs text-gray-400 mb-8 font-mono">
          Pacifica Hackathon · Constitutional Trading Agent
        </div>
        <h1 className="text-4xl font-bold mb-6">
          A constitutional trading agent<br />
          <span className="text-amber-400">with a veto you can inspect.</span>
        </h1>
        <p className="text-lg text-gray-400 mb-4 max-w-2xl leading-relaxed">
          HAL (Hallucination Assessment Layer) scores a claim and vetoes it when the
          score is over a threshold. The formula and thresholds are public on the{' '}
          <a href="/hal" className="text-amber-400 underline">HAL page</a>.
          HAL is a classifier, not a guarantee: it misses some false claims and
          flags some true ones. Test network only.
        </p>

        {/* Live counters from the engine's public API. Volume, not accuracy. */}
        <div className="grid sm:grid-cols-2 gap-6 mb-3">
          {[
            { label: 'HAL decisions scored', value: stats ? stats.decisionsScored.toLocaleString() : '—' },
            { label: 'Audit-chain entries', value: stats ? stats.auditChainLength.toLocaleString() : '—' },
          ].map(stat => (
            <div key={stat.label}
              className="bg-gray-900 border border-gray-800 rounded-lg p-5 text-center">
              <div className="text-3xl font-bold font-mono mb-1 text-amber-400">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 font-mono">{stat.label}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 font-mono mb-12">
          Live counters from the RepID engine&apos;s public API. They show volume, not accuracy.
        </p>

        {/* SOPHIA live */}
        {sophia && (
          <div className="bg-gray-900 border border-amber-500/30 rounded-lg p-5 mb-8">
            <div className="text-xs text-gray-500 font-mono mb-2">Live agent · HAL</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono font-bold text-lg">SOPHIA</div>
                <div className="text-3xl font-bold font-mono text-amber-400">
                  {formatRepId(sophia.current_repid)}
                  <span className="text-base text-gray-600 ml-2">RepID</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-amber-400 font-mono text-sm">● {sophia.tier}</div>
                <div className="text-gray-600 text-xs font-mono mt-1">
                  {sophia.activity_30d} decisions this month
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <a href="/challenge"
            className="bg-amber-500 hover:bg-amber-400 text-gray-950 px-6 py-3
              rounded-lg font-mono font-medium">
            Challenge HAL →
          </a>
          <a href="/score"
            className="border border-gray-700 hover:border-gray-500 text-gray-300
              px-6 py-3 rounded-lg font-mono">
            View RepID Scores
          </a>
        </div>
      </div>
    </main>
  );
}
