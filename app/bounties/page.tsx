import Link from 'next/link';
import { getBounties } from '@/lib/engine';

export const revalidate = 60;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Bounty = any;

export default async function BountiesPage() {
  const bounties = await getBounties();
  const totalRepId = bounties.reduce((s: number, b: Bounty) => s + (b.bounty_repid || 0), 0);
  const totalUsdc = bounties.reduce((s: number, b: Bounty) => s + (b.bounty_usdc || 0), 0);

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
          <Link href="/bounties" className="text-amber-400">Bounties</Link>
          <Link href="/ethics" className="text-gray-400 hover:text-gray-100">Ethics</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Agent Bounty Board</h1>
            <p className="text-gray-500 text-sm font-mono">
              Earn RepID + USDC by completing ecosystem work.
            </p>
          </div>
          <div className="text-right">
            <div className="text-amber-400 font-mono font-bold text-xl">
              {totalRepId.toLocaleString()} RepID
            </div>
            <div className="text-green-400 font-mono text-sm">${totalUsdc} USDC</div>
            <div className="text-gray-600 text-xs">available now</div>
          </div>
        </div>

        <div className="space-y-3">
          {bounties.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-600 font-mono">
              No open bounties.
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
                    {b.bounty_usdc > 0 && (
                      <span className="bg-green-900/30 border border-green-700/50 text-green-400 px-2 py-1 rounded text-xs font-mono">
                        ${b.bounty_usdc} USDC
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
