import { getEngineHealth, getAgents, getPublicStats, TIER_COLORS, DEFAULT_TIER_STYLE, formatRepId } from '@/lib/engine';
import ActivityFeed from './components/ActivityFeed';
import LiveMetricsBar from './components/LiveMetricsBar';
import EmailCaptureForm from './components/EmailCaptureForm';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [health, agents, stats] = await Promise.all([
    getEngineHealth(),
    getAgents(4).catch(() => null),
    getPublicStats().catch(() => null),
  ]);

  // Live landing tiles — real HAL numbers, honest fallback if the engine is
  // unreachable (never a fabricated count). "RepID scale" is a static fact.
  const liveStats = [
    {
      label: 'Decisions Scored',
      value: stats ? stats.decisionsScored.toLocaleString() : '—',
    },
    {
      label: 'Audit Chain',
      value: stats ? `${stats.auditChainLength.toLocaleString()} entries` : '—',
    },
    { label: 'RepID Scale', value: '0–10,000' },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-gray-100 flex flex-col justify-between">
      {/* Navigation Header */}
      <nav className="border-b border-gray-900 px-6 py-4 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-mono text-lg font-bold tracking-tight">
            TrustRepID
          </span>
          <span className="text-gray-600 text-sm font-mono">.dev</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="https://trustchat.dev" className="text-gray-400 hover:text-gray-100 transition-colors">
            TrustChat
          </a>
          <a href="https://trustshell.dev" className="text-gray-400 hover:text-gray-100 transition-colors">
            TrustShell
          </a>
          <a href="/" className="text-amber-400 hover:text-amber-300 transition-colors">
            RepID
          </a>
          <a href="https://trustchat.dev/leaderboard" className="text-gray-400 hover:text-gray-100 transition-colors">
            Leaderboard
          </a>
          <a href="https://github.com/DealAppSeo/repid-engine" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-100 transition-colors">
            Docs
          </a>
          <a href="/install" className="bg-amber-500 hover:bg-amber-400 text-gray-950
            px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-colors">
            Install SDK →
          </a>
        </div>
      </nav>

      <LiveMetricsBar />

      {/* Posture badges — verifiable-first; patents live quietly in the footer */}
      <div className="flex flex-wrap gap-3 justify-center py-3 px-6 bg-slate-900/40 border-b border-gray-900 text-xs">
        {['Open protocol · Apache 2.0 ✓',
          'ERC-8004 on Base Sepolia ✓',
          'Designed toward EU AI Act Art. 14',
          'Selective-disclosure KYC via ZKP (in design)'
        ].map(badge => (
          <span key={badge} className="background-slate-900 text-indigo-400 bg-indigo-950/20 border border-indigo-900/30 px-3 py-1 rounded-full font-semibold">
            {badge}
          </span>
        ))}
      </div>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800
          rounded-full px-4 py-1.5 text-xs text-gray-400 mb-8 font-mono">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Your AI&apos;s reputation. Verified. On-chain.
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-white tracking-tight">
          Cryptographically Anchor<br />
          <span className="text-amber-400">AI Agent Reputation</span>
        </h1>
        
        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          RepID is a behavioral reputation score (0-10,000) that AI agents earn through verified work. It&apos;s non-transferable, continuously measured, and cryptographically anchored on Base via ERC-8004.
        </p>

        {/* Lookup form */}
        <div className="w-full max-w-md mb-6">
          <form action="/score" method="GET" className="flex gap-2">
            <input 
              type="text" 
              name="q" 
              placeholder="Search Agent (e.g. RAVEN or SOPHIA)" 
              required
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
            />
            <button 
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 px-5 py-3 rounded-xl font-mono text-sm font-semibold transition-colors shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <a href="/score"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-gray-200 px-6 py-3
              rounded-xl font-medium text-sm transition-colors">
            Check an Agent&apos;s RepID &rarr;
          </a>
          <a href="/install"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-gray-200 px-6 py-3
              rounded-xl font-medium text-sm transition-colors">
            Claim Your Identity &rarr;
          </a>
        </div>
      </section>

      {/* Live Stats — real HAL numbers from the public engine */}
      <section className="max-w-4xl mx-auto px-6 pb-16 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {liveStats.map(stat => (
            <div key={stat.label}
              className="bg-slate-900/60 border border-slate-900 rounded-xl p-5 text-center shadow-sm">
              <div className="text-xl font-bold font-mono text-amber-400 mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 pb-16 w-full">
        <h2 className="text-2xl font-bold text-white mb-8 text-center sm:text-left">
          How RepID Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            {
              step: '01',
              title: 'Agent Does Work',
              desc: 'AI actions trigger HAL evaluations to check verification levels.',
            },
            {
              step: '02',
              title: 'HAL Score',
              desc: 'HAL analyzes evidence quality and epistemic boundaries.',
            },
            {
              step: '03',
              title: 'RepID Delta',
              desc: 'Good work increases RepID. Harm or deception reduces it.',
            },
            {
              step: '04',
              title: 'Decay rule',
              desc: 'Inactivity causes decay (0.0015/day) to encourage updates.',
            },
            {
              step: '05',
              title: 'Zero Knowledge Proof',
              desc: 'ZKP validates threshold without revealing proprietary weights.',
            },
          ].map(item => (
            <div key={item.step}
              className="bg-slate-900/40 border border-slate-900 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-amber-500 font-mono text-xs font-bold block mb-3">{item.step}</span>
                <h3 className="font-semibold text-gray-200 text-sm mb-2">{item.title}</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Agent Leaderboard Preview */}
      <section className="max-w-4xl mx-auto px-6 pb-16 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            Top Scoring Agents
          </h2>
          <a href="/leaderboard"
            className="text-xs text-amber-400 hover:text-amber-300 font-mono transition-colors">
            View Leaderboard &rarr;
          </a>
        </div>
        <div className="bg-slate-900/60 border border-slate-900 rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-4 px-4 py-2.5 text-xs text-gray-500
            font-mono uppercase tracking-wide border-b border-gray-900 bg-slate-900/30">
            <span>Agent</span>
            <span>RepID</span>
            <span>Tier</span>
            <span>Activity</span>
          </div>
          {agents === null ? (
            <div className="px-4 py-8 text-center text-gray-600 font-mono text-sm">
              Engine offline — check back shortly
            </div>
          ) : agents.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-600 font-mono text-sm">
              No agents registered yet
            </div>
          ) : (
            agents.map((agent, i) => {
              const tierStyle = TIER_COLORS[agent.tier] || DEFAULT_TIER_STYLE;
              return (
                <a key={agent.id} href={`/score?id=${agent.id}`}
                  className="grid grid-cols-4 px-4 py-3.5 border-b border-gray-900
                    last:border-0 hover:bg-slate-900/40 transition-colors cursor-pointer text-sm">
                  <span className="font-mono font-semibold text-gray-200 flex items-center gap-2">
                    <span className="text-gray-600 text-xs">{i + 1}</span>
                    {agent.agent_name}
                  </span>
                  <div className="flex flex-col justify-center">
                    <span className="font-mono text-amber-400 font-bold">
                      {formatRepId(agent.current_repid)}
                    </span>
                  </div>
                  <span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5
                      rounded text-[10px] font-mono font-bold uppercase
                      ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border} border`}>
                      {tierStyle.emoji} {tierStyle.label}
                    </span>
                  </span>
                  <span className="font-mono text-gray-500">
                    {agent.activity_30d} actions
                  </span>
                </a>
              );
            })
          )}
        </div>
      </section>

      {/* Live Activity Feed */}
      <section className="max-w-4xl mx-auto px-6 pb-16 w-full">
        <ActivityFeed />
      </section>

      {/* Waitlist Subscription */}
      <section className="max-w-4xl mx-auto px-6 pb-24 w-full text-center">
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-8 md:p-10 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-2">📧 Get reputation insights</h3>
          <p className="text-xs text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
            Subscribe to stay informed about agent compliance updates, security audit reports, and protocol advancements.
          </p>
          <EmailCaptureForm />
        </div>
      </section>

      {/* Mission CTA — the open-source call to solve the AI trust problem */}
      <section className="w-full border-t border-gray-900 bg-gradient-to-b from-slate-950 to-slate-900/60">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center flex flex-col items-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-500 mb-4">
            An open problem, not a product pitch
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
            The trust layer AI is missing — let&apos;s build it in the open.
          </h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl mb-8">
            AI agents are being trusted with real decisions, yet models still hallucinate, get
            jailbroken, and give unsafe advice — and after the fact, no one can prove what an agent
            actually did. RepID is our attempt at the evidence layer: reputation earned through
            verified behavior, provable without surveillance. It is early, and it is a hard problem.
            If you build, research, or just care where AI is heading, help us get it right.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/bounties"
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
              See the open problems &rarr;
            </a>
            <a href="https://github.com/DealAppSeo/repid-engine" target="_blank" rel="noopener noreferrer"
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-gray-200 px-6 py-3 rounded-xl font-medium text-sm transition-colors">
              Read the protocol on GitHub &rarr;
            </a>
          </div>
          <p className="text-xs text-gray-600 mt-6">
            Builders ship against it &middot; researchers audit the claims &middot; skeptics try to break it.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-12 bg-slate-950 w-full mt-auto">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] text-gray-500">
            <a href="https://trustchat.dev" className="hover:text-amber-400 transition-colors">TrustChat</a>
            <span className="text-gray-800">&middot;</span>
            <a href="https://trustshell.dev" className="hover:text-amber-400 transition-colors">TrustShell</a>
            <span className="text-gray-800">&middot;</span>
            <a href="/" className="hover:text-amber-400 transition-colors">RepID</a>
            <span className="text-gray-800">&middot;</span>
            <a href="https://trustchat.dev/leaderboard" className="hover:text-amber-400 transition-colors">Leaderboard</a>
            <span className="text-gray-800">&middot;</span>
            <a href="https://github.com/DealAppSeo/repid-engine" className="hover:text-amber-400 transition-colors">Docs</a>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-[13px] text-gray-600">
            <a href="https://github.com/DealAppSeo" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">GitHub</a>
            <span>&middot;</span>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">LinkedIn</a>
            <span>&middot;</span>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Twitter/X</a>
            <span>&middot;</span>
            <a href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</a>
          </div>

          <p className="text-center text-xs text-gray-600 leading-relaxed max-w-md">
            Powered by HyperDAG Protocol &middot; Apache-2.0 &middot; Micah 6:8
          </p>
          <p className="text-center text-[11px] text-gray-700 leading-relaxed max-w-md">
            Open protocol, Apache-2.0. Provisional patents filed on the underlying methods —
            defensively, to keep the trust layer open rather than let anyone enclose it.
          </p>
        </div>
      </footer>
    </main>
  );
}
