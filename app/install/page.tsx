export default function InstallPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-amber-400 font-mono text-lg font-bold">
          TrustRepID<span className="text-gray-500">.dev</span>
        </a>
        <a href="/score" className="text-gray-400 hover:text-gray-100 text-sm">
          Score Agent →
        </a>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <h1 className="text-3xl font-bold mb-2">Add Trust to Your Agent</h1>
        <p className="text-gray-500 text-sm mb-12 font-mono">
          Three integration paths — choose what fits your stack
        </p>

        <div className="space-y-8">
          {/* Path 1 — npm */}
          <div className="bg-gray-900 border border-amber-500/30 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-amber-500 text-gray-950 text-xs font-mono
                font-bold px-2 py-0.5 rounded">RECOMMENDED</span>
              <h2 className="font-mono font-medium text-gray-200">
                npm package
              </h2>
            </div>
            <pre className="bg-gray-950 border border-gray-800 rounded p-4 text-sm
              font-mono text-amber-400 mb-4 overflow-x-auto">
{`npm install @hyperdag/trustshell`}
            </pre>
            <pre className="bg-gray-950 border border-gray-800 rounded p-4 text-sm
              font-mono text-gray-300 overflow-x-auto">
{`import { gate } from '@hyperdag/trustshell';

const result = await gate('your-agent-id', 500);

if (result.allowed) {
  // proceed with x402 payment
  console.log('RepID:', result.repId, '| Tier:', result.tier);
} else {
  // blocked — agent doesn't have enough trust yet
  console.log('Blocked:', result.reason);
}`}
            </pre>
            <p className="text-gray-600 text-xs font-mono mt-3">
              Coming soon · @hyperdag/trustshell · Apache-2.0
            </p>
          </div>

          {/* Path 2 — REST API */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="font-mono font-medium text-gray-200 mb-4">
              REST API
            </h2>
            <div className="space-y-3 text-sm font-mono">
              {[
                { method: 'POST', path: '/agents', desc: 'Register a new agent' },
                { method: 'GET', path: '/agents/:id', desc: 'Get agent profile + RepID' },
                { method: 'POST', path: '/score', desc: 'Submit a scored event' },
                { method: 'GET', path: '/agents/:id/zkp/POSTCARD', desc: 'ZKP disclosure' },
                { method: 'POST', path: '/agents/:id/x402-gate', desc: 'Payment authorization' },
                { method: 'POST', path: '/challenge', desc: 'File constitutional challenge' },
              ].map(route => (
                <div key={route.path} className="flex items-start gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-bold mt-0.5 ${
                    route.method === 'GET'
                      ? 'bg-blue-900 text-blue-300'
                      : 'bg-green-900 text-green-300'
                  }`}>
                    {route.method}
                  </span>
                  <span className="text-amber-400">{route.path}</span>
                  <span className="text-gray-600 text-xs mt-0.5">{route.desc}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-xs font-mono mt-4">
              Base URL: available after registration · trustrepid.dev/docs
            </p>
          </div>

          {/* Path 3 — Supabase Edge */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6
            opacity-70">
            <h2 className="font-mono font-medium text-gray-400 mb-2">
              Supabase Edge Function
            </h2>
            <p className="text-gray-600 text-sm">
              For builders already on Supabase — call the scoring engine directly
              as an edge function without a separate API layer.
            </p>
            <p className="text-gray-700 text-xs font-mono mt-3">
              Coming Q3 2026
            </p>
          </div>
        </div>

        {/* ZKP tiers */}
        <div className="mt-12">
          <h2 className="font-mono font-medium text-gray-300 text-sm mb-4">
            ZKP Disclosure Tiers
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            {[
              {
                tier: 'POSTCARD',
                reveals: 'Agent name, tier, ERC-8004 address',
                hides: 'Score, history, strategy',
                use: 'Discovery & demos',
              },
              {
                tier: 'ENVELOPE',
                reveals: 'Decision count, protection rate, Merkle root',
                hides: 'Signal values, exact score',
                use: 'B2B trust & enterprise',
              },
              {
                tier: 'PACKAGE',
                reveals: 'Everything',
                hides: 'Nothing',
                use: 'Regulatory compliance · 4FA required',
              },
            ].map(item => (
              <div key={item.tier}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="font-mono text-amber-400 text-xs mb-2">
                  {item.tier}
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  <span className="text-green-500">✓ </span>{item.reveals}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  <span className="text-red-500">✗ </span>{item.hides}
                </div>
                <div className="text-xs text-gray-600 font-mono">{item.use}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
