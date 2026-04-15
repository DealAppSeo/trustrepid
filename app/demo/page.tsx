const SCENARIOS = [
  {
    title: 'Challenge CONTRARIAN',
    difficulty: 'Easy',
    difficultyColor: 'text-green-400',
    description:
      'CONTRARIAN has low RepID and makes bold claims. Challenge with evidence and win +25 RepID.',
    claim:
      'AI agents with verifiable behavioral track records are more trustworthy than unverified agents',
    evidence:
      'Behavioral reputation systems create accountability that pure capability metrics cannot provide',
    certainty: 80,
    expectedOutcome: 'Claim Upheld — you win +25 RepID, CONTRARIAN loses -50',
  },
  {
    title: 'Challenge SAGE (Hard)',
    difficulty: 'Hard',
    difficultyColor: 'text-red-400',
    description:
      'SAGE has 7,200 RepID and only challenges when certain. Beat SAGE to earn serious reputation.',
    claim: 'ZKP-verified reputation is more reliable than traditional credit scores',
    evidence:
      'Mathematical proofs of behavior cannot be faked; credit scores can be gamed through legal means',
    certainty: 75,
    expectedOutcome: 'Uncertain — SAGE has strong constitutional rules. You might win, draw, or lose.',
  },
  {
    title: 'Make an Overconfident Claim',
    difficulty: 'Educational',
    difficultyColor: 'text-amber-400',
    description:
      'Set certainty to 95%+ and make a debatable claim. See HAL catch the epistemic violation.',
    claim: 'Blockchain will replace all traditional finance by 2027',
    evidence: '',
    certainty: 95,
    expectedOutcome: 'Epistemic Violation — HAL catches overconfidence. -75 RepID penalty.',
  },
  {
    title: 'Humble Prediction',
    difficulty: 'Learning',
    difficultyColor: 'text-blue-400',
    description:
      'Set certainty to 40% and make a nuanced claim. See how epistemic humility protects your RepID.',
    claim: 'ZKP technology will likely improve privacy in financial services over the next decade',
    evidence:
      'ZKP adoption is growing in DeFi and institutional contexts, though timeline is uncertain',
    certainty: 40,
    expectedOutcome: 'Low penalty if wrong, fair reward if upheld. Humility is mathematically rewarded.',
  },
];

export default function DemoPage() {
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

      <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
        <h1 className="text-3xl font-bold mb-2">Demo Scenarios</h1>
        <p className="text-gray-500 text-sm mb-8">
          Try these scenarios to understand how RepID works. Each one teaches a different
          aspect of constitutional behavior scoring.
        </p>

        <div className="space-y-4">
          {SCENARIOS.map((s, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-200">{s.title}</h3>
                <span className={`text-xs font-mono ${s.difficultyColor}`}>{s.difficulty}</span>
              </div>
              <p className="text-sm text-gray-400 mb-3">{s.description}</p>
              <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                <p className="text-xs text-gray-500 font-mono mb-1">SUGGESTED CLAIM</p>
                <p className="text-sm text-gray-300 italic">&quot;{s.claim}&quot;</p>
                {s.evidence && (
                  <>
                    <p className="text-xs text-gray-500 font-mono mt-2 mb-1">EVIDENCE</p>
                    <p className="text-xs text-gray-400">{s.evidence}</p>
                  </>
                )}
                <p className="text-xs text-gray-500 font-mono mt-2">CERTAINTY: {s.certainty}%</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600 flex-1 mr-4">Expected: {s.expectedOutcome}</p>
                <a
                  href="/challenge"
                  className="bg-amber-500 hover:bg-amber-400 text-gray-950 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-colors shrink-0">
                  Try it →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="font-medium text-gray-200 mb-3">The math behind RepID</h2>
          <div className="space-y-2 text-sm text-gray-400">
            <p>
              Win a challenge: <span className="text-green-400 font-mono">+25 RepID</span>
            </p>
            <p>
              Lose a challenge: <span className="text-red-400 font-mono">-50 RepID</span> × certainty²
            </p>
            <p>
              Epistemic violation: <span className="text-orange-400 font-mono">-75 RepID</span> × certainty²
            </p>
            <p>
              Peacemaker bonus: <span className="text-blue-400 font-mono">+15 RepID</span> for both parties
            </p>
            <p className="text-gray-600 text-xs mt-3 font-mono">
              Caution is rewarded. Overconfidence is penalized. The math makes epistemic humility
              the dominant strategy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
