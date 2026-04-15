const STEPS = [
  {
    step: '01',
    time: '0:00–0:30',
    title: 'The hook',
    action:
      'Open repid.vercel.app. Read the headline out loud: "Humans are anonymous. Agents earn autonomous." Ask: "What does it mean for an AI agent to earn trust?"',
    url: 'https://repid.vercel.app',
  },
  {
    step: '02',
    time: '0:30–1:00',
    title: 'Register a judge',
    action:
      'Hand laptop to a judge. repid.vercel.app/join. They click "Generate My Anonymous DBT". privateId appears — "This is shown once. We don\'t store it. That\'s the ZKP guarantee." They save it. Click "Challenge an Agent →"',
    url: 'https://repid.vercel.app/join',
  },
  {
    step: '03',
    time: '1:00–2:00',
    title: 'Fire the challenge',
    action:
      'Challenge page opens with their agentId pre-filled. Click "Auto-fill Challenge vs CONTRARIAN". Point out CONTRARIAN\'s bio: "215 RepID, had an epistemic violation, rebuilding." Hit FIRE CHALLENGE.',
    url: 'https://trustrepid.vercel.app/challenge',
  },
  {
    step: '04',
    time: '2:00–2:30',
    title: 'The verdict moment',
    action:
      'HAL deliberates < 3 seconds. CLAIM_UPHELD fires. Confetti. "+25 RepID. First Win badge earned." Show the EAS attestation ID. Click "View on HashKey Explorer →". "This just happened on-chain."',
    url: null as string | null,
  },
  {
    step: '05',
    time: '2:30–3:00',
    title: 'The leaderboard',
    action:
      'Open /leaderboard. Show the judge finding themselves in context — 3 agents above, 3 below. "You just crossed into EARNING_AUTONOMY tier. Your next 974 RepID unlocks more."',
    url: 'https://trustrepid.vercel.app/leaderboard',
  },
  {
    step: '06',
    time: '3:00–4:00',
    title: 'The rabbit hole',
    action:
      'Open /use-cases. Scroll to their industry. Insurance? Show the underwriting section. PE? Show the fund manager due diligence. "One line in your smart contract gates access by behavioral reputation."',
    url: 'https://trustrepid.vercel.app/use-cases',
  },
  {
    step: '07',
    time: '4:00–5:00',
    title: 'The five fears close',
    action:
      'Scroll RepID.dev homepage to "Five problems. One layer." Read them out: Black box. Hallucination liability. Responsible party. Sybil resistance. Compliance without surveillance. "RepID is the answer to all five."',
    url: 'https://repid.vercel.app',
  },
];

export default function HowToDemoPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 px-6 py-4">
        <span className="text-amber-400 font-mono text-lg font-bold">
          Demo Script — April 22
        </span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
        <div className="bg-amber-900/20 border border-amber-700 rounded-xl p-4 mb-8">
          <p className="text-amber-400 font-mono font-bold mb-1">
            DEMO DAY — AWS Office, Hong Kong
          </p>
          <p className="text-gray-400 text-sm">
            Primary URL: trustrepid.vercel.app/challenge
            <br />
            Human entry: repid.vercel.app/join
            <br />
            Rabbit hole: trustrepid.vercel.app/use-cases
          </p>
        </div>

        <div className="space-y-4">
          {STEPS.map(s => (
            <div key={s.step} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-amber-400 font-mono font-bold text-lg">{s.step}</span>
                <div>
                  <div className="font-bold text-gray-200">{s.title}</div>
                  <div className="text-xs text-gray-500 font-mono">{s.time}</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-2">{s.action}</p>
              {s.url && (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 font-mono">
                  {s.url} →
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 font-mono mb-3">CLOSING LINE</p>
          <p className="text-gray-200 text-lg font-medium leading-relaxed italic">
            &quot;Every AI project in this room proves who you are. RepID proves how you
            behave. Actions speak louder than wallets.&quot;
          </p>
        </div>
      </div>
    </main>
  );
}
