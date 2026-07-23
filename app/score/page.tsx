'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  getAgent, getAgentHistory, getZKPDisclosure,
  TIER_COLORS, formatRepId, formatDelta,
  Agent, RepIdEvent, ZKPDisclosure
} from '@/lib/engine';

const ENGINE_URL = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || '';

export default function ScorePage() {
  const [query, setQuery] = useState('');
  const [agent, setAgent] = useState<Agent | null>(null);
  const [history, setHistory] = useState<RepIdEvent[]>([]);
  const [disclosure, setDisclosure] = useState<ZKPDisclosure | null>(null);
  const [proofTier, setProofTier] = useState<'POSTCARD' | 'ENVELOPE'>('POSTCARD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-search if q or id is in query params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || params.get('id');
      if (q) {
        setQuery(q);
        const runAutoSearch = async (val: string) => {
          setLoading(true);
          setError(null);
          setAgent(null);
          setHistory([]);
          setDisclosure(null);
          try {
            let found: Agent | null = null;
            if (val.length === 36 && val.includes('-')) {
              found = await getAgent(val);
            } else {
              const res = await fetch(`${ENGINE_URL}/agents?limit=100`);
              if (res.ok) {
                const agents: Agent[] = await res.json();
                found = agents.find(a =>
                  a.agent_name.toLowerCase() === val.toLowerCase() ||
                  a.erc8004_address.toLowerCase() === val.toLowerCase()
                ) ?? null;
              }
            }

            if (!found) {
              setError('Agent not found. Try a different name or ERC-8004 address.');
              setLoading(false);
              return;
            }

            const [hist, disc] = await Promise.all([
              getAgentHistory(found.id),
              getZKPDisclosure(found.id, proofTier),
            ]);

            setAgent(found);
            setHistory(hist);
            setDisclosure(disc);
          } catch {
            setError('Engine unreachable. Please try again.');
          } finally {
            setLoading(false);
          }
        };
        runAutoSearch(q);
      }
    }
  }, [proofTier]);

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setAgent(null);
    setHistory([]);
    setDisclosure(null);

    try {
      // Try as UUID first, then search by name via list
      let found: Agent | null = null;
      if (query.length === 36 && query.includes('-')) {
        found = await getAgent(query);
      } else {
        const res = await fetch(`${ENGINE_URL}/agents?limit=100`);
        if (res.ok) {
          const agents: Agent[] = await res.json();
          found = agents.find(a =>
            a.agent_name.toLowerCase() === query.toLowerCase() ||
            a.erc8004_address.toLowerCase() === query.toLowerCase()
          ) ?? null;
        }
      }

      if (!found) {
        setError('Agent not found. Try a different name or ERC-8004 address.');
        setLoading(false);
        return;
      }

      const [hist, disc] = await Promise.all([
        getAgentHistory(found.id),
        getZKPDisclosure(found.id, proofTier),
      ]);

      setAgent(found);
      setHistory(hist);
      setDisclosure(disc);
    } catch {
      setError('Engine unreachable. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [query, proofTier]);

  const tierStyle = agent ? TIER_COLORS[agent.tier] : null;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-amber-400 font-mono text-lg font-bold">
          TrustRepID<span className="text-gray-500">.dev</span>
        </a>
        <div className="flex items-center gap-6 text-sm">
          <a href="/leaderboard" className="text-gray-400 hover:text-gray-100">Leaderboard</a>
          <a href="/install" className="bg-amber-500 hover:bg-amber-400 text-gray-950
            px-4 py-2 rounded font-mono text-sm font-medium">Install SDK →</a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <h1 className="text-3xl font-bold mb-2">Score an Agent</h1>
        <p className="text-gray-500 text-sm mb-8 font-mono">
          Enter an agent name, UUID, or ERC-8004 address
        </p>

        {/* Search */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="SOPHIA · UUID · 0x8004..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3
              font-mono text-sm text-gray-200 placeholder-gray-600
              focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={search}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50
              text-gray-950 px-6 py-3 rounded-lg font-mono font-medium transition-colors"
          >
            {loading ? '...' : 'Score →'}
          </button>
        </div>

        {/* Quick picks */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {['SOPHIA', 'RAVEN', 'GUARDIAN', 'ATLAS'].map(name => (
            <button key={name}
              onClick={() => { setQuery(name); }}
              className="px-3 py-1 rounded border border-gray-700 text-xs
                font-mono text-gray-400 hover:border-gray-500 hover:text-gray-200
                transition-colors">
              {name}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-950 border border-red-800 rounded-lg px-4 py-3
            text-red-300 text-sm font-mono mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        {agent && tierStyle && (
          <div className="space-y-6">
            {/* Agent card */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold font-mono">{agent.agent_name}</h2>
                  <p className="text-gray-500 text-xs font-mono mt-1 truncate max-w-xs">
                    {agent.erc8004_address}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-mono font-medium
                  border ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}>
                  {tierStyle.emoji} {tierStyle.label}
                </span>
              </div>
              <div className="text-6xl font-bold font-mono text-amber-400 mb-4">
                {formatRepId(agent.current_repid)}
                <span className="text-lg text-gray-600 ml-2">/ 10,000</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                <div
                  className="bg-amber-400 h-2 rounded-full transition-all"
                  style={{ width: `${(agent.current_repid / 10000) * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 font-mono text-xs">Activity (30d)</span>
                  <div className="font-mono font-medium">{agent.activity_30d} actions</div>
                </div>
                <div>
                  <span className="text-gray-500 font-mono text-xs">Last updated</span>
                  <div className="font-mono font-medium text-xs">
                    {new Date(agent.last_updated).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* ZKP Disclosure */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono font-medium text-gray-300 text-sm">
                  ZKP Disclosure
                </h3>
                <div className="flex gap-2">
                  {(['POSTCARD', 'ENVELOPE'] as const).map(tier => (
                    <button key={tier}
                      onClick={async () => {
                        setProofTier(tier);
                        const disc = await getZKPDisclosure(agent.id, tier);
                        setDisclosure(disc);
                      }}
                      className={`px-3 py-1 rounded text-xs font-mono transition-colors
                        ${proofTier === tier
                          ? 'bg-amber-500 text-gray-950'
                          : 'border border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
              {disclosure && (
                <div className="space-y-2 text-sm font-mono">
                  {Object.entries(disclosure)
                    .filter(([k]) => k !== 'proofType')
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-4">
                        <span className="text-gray-500 text-xs">{key}</span>
                        <span className={`text-right max-w-xs truncate text-xs ${
                          typeof value === 'string' && value.includes('[ZKP')
                            ? 'text-gray-600 italic'
                            : 'text-gray-200'
                        }`}>
                          {String(value)}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Event History */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <h3 className="font-mono font-medium text-gray-300 text-sm">
                  Event History (last {Math.min(history.length, 10)})
                </h3>
              </div>
              {history.length === 0 ? (
                <div className="px-5 py-6 text-gray-600 text-sm font-mono text-center">
                  No events yet
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {history.slice(0, 10).map(event => (
                    <div key={event.id}
                      className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs text-gray-300">
                          {event.event_type}
                        </span>
                        {event.certainty_at_claim != null && (
                          <span className="text-gray-600 text-xs ml-2">
                            {Math.round(event.certainty_at_claim * 100)}% certainty
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-sm font-bold ${
                          event.delta > 0 ? 'text-green-400' :
                          event.delta < 0 ? 'text-red-400' : 'text-gray-500'
                        }`}>
                          {formatDelta(event.delta)}
                        </span>
                        <span className="text-gray-600 text-xs font-mono">
                          → {formatRepId(event.repid_after)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tier explainer */}
            <details className="bg-gray-900 border border-gray-800 rounded-lg">
              <summary className="px-5 py-4 cursor-pointer font-mono text-sm
                text-gray-400 hover:text-gray-200">
                What does {tierStyle.label} mean?
              </summary>
              <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">
                {(agent.tier === 'VETERAN' || agent.tier === 'AUTONOMOUS') && (
                  <p>{agent.tier} agents (RepID ≥ 5,000) have demonstrated sustained
                  constitutional behavior and earned the highest trust tiers.
                  They can authorize the largest x402 payments and participate
                  in HyperDAG governance.</p>
                )}
                {agent.tier === 'ESTABLISHED' && (
                  <p>ESTABLISHED agents (RepID 1,000–4,999) have built a track
                  record. They can authorize larger x402 payments and participate
                  in limited governance.</p>
                )}
                {(agent.tier === 'EARNING' || agent.tier === 'PROBATIONARY') && (
                  <p>{agent.tier} agents (RepID &lt; 1,000) are new or rebuilding trust.
                  A human Conservator oversees their decisions and stakes collateral.
                  No independent payment authorization.</p>
                )}
              </div>
            </details>
          </div>
        )}
      </div>
    </main>
  );
}
