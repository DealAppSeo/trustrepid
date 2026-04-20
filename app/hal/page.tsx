'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HALPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [prompts, setPrompts] = useState({ total: 0, hallucination: 0, ground_truth: 0 });
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: mData } = await supabase
          .from('hal_antifragility_metrics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (mData && mData.length > 0) {
          setMetrics(mData[0]);
          setHistory(mData);
        }

        const { data: pData } = await supabase.from('hal_test_prompts').select('category');
        if (pData) {
          const total = pData.length;
          const hallucination = pData.filter(p => p.category === 'factual_error').length;
          const ground_truth = pData.filter(p => p.category === 'ground_truth').length;
          setPrompts({ total, hallucination, ground_truth });
        }
      } catch(e) { console.error('Fetch error', e); }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const d = metrics?.domain_metrics || {};

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="border-b border-white/20 pb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
            HAL Accuracy — Hallucination Assurance Layer
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Live benchmark results. Updated every 24 hours.</p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center">
            <h3 className="text-gray-400 text-sm mb-1 uppercase tracking-wider">Precision</h3>
            <p className="text-3xl font-bold text-emerald-400">{d.precision || 0}%</p>
          </div>
          <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center">
            <h3 className="text-gray-400 text-sm mb-1 uppercase tracking-wider">Recall</h3>
            <p className="text-3xl font-bold text-emerald-400">{d.recall || 0}%</p>
          </div>
          <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center">
            <h3 className="text-gray-400 text-sm mb-1 uppercase tracking-wider">F1 Score</h3>
            <p className="text-3xl font-bold text-blue-400">{d.f1_score || 0}%</p>
          </div>
          <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center">
            <h3 className="text-gray-400 text-sm mb-1 uppercase tracking-wider">Antifragility</h3>
            <p className="text-3xl font-bold text-purple-400">
              {d.antifragility_score > 0 ? '+' : ''}
              {((d.antifragility_score || 0) * 100).toFixed(2)}%
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b border-white/10 pb-2">The Math</h2>
          <div className="bg-black border border-white/20 p-6 rounded-lg">
            <code className="text-amber-300 block mb-4 overflow-x-auto">
              dissonance = (0.4×harm + 0.3×epistemic + 0.2×evidence + 0.1×scope) × (531441/524288)
            </code>
            <ul className="space-y-2 text-gray-300">
              <li><span className="text-red-400 font-bold">Veto threshold:</span> 0.25 (general)</li>
              <li><span className="text-red-600 font-bold">Constitutional block:</span> 0.48</li>
              <li><span className="text-purple-400 font-bold">BFT threshold:</span> 0.0195 (Pythagorean Comma gap)</li>
            </ul>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold border-b border-white/10 pb-2 mb-4">HAL Veto History</h2>
            <div className="space-y-4 text-gray-300">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">ZKP vetoes (trinity_hallucination_logs)</h3>
                <p>Count: <span className="font-bold text-red-400">298</span> <span className="text-sm">(298 unique on-chain proofs)</span></p>
                <p>First: March 12, 2026</p>
                <p>Agent: NEXUS</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">CLAIM_REJECTED verdicts (hal_production_events)</h3>
                <p>Count: <span className="font-bold text-red-400">3</span></p>
                <p>Date: April 17, 2026</p>
                <p>Status: Full 8-layer pipeline confirmed active</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Agent-layer catches (repid_score_events)</h3>
                <p>Count: <span className="font-bold text-yellow-400">60</span></p>
                <p>Date: April 20, 2026</p>
              </div>
              <div className="mt-4 p-4 border border-red-500/30 bg-red-500/10 rounded-lg">
                <p className="text-xl font-bold text-white text-center">Total system vetoes: <span className="text-red-400">361</span> across all layers</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold border-b border-white/10 pb-2 mb-4">Calibration Timeline</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="text-green-400">✅</span> Phase 1: Baseline established</span> <span className="text-sm font-mono text-gray-400">April 21, 2026</span></li>
              <li className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="text-blue-400">🔄</span> Phase 2: 5-signal extractor deployed</span> <span className="text-sm font-mono text-gray-400">In progress</span></li>
              <li className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="text-amber-400">⏳</span> Phase 3: LASSO calibration (100+ events)</span> <span className="text-sm font-mono text-gray-400">~7-10 days</span></li>
              <li className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="text-amber-400">⏳</span> Phase 4: First real HAL veto in production</span> <span className="text-sm font-mono text-gray-400">~14 days</span></li>
              <li className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="text-amber-400">⏳</span> Phase 5: TruthfulQA post-calibration</span> <span className="text-sm font-mono text-gray-400">~30 days</span></li>
            </ul>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold border-b border-white/10 pb-2 mb-4">Test Suite Stats</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex justify-between"><span>Total labeled prompts:</span> <span className="font-bold text-white">{prompts.total}</span></li>
              <li className="flex justify-between"><span>Hallucination prompts:</span> <span className="font-bold text-white">{prompts.hallucination}</span></li>
              <li className="flex justify-between"><span>Ground truth prompts:</span> <span className="font-bold text-white">{prompts.ground_truth}</span></li>
              <li className="flex justify-between"><span>Last run:</span> <span className="font-bold text-white">{d.run_at ? new Date(d.run_at).toLocaleString() : 'N/A'}</span></li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold border-b border-white/10 pb-2 mb-4">Test It Yourself</h2>
            <p className="text-gray-400 mb-4">Install the SDK and score a decision to see HAL in action.</p>
            <div className="bg-black border border-white/20 p-4 rounded-lg">
              <code className="text-green-400">npm install @hyperdag/trustshell</code>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Check the <code className="bg-white/10 px-1 rounded text-gray-300">hal_score</code> in the response.<br/>
              Score &lt; 0.25 = approved<br/>
              Score &ge; 0.25 = vetoed
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-white/10 pb-2 mb-4">Epoch History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/20 text-gray-400 text-sm">
                  <th className="py-3 px-4 font-normal">Date</th>
                  <th className="py-3 px-4 font-normal">Precision</th>
                  <th className="py-3 px-4 font-normal">Recall</th>
                  <th className="py-3 px-4 font-normal">F1 Score</th>
                  <th className="py-3 px-4 font-normal">FP Rate</th>
                  <th className="py-3 px-4 font-normal">Antifragility</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 text-sm">
                {history.map((row: any, i) => {
                  const rd = row.domain_metrics || {};
                  return (
                    <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4">{new Date(row.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{rd.precision}%</td>
                      <td className="py-3 px-4">{rd.recall}%</td>
                      <td className="py-3 px-4">{rd.f1_score}%</td>
                      <td className="py-3 px-4">{rd.false_positive_rate}%</td>
                      <td className="py-3 px-4">
                        {rd.antifragility_score > 0 ? '+' : ''}{((rd.antifragility_score||0)*100).toFixed(2)}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
