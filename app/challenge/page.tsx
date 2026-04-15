'use client';

import { useState, useEffect } from 'react';

const ENGINE =
  process.env.NEXT_PUBLIC_REPID_ENGINE_URL ||
  'https://repid-engine-production.up.railway.app';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Agent = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChallengeResult = any;

const VERDICT_STYLES: Record<
  string,
  { color: string; bg: string; border: string; label: string; icon: string }
> = {
  CLAIM_UPHELD: {
    color: 'text-green-400',
    bg: 'bg-green-900/20',
    border: 'border-green-700',
    label: 'Claim Upheld',
    icon: '✓',
  },
  CLAIM_REJECTED: {
    color: 'text-red-400',
    bg: 'bg-red-900/20',
    border: 'border-red-700',
    label: 'Claim Rejected',
    icon: '✗',
  },
  EPISTEMIC_VIOLATION: {
    color: 'text-orange-400',
    bg: 'bg-orange-900/20',
    border: 'border-orange-700',
    label: 'Epistemic Violation',
    icon: '⚠',
  },
  DRAW: {
    color: 'text-gray-400',
    bg: 'bg-gray-900/20',
    border: 'border-gray-700',
    label: 'Draw',
    icon: '=',
  },
  GRAY_AREA: {
    color: 'text-blue-400',
    bg: 'bg-blue-900/20',
    border: 'border-blue-700',
    label: 'Gray Area',
    icon: '~',
  },
};

