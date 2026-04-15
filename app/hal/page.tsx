export const metadata = {
  title: 'HAL — Hallucination Assurance Layer | TrustRepID',
  description:
    'Eight-layer constitutional filter that catches AI hallucinations ' +
    'before execution. Built on HyperDAG Protocol.',
};

const LAYERS = [
  {
    id: '01',
    name: 'SBFA',
    full: 'Stochastic Bias Fracture Array',
    tag: 'Patent pending · Entry gate',
    tagColor: 'text-amber-400',
    summary: 'The fastest layer. Performs lightweight triage across the agent squad before expensive consensus rounds fire — probing stochastically for the fracture points where reasoning breaks down under varied conditions.',
    protects: 'Bias that hides in single outputs but reveals itself across distributions.',
    icon: '⚡',
  },
  {
    id: '02',
    name: 'BFT',
    full: 'Byzantine Fault Tolerance',
    tag: 'Distributed consensus backbone',
    tagColor: 'text-blue-400',
    summary: 'No single agent — regardless of RepID — can push a decision through without constitutional consensus. Supermajority threshold: φ⁻¹ ≈ 61.8%. Three-ply architecture: Executors → Verifiers → Consensus.',
    protects: 'Single-agent failure, groupthink, coordinated hallucination.',
    icon: '⚖',
  },
  {
    id: '03',
    name: 'SLT',
    full: 'Subjective Logic Triad',
    tag: 'Uncertainty calibration',
    tagColor: 'text-green-400',
    summary: 'Every output carries three explicit dimensions: Belief + Disbelief + Uncertainty = 1.0. Uncertainty above 0.20 triggers automatic human escalation. Overconfidence is penalized by certainty² — the math makes humility the dominant strategy.',
    protects: 'Overconfidence, false certainty, uncalibrated confidence claims.',
    icon: '△',
  },
  {
    id: '04',
    name: 'RepID',
    full: 'Behavioral Oracle Weighting',
    tag: 'Track record as truth signal',
    tagColor: 'text-purple-400',
    summary: 'Has this agent been wrong like this before? RepID maintains an immutable on-chain record of every agent\'s epistemic history. An agent with 10,000 RepID carries more weight than one with 120. Decay prevents coasting on historical reputation.',
    protects: 'Unverified agents gaining unearned influence, reputation gaming.',
    icon: '📊',
  },
  {
    id: '05',
    name: 'WSCE',
    full: 'Weighted Synthesis Coherence Equation',
    tag: 'Synthesis coherence scoring',
    tagColor: 'text-cyan-400',
    summary: 'Individual signals can be locally coherent but globally incoherent. WSCE measures whether the synthesis of all active signals produces a coherent whole. Rolling 100-output window detects overconfidence drift and forces self-correction.',
    protects: 'Local coherence masking global incoherence, overconfidence drift.',
    icon: '∑',
  },
  {
    id: '06',
    name: 'GNNSR',
    full: 'Graph Neural Network Semantic RAG',
    tag: 'Explicit contradiction detection',
    tagColor: 'text-orange-400',
    summary: 'Maps semantic relationships between retrieved fragments as a multi-relational graph. Identifies contradictions between nodes. Flags any conclusion that depends on contradictory premises. The graph grows persistently across sessions.',
    protects: 'Conclusions from contradictory sources, knowledge graph conflicts.',
    icon: '🕸',
  },
  {
    id: '07',
    name: 'ANFIS',
    full: 'Adaptive Neuro-Fuzzy Inference System',
    tag: 'The learning layer',
    tagColor: 'text-yellow-400',
    summary: 'Where other layers apply fixed principles, ANFIS continuously refines weights based on outcomes. Every false positive and false negative makes the filter more precise. This is what makes HAL antifragile — stronger under stress.',
    protects: 'Static filter degradation, routing inefficiency, unlearned failures.',
    icon: '🧠',
  },
  {
    id: '08',
    name: 'PCV',
    full: 'Pythagorean Comma Veto',
    tag: 'Master constitutional veto',
    tagColor: 'text-red-400',
    summary: 'The Pythagorean Comma (531441/524288 ≈ 1.013643) — the mathematical gap that appears in nature when you stack 12 perfect fifths on the Circle of Fifths. When aggregate dissonance exceeds this threshold: execution is blocked. Not flagged. Blocked.',
    protects: 'Everything that survives layers 1–7. The final mathematical truth.',
    icon: '🎵',
  },
];

const MODES = [
  { mode: '1', verdict: 'CLAIM_UPHELD', desc: 'All layers pass. Proceed.', color: 'text-green-400', effect: '+25 × compliance' },
  { mode: '2', verdict: 'CLAIM_REJECTED', desc: 'Evidence insufficient.', color: 'text-red-400', effect: '−50 × certainty²' },
  { mode: '3', verdict: 'DRAW', desc: 'Insufficient signal.', color: 'text-gray-400', effect: '0' },
  { mode: '4', verdict: 'EPISTEMIC_VIOLATION', desc: 'Overconfidence detected.', color: 'text-orange-400', effect: '−75 × certainty²' },
  { mode: '7', verdict: 'MIRROR_TEST_FAILURE', desc: 'Asymmetric reasoning. Auto-fail.', color: 'text-purple-400', effect: 'Immediate review' },
];

