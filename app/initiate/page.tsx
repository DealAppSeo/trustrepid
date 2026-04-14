import { getAgents, TIER_COLORS, formatRepId } from '@/lib/engine';

export const revalidate = 30;

export default async function InitiatePage() {
  const agents = await getAgents(4);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 px-6 py-4">
        <a href="/" className="text-amber-400 font-mono text-lg font-bold">
          TrustRepID<span className="text-gray-500">.dev</span>
        </a>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-16 pb-24">
        {/* INITIATE-specific hero */}
        <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-700
          rounded-full px-4 py-1.5 text-xs text-gray-400 mb-8 font-mono">
          INITIATE Hackathon · ZKP Reputation Infrastructure
        </div>
        <h1 className="text-4xl font-bold mb-6">
          ZKP behavioral reputation<br />
          <span className="text-amber-400">for any appchain.</span>
        </h1>
        <p className="text-lg text-gray-400 mb-4 max-w-2xl leading-relaxed">
          TrustRepID is the trust primitive missing from agentic commerce.
          EAS attestations via ERC-8004 ValidationRegistry.
          x402 payment gating by proven behavior.
          Any chain. Any agent.
        </p>
        <div className="flex gap-4 mb-16">
          <a href="/install"
            className="bg-amber-500 hover:bg-amber-400 text-gray-950 px-6 py-3
              rounded-lg font-mono font-medium">
            Integrate Now →
          </a>
          <a href="/score"
            className="border border-gray-700 hover:border-gray-500 text-gray-300
              px-6 py-3 rounded-lg font-mono">
            Live Demo
          </a>
        </div>

        {/* Live agents */}
        <h2 className="font-mono text-gray-400 text-sm mb-4 uppercase tracking-wide">
          Live agents on HyperDAG Protocol
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {agents.map(agent => {
            const tier = TIER_COLORS[agent.tier];
            return (
              <div key={agent.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-medium">{agent.agent_name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded border font-mono
                    ${tier.bg} ${tier.text} ${tier.border}`}>
                    {tier.emoji}
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-amber-400">
                  {formatRepId(agent.current_repid)}
                  <span className="text-sm text-gray-600 ml-1">RepID</span>
                </div>
                <div className="text-xs text-gray-600 font-mono mt-1 truncate">
                  {agent.erc8004_address}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tech stack */}
        <div className="mt-12 grid sm:grid-cols-3 gap-4 text-sm">
          {[
            { label: 'Identity', value: 'ERC-8004 IdentityRegistry' },
            { label: 'Attestation', value: 'EAS via ValidationRegistry' },
            { label: 'Payment Gate', value: 'x402 + RepID tier check' },
            { label: 'ZKP Proofs', value: 'Postcard / Envelope / Package' },
            { label: 'Scoring', value: '5-layer behavioral engine' },
            { label: 'Governance', value: 'Futarchy + quadratic voting' },
          ].map(item => (
            <div key={item.label}
              className="bg-gray-900 border border-gray-800 rounded p-3">
              <div className="text-gray-500 text-xs font-mono mb-1">{item.label}</div>
              <div className="text-gray-200 text-sm font-mono">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