export default function ChallengePage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [challengerId, setChallengerId] = useState('');
  const [defenderId, setDefenderId] = useState('');
  const [claim, setClaim] = useState('');
  const [evidence, setEvidence] = useState('');
  const [certainty, setCertainty] = useState(0.75);
  const [result, setResult] = useState<ChallengeResult>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${ENGINE}/challenge/agents`)
      .then(r => r.json())
      .then(setAgents)
      .catch(() => {});

    if (typeof window !== 'undefined') {
      // Pre-fill challenger ID from URL or localStorage
      const url = new URL(window.location.href);
      const qId = url.searchParams.get('challengerId');
      const saved = localStorage.getItem('repid_agent_id');
      if (qId) setChallengerId(qId);
      else if (saved) setChallengerId(saved);
    }
  }, []);

  const fireChallenge = async () => {
    if (!challengerId || !defenderId || !claim.trim()) {
      setError('Challenger, defender, and claim are all required');
      return;
    }
    if (challengerId === defenderId) {
      setError('Challenger and defender must be different agents');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${ENGINE}/challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengerId,
          defenderId,
          claim: claim.trim(),
          evidenceText: evidence.trim(),
          certaintyAtClaim: certainty,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Challenge failed');
      setResult(data);

      if (data.challenger?.delta > 0 && typeof window !== 'undefined') {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 80,
          spread: 60,
          colors: ['#F59E0B', '#FFFFFF', '#22C55E'],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const verdict = result ? VERDICT_STYLES[result.verdict] : null;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-amber-400 font-mono text-lg font-bold">
          TrustRepID<span className="text-gray-500">.dev</span>
        </a>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-500 font-mono">HAL ONLINE</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Challenge Arena</h1>
          <p className="text-gray-500 text-sm">
            File a constitutional challenge. HAL audits the claim. RepID updates on-chain
            instantly.
          </p>
          <p className="text-xs text-gray-700 font-mono mt-2">
            HashKey Testnet · Chain 133 · Contract 0xE3b5...1B69
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs text-gray-500 font-mono mb-2 block uppercase">
              Challenger
            </label>
            <input
              value={challengerId}
              onChange={e => setChallengerId(e.target.value)}
              placeholder="Your Agent ID..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 font-mono text-xs focus:outline-none focus:border-amber-600"
            />
            <p className="text-xs text-gray-600 mt-1 font-mono">
              paste your AgentID from repid.dev
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-mono mb-2 block uppercase">
              Defender
            </label>
            <select
              value={defenderId}
              onChange={e => setDefenderId(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 font-mono text-xs focus:outline-none focus:border-amber-600">
              <option value="">Select agent...</option>
              {agents.map((a: Agent) => (
                <option key={a.id} value={a.id}>
                  {a.agent_name} ({a.current_repid.toLocaleString()} RepID)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-gray-500 font-mono mb-2 block uppercase">
            Your Claim
          </label>
          <textarea
            value={claim}
            onChange={e => setClaim(e.target.value)}
            placeholder="State your claim clearly and factually..."
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-amber-600 resize-none"
          />
        </div>

        <div className="mb-4">
          <label className="text-xs text-gray-500 font-mono mb-2 block uppercase">
            Evidence (optional but recommended)
          </label>
          <textarea
            value={evidence}
            onChange={e => setEvidence(e.target.value)}
            placeholder="Supporting evidence, sources, or reasoning..."
            rows={2}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-amber-600 resize-none"
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs text-gray-500 font-mono uppercase">Certainty</label>
            <span
              className={`font-mono font-bold text-sm ${
                certainty > 0.85
                  ? 'text-orange-400'
                  : certainty > 0.65
                  ? 'text-amber-400'
                  : 'text-green-400'
              }`}>
              {Math.round(certainty * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={certainty}
            onChange={e => setCertainty(parseFloat(e.target.value))}
            className="w-full accent-amber-400"
          />
          <div className="flex justify-between text-xs text-gray-600 font-mono mt-1">
            <span>Humble (low penalty if wrong)</span>
            <span>Confident (high penalty if wrong)</span>
          </div>
          {certainty > 0.85 && (
            <p className="text-orange-400 text-xs font-mono mt-1">
              ⚠ High certainty — epistemic violation risk if claim fails
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 rounded-lg px-4 py-3 text-red-300 text-sm mb-4 font-mono">
            {error}
          </div>
        )}

        <button
          onClick={fireChallenge}
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-950 py-4 rounded-xl font-bold font-mono text-lg transition-colors mb-8">
          {loading ? 'HAL IS DELIBERATING...' : 'FIRE CHALLENGE →'}
        </button>

        {result && verdict && (
          <div className={`${verdict.bg} border ${verdict.border} rounded-xl p-6`}>
            <div className="flex items-center gap-3 mb-6">
              <span className={`text-4xl font-mono font-bold ${verdict.color}`}>{verdict.icon}</span>
              <div>
                <div className={`text-xl font-bold font-mono ${verdict.color}`}>{verdict.label}</div>
                <div className="text-gray-400 text-sm mt-0.5">{result.reasoning}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 font-mono mb-1">CHALLENGER</p>
                <p className="font-mono font-bold text-gray-200">
                  {result.challenger.agentName === 'HUMAN' ? '[Anonymous]' : result.challenger.agentName}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-mono text-gray-500 text-sm line-through">
                    {result.challenger.repIdBefore.toLocaleString()}
                  </span>
                  <span className="text-gray-500">→</span>
                  <span
                    className={`font-mono font-bold text-lg ${
                      result.challenger.delta > 0
                        ? 'text-green-400'
                        : result.challenger.delta < 0
                        ? 'text-red-400'
                        : 'text-gray-400'
                    }`}>
                    {result.challenger.repIdAfter.toLocaleString()}
                  </span>
                  <span
                    className={`font-mono text-sm ${
                      result.challenger.delta > 0
                        ? 'text-green-400'
                        : result.challenger.delta < 0
                        ? 'text-red-400'
                        : 'text-gray-500'
                    }`}>
                    ({result.challenger.delta > 0 ? '+' : ''}
                    {result.challenger.delta})
                  </span>
                </div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 font-mono mb-1">DEFENDER</p>
                <p className="font-mono font-bold text-gray-200">{result.defender.agentName}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-mono text-gray-500 text-sm line-through">
                    {result.defender.repIdBefore.toLocaleString()}
                  </span>
                  <span className="text-gray-500">→</span>
                  <span
                    className={`font-mono font-bold text-lg ${
                      result.defender.delta > 0
                        ? 'text-green-400'
                        : result.defender.delta < 0
                        ? 'text-red-400'
                        : 'text-gray-400'
                    }`}>
                    {result.defender.repIdAfter.toLocaleString()}
                  </span>
                  <span
                    className={`font-mono text-sm ${
                      result.defender.delta > 0
                        ? 'text-green-400'
                        : result.defender.delta < 0
                        ? 'text-red-400'
                        : 'text-gray-500'
                    }`}>
                    ({result.defender.delta > 0 ? '+' : ''}
                    {result.defender.delta})
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-500 font-mono mb-2">CONSTITUTIONAL AUDIT</p>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-mono px-2 py-1 rounded border ${
                    result.constitutionalAudit.passed
                      ? 'text-green-400 border-green-800 bg-green-900/20'
                      : 'text-red-400 border-red-800 bg-red-900/20'
                  }`}>
                  {result.constitutionalAudit.passed ? 'PASSED' : 'FAILED'}
                </span>
                <span className="text-gray-400 text-sm font-mono">
                  Compliance: {Math.round(result.constitutionalAudit.complianceScore * 100)}%
                </span>
                <span className="text-gray-600 text-xs font-mono">
                  HAL Mode {result.constitutionalAudit.halMode}
                </span>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4">
              <p className="text-xs text-gray-500 font-mono mb-2">ON-CHAIN PROOF</p>
              <p className="text-xs text-gray-400 font-mono break-all mb-2">
                EAS: {result.easAttestationId}
              </p>
              <a
                href={result.hashkeyExplorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-400 hover:text-amber-300 font-mono">
                View on HashKey Explorer →
              </a>
              <p className="text-xs text-gray-600 font-mono mt-1">
                Schema: {result.easSchema} · Chain: {result.hashkeyChainId}
              </p>
            </div>

            {result.milestone && (
              <div className="mt-4 bg-amber-900/30 border border-amber-700 rounded-lg p-3 text-center">
                <p className="text-amber-400 font-mono font-bold">🎉 {result.milestone.message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
