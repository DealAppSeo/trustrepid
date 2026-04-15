export const metadata = {
  title: 'Research — HAL-RINS | TrustRepID',
  description: 'Constitutional AI Immune System research dashboard — pre-registered hypotheses and study status.',
};

export default function ResearchPage() {
  const studies = [
    { label: 'Study A', desc: 'Layer Ablation', status: 'In Progress' },
    { label: 'Study B', desc: 'Type Mapping', status: 'Designed' },
    { label: 'Study C', desc: 'Order Permutation', status: 'Designed' },
  ];
  const hypotheses = [
    'H1: Full 8-layer HAL achieves highest true positive catch rate',
    'H2: PCV is the single highest-value layer',
    'H3: SBFA provides unique value for statistical prompts',
    'H4: BFT+PCV achieves >60% of full HAL at <30% latency',
    'H5: Small models benefit MORE from full HAL than large models',
    'H6: Overconfidence (>85%) is strongest hallucination predictor',
    'H7: ANFIS shows measurable improvement on repeated runs',
  ];
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-amber-400 font-mono text-lg font-bold">
          TrustRepID<span className="text-gray-500">.dev</span>
        </a>
        <a href="/challenge" className="bg-amber-500 text-gray-950 px-4 py-2 rounded font-mono text-sm font-bold">
          Challenge Arena →
        </a>
      </nav>
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-24 text-center">
        <p className="text-amber-400 font-mono text-xs uppercase tracking-widest mb-4">HAL-RINS Research</p>
        <h1 className="text-4xl font-bold mb-4">Constitutional AI Immune System</h1>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          The first federated zero-knowledge proof hallucination immunity network. Three peer-review grade studies in progress. Results published with full cryptographic reproducibility.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-12">
          {studies.map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="font-mono font-bold text-amber-400 mb-1">{s.label}</p>
              <p className="text-sm text-gray-300">{s.desc}</p>
              <p className="text-xs text-gray-600 mt-2 font-mono">{s.status}</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-left">
          <p className="text-xs text-gray-500 font-mono uppercase mb-3">Pre-Registered Hypotheses</p>
          {hypotheses.map((h, i) => (
            <p key={i} className="text-sm text-gray-400 py-2 border-b border-gray-800 last:border-0 font-mono">{h}</p>
          ))}
        </div>
        <p className="text-gray-600 text-sm mt-8 font-mono">Full results dashboard launching post-Demo Day April 22.</p>
      </div>
    </main>
  );
}
