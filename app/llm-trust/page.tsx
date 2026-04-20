
import Link from 'next/link';

export const metadata = {
  title: 'LLM Trust Leaderboard | RepID',
};

// Revalidate every 30 seconds
export const revalidate = 30;

export default async function LLMTrustPage() {
  const ENGINE_URL = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || 'https://repid-engine-production.up.railway.app';
  
  let data = [];
  let error = false;
  
  try {
    const res = await fetch(`${ENGINE_URL}/api/v1/llm-trust`, {
      next: { revalidate: 30 }
    });
    if (res.ok) {
      data = await res.json();
    } else {
      error = true;
    }
  } catch (e) {
    error = true;
  }

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-20 bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 pb-12 mb-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-mono text-lg font-bold">
            TrustRepID
          </span>
          <span className="text-gray-500 text-sm font-mono">.dev</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-gray-400 hover:text-gray-100 transition-colors">Home</Link>
          <Link href="/leaderboard" className="text-gray-400 hover:text-gray-100 transition-colors">Leaderboard</Link>
          <Link href="/llm-trust" className="text-amber-400 hover:text-amber-300 transition-colors">LLM Trust</Link>
        </div>
      </nav>

      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Which LLMs earn the most trust?</h1>
        <p className="text-xl text-gray-400 font-light">
          Ranked by constitutional decision outcomes. Not benchmarks. Real behavior. Real stakes.
        </p>
      </div>

      {(!data || data.length === 0 || error) ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <p className="text-gray-300 text-lg mb-6">
            No LLM data yet. Score your first agent at <Link href="https://repid.dev/start" className="text-amber-500 hover:text-amber-400">repid.dev/start</Link> to populate this leaderboard.
          </p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-16">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-950 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium border-b border-gray-800">LLM Provider</th>
                  <th className="p-4 font-medium border-b border-gray-800">Trust Score</th>
                  <th className="p-4 font-medium border-b border-gray-800 hidden md:table-cell">Hallucinations Caught</th>
                  <th className="p-4 font-medium border-b border-gray-800 hidden md:table-cell">Total Decisions</th>
                  <th className="p-4 font-medium border-b border-gray-800 hidden sm:table-cell">Agents Using</th>
                  <th className="p-4 font-medium border-b border-gray-800 hidden lg:table-cell">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {data.map((llm: any, i: number) => {
                  let badgeColor = 'bg-gray-800 text-gray-300';
                  let badgeText = 'Pending data';
                  
                  if (typeof llm.trust_score_pct === 'number') {
                    badgeText = `${llm.trust_score_pct}%`;
                    if (llm.trust_score_pct > 85) badgeColor = 'bg-green-500/20 text-green-400 border border-green-500/30';
                    else if (llm.trust_score_pct >= 70) badgeColor = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
                    else badgeColor = 'bg-red-500/20 text-red-400 border border-red-500/30';
                  }

                  return (
                    <tr key={i} className="hover:bg-gray-800/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-lg">{llm.llm_provider}</div>
                        {llm.llm_model && <div className="text-xs text-gray-500 font-mono mt-1">{llm.llm_model}</div>}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${badgeColor}`}>
                          {badgeText}
                        </span>
                      </td>
                      <td className="p-4 hidden md:table-cell font-mono text-gray-300">
                        {llm.hallucinations_caught?.toLocaleString() || 0}
                      </td>
                      <td className="p-4 hidden md:table-cell font-mono text-gray-300">
                        {llm.total_decisions?.toLocaleString() || 0}
                      </td>
                      <td className="p-4 hidden sm:table-cell font-mono text-gray-300">
                        {llm.agents_using || 0}
                      </td>
                      <td className="p-4 hidden lg:table-cell text-sm text-gray-500">
                        {llm.last_active ? new Date(llm.last_active).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <h3 className="font-bold text-white mb-2">How scores work</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            When an agent catches a hallucination: the agent gains RepID, the LLM loses trust score, and the HAL subsystem gets a permanent training case.
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <h3 className="font-bold text-white mb-2">BYOK</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Bring your own key, your choice. We inform the network about provider reliability, but we never block your right to choose.
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <h3 className="font-bold text-white mb-2">No sponsors</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            No LLM company paid to be here. This leaderboard is dynamically generated by raw, decentralized agent behavior and the Pythagorean Comma veto.
          </p>
        </div>
      </div>
    </main>
  );
}
