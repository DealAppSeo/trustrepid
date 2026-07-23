import Link from 'next/link';
import { getBounties } from '@/lib/engine';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Bounty = any;

export default async function BountiesPage() {
  const bounties = await getBounties();

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
          <Link href="/bounties" className="text-amber-400">Contribute</Link>
          <Link href="/ethics" className="text-gray-400 hover:text-gray-100">Ethics</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Open problems — help build the trust layer</h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
            Concrete, well-scoped work that moves the protocol forward. Contributors earn portable
            RepID and recognition in the ecosystem they help build — this is open-source contribution,
            not a paid bounty program. Pick one up, open a PR against the named repo, and meet the
            acceptance criteria.
          </p>
        </div>

        <div className="space-y-3">
          {bounties.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-600 font-mono">
              No open problems posted right now — check back, or open an issue on GitHub.
            </div>
          ) : (
            bounties.map((b: Bounty) => (
              <div
                key={b.id}
                className="bg-gray-900 border border-gray-800 hover:border-amber-700/40 rounded-xl p-5 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-medium text-gray-200 leading-tight">{b.title}</h3>
                  <div className="flex gap-2 shrink-0">
                    {b.bounty_repid > 0 && (
                      <span className="bg-amber-900/30 border border-amber-700/50 text-amber-400 px-2 py-1 rounded text-xs font-mono">
                        +{b.bounty_repid.toLocaleString()} RepID
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3 leading-relaxed">{b.description}</p>
                {b.repo && (
                  <p className="text-xs text-gray-600 font-mono mb-2">Repo: {b.repo}</p>
                )}
                {b.acceptance_criteria && (
                  <div className="bg-gray-800/50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-500 font-mono">✓ {b.acceptance_criteria}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