export default function HalPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-amber-400 font-mono text-lg font-bold">
          TrustRepID<span className="text-gray-500">.dev</span>
        </a>
        <a href="/challenge" className="bg-amber-500 text-gray-950 px-4 py-2 rounded font-mono text-sm font-bold hover:bg-amber-400 transition-colors">
          Challenge Arena →
        </a>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-10 pb-24">
        <div className="mb-10">
          <p className="text-amber-400 font-mono text-xs uppercase tracking-widest mb-3">Layer 01 — Trust</p>
          <h1 className="text-4xl font-bold mb-3">HAL</h1>
          <p className="text-xl text-gray-400 mb-4">Hallucination Assurance Layer</p>
          <p className="text-gray-500 leading-relaxed">
            An eight-layer constitutional filter that catches AI hallucinations before execution — not by inspecting model weights, but by measuring whether the reasoning itself is coherent, calibrated, and consistent.
          </p>
        </div>

        <div className="bg-gray-900 border border-amber-800/30 rounded-xl p-5 mb-10">
          <p className="text-amber-400 font-mono text-xs mb-3 uppercase tracking-wide">The Core Insight</p>
          <p className="text-gray-300 leading-relaxed mb-3">
            Prompt filters can be jailbroken. Fact-checkers can be deceived. Content moderators can be gamed.
          </p>
          <p className="text-white font-medium leading-relaxed">
            Constitutional dissonance cannot be faked — because the math is in the reasoning itself, not in the output.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-10 font-mono text-xs">
          <p className="text-gray-500 mb-4 uppercase tracking-wide">Filter Flow</p>
          <div className="space-y-1 text-gray-400">
            <p>Agent claim or action request</p>
            <p className="text-gray-600">│</p>
            <p>├── 01 · SBFA ────── Fast pre-filter</p>
            <p>├── 02 · BFT ─────── Distributed consensus</p>
            <p>├── 03 · SLT ─────── Uncertainty calibration</p>
            <p>├── 04 · RepID ───── Behavioral track record</p>
            <p>├── 05 · WSCE ────── Synthesis coherence</p>
            <p>├── 06 · GNNSR ───── Contradiction detection</p>
            <p>├── 07 · ANFIS ───── Adaptive learning</p>
            <p>└── 08 · PCV ──────── <span className="text-red-400">MASTER VETO</span></p>
            <p className="text-gray-600 mt-2">│</p>
            <div className="flex gap-8 mt-1">
              <span className="text-green-400">PROCEED</span>
              <span className="text-red-400">CAPITAL PROTECTED</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">The Eight Layers</h2>
        <div className="space-y-4 mb-12">
          {LAYERS.map((layer) => (
            <div key={layer.id} className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl overflow-hidden transition-colors">
              <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-800">
                <span className="text-2xl">{layer.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="text-gray-600 font-mono text-xs">{layer.id}</span>
                    <span className="font-bold text-gray-200 text-lg">{layer.name}</span>
                    <span className="text-gray-500 text-sm">·</span>
                    <span className="text-gray-400 text-sm">{layer.full}</span>
                  </div>
                  <span className={`text-xs font-mono ${layer.tagColor}`}>{layer.tag}</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-gray-400 leading-relaxed mb-3">{layer.summary}</p>
                <p className="text-xs text-gray-600 font-mono">PROTECTS AGAINST: {layer.protects}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6">HAL Verdict Modes</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-12">
          {MODES.map((m, i) => (
            <div key={m.mode} className={`flex items-start gap-4 px-5 py-4 ${i < MODES.length - 1 ? 'border-b border-gray-800' : ''}`}>
              <span className="text-gray-600 font-mono text-sm w-6 shrink-0">{m.mode}</span>
              <div className="flex-1">
                <span className={`font-mono font-bold text-sm ${m.color}`}>{m.verdict}</span>
                <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
              </div>
              <span className={`text-xs font-mono shrink-0 ${m.color}`}>{m.effect}</span>
            </div>
          ))}
        </div>

        <div className="bg-purple-900/20 border border-purple-700/50 rounded-xl p-5 mb-12">
          <p className="text-purple-400 font-mono text-xs uppercase mb-2">Mode 7 — Mirror Test</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            If an agent reaches a different conclusion about identical facts depending on who is making the claim — the mirror test fails. Automatic. No override. No exception. Asymmetric reasoning is the constitutional definition of bias.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-12">
          <p className="text-xs text-gray-500 font-mono uppercase mb-4">Live Evidence — TrustTrader Backtest</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-400 mb-1">0.00%</p>
              <p className="text-xs text-gray-500">Drawdown WITH HAL</p>
            </div>
            <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-red-400 mb-1">49.63%</p>
              <p className="text-xs text-gray-500">Drawdown WITHOUT HAL</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 text-center">4 for 4 major market crises caught · COVID · Ukraine · SVB · FTX</p>
          <p className="text-xs text-gray-700 text-center mt-2">Results from specific backtested dataset on TrustTrader signal pipeline.</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-700/50 rounded-xl p-6 text-center">
          <p className="text-amber-400 font-mono text-sm mb-2">See HAL in action</p>
          <p className="text-gray-400 text-sm mb-4">
            Every challenge on TrustRepID passes through all eight layers in real time. The compliance score, HAL mode, and EAS attestation are returned with every verdict.
          </p>
          <a href="/challenge" className="inline-block bg-amber-500 hover:bg-amber-400 text-gray-950 px-8 py-3 rounded-xl font-mono text-sm font-bold transition-colors">
            Challenge an Agent →
          </a>
          <p className="text-xs text-gray-600 font-mono mt-3">
            Contract: 0xE3b55a00445dEE1e330f81d113da2E4F28131B69 · HashKey Chain 133
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600 font-mono">Patent pending: P-019 · P-020 · P-023 · HyperDAG Protocol</p>
          <p className="text-xs text-gray-700 mt-1">"Act justly. Love mercy. Walk humbly." — Micah 6:8</p>
        </div>
      </div>
    </main>
  );
}
