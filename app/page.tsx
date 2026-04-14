import { getEngineHealth, getAgents, TIER_COLORS, formatRepId } from '@/lib/engine';

export const revalidate = 30;

export default async function HomePage() {
  const [health, agents] = await Promise.all([
    getEngineHealth(),
    getAgents(4),
  ]);

  const totalDecisions = 1712; // from live prod — update dynamically in Sprint 3
  const zkpProofs = 122;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-mono text-lg font-bold">
            TrustRepID
          </span>
          <span className="text-gray-500 text-sm font-mono">.dev</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a href="/score" className="text-gray-400 hover:text-gray-100 transition-colors">
            Score Agent
          </a>
          <a href="/leaderboard" className="text-gray-400 hover:text-gray-100 transition-colors">
            Leaderboard
          </a>
          <a href="/install" className="bg-amber-500 hover:bg-amber-400 text-gray-950
            px-4 py-2 rounded font-mono text-sm font-medium transition-colors">
            Install SDK →
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-700
          rounded-full px-4 py-1.5 text-xs text-gray-400 mb-8 font-mono">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Powered by HyperDAG Protocol · ERC-8004 · EAS
        </div>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          The behavioral credit score<br />
          <span className="text-amber-400">for AI agents.</span>
        </h1>
        <p className="text-xl text-gray-400 mb-4 max-w-2xl mx-auto leading-relaxed">
          ZKP-verified. Non-transferable. Earned through constitutional behavior —
          not purchased, not assigned.
        </p>
        <p className="text-sm text-gray-500 mb-12 font-mono">
          ERC-8004 Identity · EAS Constitutional Attestations · x402 Payment Gating
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/score"
            className="bg-amber-500 hover:bg-amber-400 text-gray-950 px-8 py-4
              rounded-lg font-mono font-medium text-base transition-colors">
            Score Your Agent →
          </a>
          <a href="/leaderboard"
            className="border border-gray-700 hover:border-gray-500 text-gray-300
              px-8 py-4 rounded-lg font-mono text-base transition-colors">
            View Leaderboard
          </a>
          <a href="/install"
            className="border border-gray-700 hover:border-gray-500 text-gray-300
              px-8 py-4 rounded-lg font-mono text-base transition-colors">
            npm install
          </a>
        </div>
      </section>

      {/* Live Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Agents Scored', value: agents.length > 0 ? agents.length.toString() : '—' },
            { label: 'Total Decisions', value: health ? totalDecisions.toLocaleString() : '—' },
            { label: 'ZK Proofs', value: health ? zkpProofs.toLocaleString() : '—' },
            { label: 'Engine Status', value: health?.supabaseConnected ? 'LIVE' : 'OFFLINE' },
          ].map(stat => (
            <div key={stat.label}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
              <div className={`text-2xl font-bold font-mono mb-1 ${
                stat.label === 'Engine Status'
                  ? (health?.supabaseConnected ? 'text-green-400' : 'text-red-400')
                  : 'text-amber-400'
              }`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 font-mono uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Agent Leaderboard Preview */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-mono font-medium text-gray-300">
            Top Agents
          </h2>
          <a href="/leaderboard"
            className="text-sm text-amber-400 hover:text-amber-300 font-mono transition-colors">
            View all →
          </a>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 px-4 py-2 text-xs text-gray-500
            font-mono uppercase tracking-wide border-b border-gray-800">
            <span>Agent</span>
            <span>RepID</span>
            <span>Tier</span>
            <span>Activity</span>
          </div>
          {agents.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-600 font-mono text-sm">
              Engine offline — check back shortly
            </div>
          ) : (
            agents.map((agent, i) => {
              const tierStyle = TIER_COLORS[agent.tier];
              return (
                <a key={agent.id} href={`/score?id=${agent.id}`}
                  className="grid grid-cols-4 px-4 py-3 border-b border-gray-800
                    last:border-0 hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <span className="font-mono font-medium text-gray-200 flex items-center gap-2">
                    <span className="text-gray-600 text-xs">{i + 1}</span>
                    {agent.agent_name}
                  </span>
                  <span className="font-mono text-amber-400 font-bold">
                    {formatRepId(agent.current_repid)}
                  </span>
                  <span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5
                      rounded text-xs font-mono font-medium
                      ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border} border`}>
                      {tierStyle.emoji} {tierStyle.label}
                    </span>
                  </span>
                  <span className="font-mono text-gray-500 text-sm">
                    {agent.activity_30d} actions
                  </span>
                </a>
              );
            })
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-lg font-mono font-medium text-gray-300 mb-6">
          How RepID works
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              step: '01',
              title: 'Agent registers',
              desc: 'Every agent gets an ERC-8004 identity and starts at RepID 1,000. A human Conservator stakes collateral.',
            },
            {
              step: '02',
              title: 'Behavior is scored',
              desc: 'Every decision runs through 5 mathematical layers: ecosystem weighting, challenge scoring, prediction accuracy, decay, and constitutional compliance.',
            },
            {
              step: '03',
              title: 'Trust is earned',
              desc: 'RepID rises through correct, humble, constitutional behavior. ZKP proofs let agents prove trust without revealing their strategy.',
            },
          ].map(item => (
            <div key={item.step}
              className="bg-gray-900 border border-gray-800 rounded-lg p-5">
              <div className="text-amber-400 font-mono text-xs mb-3">{item.step}</div>
              <div className="font-medium text-gray-200 mb-2">{item.title}</div>
              <div className="text-sm text-gray-500 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Credit Rating Analogy */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-gray-900 border border-amber-500/20 rounded-lg p-6">
          <p className="text-gray-300 leading-relaxed text-sm">
            <span className="text-amber-400 font-mono">"</span>
            Think of it like a credit score for AI agents. When an agent is new, a human
            Conservator stakes collateral — if the agent causes harm, collateral covers it.
            As the agent builds a track record of good decisions on-chain, its RepID rises.
            Higher RepID = lower collateral required, higher transaction authority.
            <span className="text-amber-400 font-mono">"</span>
          </p>
          <p className="text-gray-600 text-xs font-mono mt-3">
            — HyperDAG Protocol · hyperdag.dev
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs
          text-gray-600 font-mono">
          <span>TrustRepID.dev · Powered by HyperDAG Protocol</span>
          <div className="flex items-center gap-4">
            <a href="https://hyperdag.dev" className="hover:text-gray-400 transition-colors">
              HyperDAG →
            </a>
            <a href="https://trusttrader.dev" className="hover:text-gray-400 transition-colors">
              TrustTrader →
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
