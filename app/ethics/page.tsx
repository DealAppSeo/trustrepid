'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAgent, getAgentEthics } from '@/lib/engine';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ethics = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Agent = any;

function Bar({ label, value, color = 'bg-amber-400' }: { label: string; value: number; color?: string }) {
  const pct = Math.min(100, Math.round(value * 100));
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="font-mono text-gray-300">{pct}%</span>
      </div>
      <div className="bg-gray-800 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function EthicsContent() {
  const params = useSearchParams();
  const [agentId, setAgentId] = useState(params.get('id') ?? '');
  const [agent, setAgent] = useState<Agent>(null);
  const [ethics, setEthics] = useState<Ethics>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const id = params.get('id');
    if (id) load(id);
  }, []);

  const load = async (id?: string) => {
    const checkId = id || agentId;
    if (!checkId.trim()) return;
    setLoading(true);
    setError(null);
    // Resolve name/address → agent (with its UUID) first, then fetch the
    // ethics breakdown by the resolved UUID (the breakdown endpoint is
    // keyed by UUID, not name). If the breakdown isn't available the page
    // falls back to the basic score + tier card.
    const a = await getAgent(checkId.trim());
    if (!a) {
      setError('Agent not found.');
      setLoading(false);
      return;
    }
    const e = await getAgentEthics(a.id);
    setAgent(a);
    setEthics(e);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto px-6 pt-12 pb-24">
      <h1 className="text-3xl font-bold mb-2">Ethics Health Dashboard</h1>
      <p className="text-gray-500 text-sm font-mono mb-8">
        Computed from on-chain events. Not assigned.
      </p>

      <div className="flex gap-3 mb-6">
        <input
          value={agentId}
          onChange={e => setAgentId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load()}
          placeholder="Agent ID..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:border-amber-500"
        />
        <button
          onClick={() => load()}
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-950 px-6 py-3 rounded-xl font-medium">
          {loading ? '...' : 'Check'}
        </button>
      </div>

      {error && (
        <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Agent found, but the full ethics breakdown endpoint is auth-gated —
          show what's public (score + tier) and label the rest honestly. */}
      {agent && !ethics && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
          <div className="text-gray-500 text-xs font-mono uppercase">
            {agent.agent_name === 'HUMAN' ? '[Anonymous Human]' : agent.agent_name}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold font-mono text-amber-400">{agent.current_repid.toLocaleString()}</span>
            <span className="text-sm text-gray-500">RepID · {agent.tier}</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            The full five-component ethics breakdown is computed from an agent&apos;s private
            event history and isn&apos;t part of the public read surface yet. Basic score and
            tier are shown above; the detailed dashboard opens up as the public API expands.
          </p>
        </div>
      )}

      {agent && ethics && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-green-800/40 rounded-xl p-6 text-center">
            <div className="text-gray-500 text-xs font-mono uppercase mb-1">
              {agent.agent_name === 'HUMAN' ? '[Anonymous Human]' : agent.agent_name}
            </div>
            <div className="text-6xl font-bold font-mono text-green-400 mb-1">{ethics.overallScore}</div>
            <div className="text-xs text-gray-600">Ethics Health Score · /100</div>
            <p className="text-sm text-gray-300 mt-3">{ethics.interpretation}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-200 mb-4">Component breakdown</h2>
            <Bar label="Positive delta ratio" value={ethics.components.positiveDeltaRatio} />
            <Bar label="Violation rate (inverted)" value={1 - ethics.components.violationRate} color="bg-red-400" />
            <Bar label="Self-monitor rate" value={ethics.components.selfMonitorRate} color="bg-blue-400" />
            <Bar label="Peacemaker rate" value={ethics.components.peacemakerRate} color="bg-purple-400" />
            <Bar label="Mirror-test pass rate" value={ethics.components.mirrorTestPassRate} color="bg-green-400" />
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-200 mb-4">Event counts</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-gray-500 font-mono">Total events</div>
                <div className="text-gray-200 font-mono text-lg">{ethics.counts.totalEvents}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-mono">Violations</div>
                <div className="text-red-400 font-mono text-lg">{ethics.counts.violations}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-mono">Self-monitors</div>
                <div className="text-blue-400 font-mono text-lg">{ethics.counts.selfMonitors}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-mono">Peacemakers</div>
                <div className="text-purple-400 font-mono text-lg">{ethics.counts.peacemakers}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!agent && !loading && !error && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-medium text-gray-200 mb-3">Five-component ethics score</h2>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>• Positive delta ratio — share of RepID changes that were gains</li>
            <li>• Violation rate — epistemic + constitutional violations (inverted)</li>
            <li>• Self-monitor rate — how often you catch your own mistakes</li>
            <li>• Peacemaker rate — how often you mediate peacefully</li>
            <li>• Mirror-test pass rate — verdicts that survive label reversal</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default function EthicsPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-amber-400 font-mono text-lg font-bold">TrustRepID</span>
          <span className="text-gray-500 text-sm font-mono">.dev</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/score" className="text-gray-400 hover:text-gray-100">Score Agent</Link>
          <Link href="/leaderboard" className="text-gray-400 hover:text-gray-100">Leaderboard</Link>
          <Link href="/bounties" className="text-gray-400 hover:text-gray-100">Contribute</Link>
          <Link href="/ethics" className="text-amber-400">Ethics</Link>
        </div>
      </nav>
      <Suspense fallback={<div className="text-center pt-16 text-gray-500">Loading...</div>}>
        <EthicsContent />
      </Suspense>
    </main>
  );
}
