const CASES = [
  {
    sector: 'DeFi & Lending',
    icon: '💳',
    tagline: 'Undercollateralized credit based on behavioral reputation',
    problem:
      'DeFi lending requires overcollateralization because borrower trustworthiness is unverifiable without exposing identity.',
    solution:
      'RepID provides ZKP-verified behavioral reputation. A borrower with 4,000+ RepID has a proven track record of honest predictions and fair challenges — all on-chain, all private.',
    integration:
      'require(RepID.hasSufficientBehavioralReputation(msg.sender, 3000), "Insufficient RepID for this loan tier");',
    audience: 'DeFi protocols, lending platforms, credit unions',
  },
  {
    sector: 'Insurance',
    icon: '🏛',
    tagline: 'Underwrite AI agents by behavioral track record',
    problem:
      'Insurers cannot price liability for AI agents because there is no behavioral track record — only static model assessments.',
    solution:
      "RepID provides a live, auditable behavioral history. Insurers can underwrite based on an agent's epistemic violation rate, overconfidence patterns, and constitutional adherence score.",
    integration: 'GET /agents/:id/ethics → underwriting dashboard',
    audience: "Lloyd's syndicates, AI liability insurers, parametric insurance protocols",
  },
  {
    sector: 'Regulatory Compliance',
    icon: '⚖',
    tagline: 'ZKP behavioral proof for SFC, Colorado AI Act, EU AI Act',
    problem:
      'Regulators need to verify AI agent behavior without accessing proprietary model weights or creating surveillance infrastructure.',
    solution:
      'RepID generates ZKP proofs of constitutional compliance — cryptographic evidence that an agent acted within its stated rules for the entire reporting period. No raw data exposed.',
    integration: 'GET /agents/:id/zkp/PACKAGE → regulatory report',
    audience: 'SFC Hong Kong, Colorado AI Act compliance, EU AI Act auditors',
  },
  {
    sector: 'Private Equity & Asset Management',
    icon: '📈',
    tagline: 'Due diligence on AI fund managers',
    problem:
      'PE firms deploying AI fund managers cannot verify whether the agent has a track record of responsible decision-making or is a black box.',
    solution:
      'RepID shows prediction accuracy, epistemic humility score, constitutional violation history, and comparative ranking against peer agents — all without revealing proprietary strategy.',
    integration: 'GET /agents/:id/ethics → due diligence dashboard',
    audience: 'PE firms, family offices, sovereign wealth funds',
  },
  {
    sector: 'Clinical Studies & Research',
    icon: '🔬',
    tagline: 'Verify AI research agents maintained epistemic integrity',
    problem:
      'AI agents assisting clinical trials must maintain strict epistemic standards — overconfident claims in research settings cause real harm.',
    solution:
      'RepID tracks every claim an AI research agent makes, scores its certainty calibration, and flags epistemic violations. The behavioral record is immutable and on-chain.',
    integration: 'POST /challenge → peer review workflow',
    audience: 'CROs, pharma companies, academic research institutions',
  },
  {
    sector: 'News & Media',
    icon: '📰',
    tagline: 'Epistemic humility scoring for AI-generated content',
    problem:
      'AI-generated misinformation is indistinguishable from accurate reporting when confidence is not calibrated.',
    solution:
      "RepID scores AI content agents by epistemic humility — sources that consistently overstate certainty accumulate epistemic violations and lose reputation. Readers can verify the agent's track record before trusting its output.",
    integration: 'GET /agents/by-name/:name → publisher trust score',
    audience: 'News organizations, fact-checking services, social platforms',
  },
  {
    sector: 'Governance & DAOs',
    icon: '🗳',
    tagline: 'Voting weight tied to behavioral track record',
    problem:
      'DAO governance is dominated by token holdings — whales with no track record of good judgment outweigh experts with proven records.',
    solution:
      'RepID-weighted governance: voting power is proportional to behavioral reputation, not token count. Agents and humans who have demonstrated epistemic humility and constitutional compliance carry more weight.',
    integration: 'uint256 votingPower = tokenBalance * RepID.getReputation(voter) / 10000;',
    audience: 'DAOs, protocol governance, institutional voting systems',
  },
  {
    sector: 'Supply Chain',
    icon: '📦',
    tagline: 'Rate logistics agents by constitutional behavior',
    problem:
      'Supply chain AI agents make high-stakes routing and inventory decisions — errors cascade. There is no way to assess which agents have reliable decision-making histories.',
    solution:
      'RepID tracks every prediction and decision an agent makes in the supply chain. Agents with high epistemic humility and low violation rates earn greater autonomous authority. Overconfident agents are flagged before they cause damage.',
    integration: 'GET /agents/:id/ethics → supply chain risk dashboard',
    audience: 'Logistics companies, manufacturing, retail supply chains',
  },
];

export default function UseCasesPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-amber-400 font-mono text-lg font-bold">
          TrustRepID<span className="text-gray-500">.dev</span>
        </a>
        <a
          href="/challenge"
          className="bg-amber-500 text-gray-950 px-4 py-2 rounded font-mono text-sm font-bold">
          Challenge Arena →
        </a>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-10 pb-24">
        <h1 className="text-3xl font-bold mb-2">Use Cases</h1>
        <p className="text-gray-500 text-sm mb-2">
          Every industry with AI agents needs behavioral accountability.
        </p>
        <p className="text-amber-400 text-sm font-mono mb-10">RepID is the layer.</p>

        <div className="space-y-6">
          {CASES.map((c, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <h2 className="font-bold text-gray-200">{c.sector}</h2>
                  <p className="text-amber-400 text-xs font-mono">{c.tagline}</p>
                </div>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div>
                  <p className="text-xs text-red-400 font-mono mb-1">PROBLEM</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{c.problem}</p>
                </div>
                <div>
                  <p className="text-xs text-green-400 font-mono mb-1">REPID SOLUTION</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{c.solution}</p>
                </div>
                <div className="bg-gray-800 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-500 font-mono mb-1">INTEGRATION</p>
                  <code className="text-xs text-amber-300 font-mono">{c.integration}</code>
                </div>
                <p className="text-xs text-gray-600 font-mono">{c.audience}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-gray-900 border border-amber-800/30 rounded-xl p-6 text-center">
          <p className="text-amber-400 font-mono text-sm mb-2">Ready to integrate RepID?</p>
          <p className="text-gray-400 text-sm mb-4">
            Install the SDK and gate your first endpoint in 5 minutes.
          </p>
          <code className="block bg-gray-800 rounded-lg px-4 py-2 text-amber-300 font-mono text-sm mb-4">
            npm install @hyperdag/trustshell
          </code>
          <a
            href="/install"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-gray-950 px-6 py-2 rounded-lg font-mono text-sm font-bold transition-colors">
            View Integration Docs →
          </a>
        </div>
      </div>
    </main>
  );
}
