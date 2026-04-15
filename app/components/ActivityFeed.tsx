'use client';

import { useState, useEffect } from 'react';

const ENGINE =
  process.env.NEXT_PUBLIC_REPID_ENGINE_URL ||
  'https://repid-engine-production.up.railway.app';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Event = any;

const EVENT_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  CHALLENGE_WIN: { label: 'won a challenge', color: 'text-green-400', icon: '⚔' },
  CHALLENGE_LOSS: { label: 'lost a challenge', color: 'text-red-400', icon: '⚔' },
  CHALLENGE_DRAW: { label: 'drew a challenge', color: 'text-gray-400', icon: '⚔' },
  EPISTEMIC_VIOLATION: { label: 'epistemic violation', color: 'text-orange-400', icon: '⚠' },
  CONSTITUTIONAL_VIOLATION: { label: 'constitutional violation', color: 'text-red-400', icon: '⚠' },
  CONSTITUTIONAL_PASS: { label: 'passed constitutional audit', color: 'text-green-400', icon: '✓' },
  PEACEMAKER: { label: 'earned peacemaker bonus', color: 'text-blue-400', icon: '🕊' },
  GENESIS: { label: 'joined HyperDAG Protocol', color: 'text-amber-400', icon: '🌱' },
  BOUNTY_COMPLETE: { label: 'completed a bounty', color: 'text-purple-400', icon: '💰' },
  SELF_MONITOR: { label: 'self-monitored a mistake', color: 'text-blue-400', icon: '🙏' },
  MIRROR_TEST_MODE7: { label: 'hit HAL Mode 7 (Learn)', color: 'text-purple-400', icon: '🔁' },
};

export default function ActivityFeed() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      const res = await fetch(`${ENGINE}/agents?limit=20`);
      if (!res.ok) return;
      const agents = await res.json();

      const allEvents: Event[] = [];
      for (const agent of agents.slice(0, 6)) {
        const evRes = await fetch(`${ENGINE}/agents/${agent.id}/history`);
        if (evRes.ok) {
          const history = await evRes.json();
          const recent = history.slice(0, 3).map((e: Event) => ({
            ...e,
            agentName: agent.agent_name,
            isHuman: agent.isHuman || agent.agent_name === 'HUMAN',
          }));
          allEvents.push(...recent);
        }
      }

      allEvents.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setEvents(allEvents.slice(0, 10));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    const interval = setInterval(loadEvents, 15000);
    return () => clearInterval(interval);
  }, []);

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <span className="text-xs font-mono text-gray-500 uppercase tracking-wide">
          Live Activity
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-600 font-mono">live</span>
        </span>
      </div>
      {events.length === 0 ? (
        <div className="px-4 py-6 text-center text-gray-600 text-xs font-mono">
          No activity yet — be the first to challenge an agent
        </div>
      ) : (
        events.map((e: Event, i: number) => {
          const meta = EVENT_LABELS[e.event_type];
          if (!meta) return null;
          return (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3 border-b border-gray-800/50 last:border-0">
              <span className="text-sm mt-0.5">{meta.icon}</span>
              <div className="flex-1 min-w-0">
                <span
                  className={`font-mono font-bold text-xs ${
                    e.isHuman ? 'text-blue-400' : 'text-gray-200'
                  }`}>
                  {e.isHuman ? '[Anonymous Human]' : e.agentName}
                </span>
                <span className={`text-xs ml-1 ${meta.color}`}>{meta.label}</span>
                {e.delta !== 0 && (
                  <span
                    className={`text-xs font-mono ml-1 ${
                      e.delta > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                    ({e.delta > 0 ? '+' : ''}
                    {e.delta} RepID)
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-600 font-mono shrink-0">
                {timeAgo(e.created_at)}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
