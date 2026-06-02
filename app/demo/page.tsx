import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export default async function DemoPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [
    { data: agents }, 
    { data: llmTrust }, 
    { data: proofs }, 
    { data: stats },
    { data: configs }
  ] = await Promise.all([
    supabase.from('repid_agents').select('*').order('current_repid', { ascending: false }),
    supabase.rpc('get_llm_trust_standings'),
    supabase.from('repid_proof_queue').select('status,proof_hash,zkp_service_url').order('created_at', { ascending: false }),
    supabase.from('repid_score_events').select('id,hallucination_caught'),
    supabase.from('repid_config').select('*')
  ]);

  const totalDecisions = stats?.length || 0;
  const halCatches = stats?.filter(s => s.hallucination_caught)?.length || 0;
  const approvals = totalDecisions - halCatches;
  const approveRate = totalDecisions ? ((approvals / totalDecisions) * 100).toFixed(1) : '0.0';

  const zkpUrl = configs?.find(c => c.key === 'zkp_service_url')?.value || 'Pending...';
  const stakingContract = configs?.find(c => c.key === 'staking_contract_address')?.value || '0xd35331Bf94b1A4F4CAf595951056C288ce58C4fA';

  const pendingProofs = proofs?.filter(p => p.status === 'pending')?.length || 0;
  const completedProofs = proofs?.filter(p => p.status === 'completed')?.length || 0;
  const lastProof = proofs?.find(p => p.status === 'completed');

  const registeredAgents = agents?.filter(a => ['SOPHIA','GUARDIAN','TORCH','GCM'].includes(a.agent_name)) || [];

  return (
    <main style={{ backgroundColor: '#0a0a0a', color: '#fff', padding: '40px', fontFamily: 'monospace', minHeight: '100vh' }}>
      <h1 style={{ color: '#4ADE80', fontSize: '24px', marginBottom: '40px' }}>HyperDAG End-to-End Trust System</h1>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#9CA3AF', marginBottom: '16px' }}>1. Live System Stats</h2>
        <div style={{ border: '1px solid #374151', padding: '16px', borderRadius: '8px' }}>
          Agents: {agents?.length || 0} | VDR: {totalDecisions} | Decisions: {totalDecisions}<br/>
          HAL approval rate: {approveRate}% | Hallucinations caught: {halCatches}
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#9CA3AF', marginBottom: '16px' }}>2. ZKP Proof Service</h2>
        <div style={{ border: '1px solid #374151', padding: '16px', borderRadius: '8px' }}>
          Status: <span style={{ color: '#4ADE80' }}>● LIVE</span> — Plonky3 STARK v0.2.0<br/>
          URL: {zkpUrl}/health<br/>
          Field: BabyBear | Hash: Poseidon2 | Type: STARK<br/>
          <span style={{ color: '#9CA3AF' }}>"Quantum-resistant. No trusted setup required."</span>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#9CA3AF', marginBottom: '16px' }}>3. On-Chain Agents</h2>
        <div style={{ border: '1px solid #374151', padding: '16px', borderRadius: '8px' }}>
          {registeredAgents.map(a => (
            <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', gap: '8px', marginBottom: '8px' }}>
              <span>{a.agent_name}</span>
              <span style={{ color: '#FCD34D' }}>{a.current_repid}</span>
              <span style={{ color: '#9CA3AF' }}>{a.tier}</span>
              <a href={`https://sepolia.basescan.org/tx/${a.erc8004_address}`} target="_blank" style={{ color: '#60A5FA' }}>{a.erc8004_address?.substring(0,10)}...</a>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#9CA3AF', marginBottom: '16px' }}>4. Staking Contract</h2>
        <div style={{ border: '1px solid #374151', padding: '16px', borderRadius: '8px' }}>
          Address: {stakingContract}<br/>
          Network: Base Sepolia<br/>
          BaseScan: <a href={`https://sepolia.basescan.org/address/${stakingContract}`} target="_blank" style={{ color: '#60A5FA' }}>View Contract →</a><br/><br/>
          <span style={{ color: '#9CA3AF' }}>
            "Agents stake collateral on every decision.<br/>
            HAL approves → stake returned.<br/>
            HAL blocks → stake slashed to insurance pool."
          </span>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#9CA3AF', marginBottom: '16px' }}>5. LLM Trust Leaderboard</h2>
        <div style={{ border: '1px solid #374151', padding: '16px', borderRadius: '8px' }}>
          {llmTrust?.map((l: any) => (
            <div key={l.llm_provider} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', marginBottom: '8px' }}>
              <span>{l.llm_provider}</span>
              <span>{l.total_decisions} decisions</span>
              <span style={{ color: '#EF4444' }}>{Number(l.hallucination_rate_pct).toFixed(1)}% HAL</span>
              <span style={{ color: '#4ADE80' }}>Trust: {Number(l.trust_score_pct).toFixed(1)}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#9CA3AF', marginBottom: '16px' }}>6. Proof Queue</h2>
        <div style={{ border: '1px solid #374151', padding: '16px', borderRadius: '8px' }}>
          Pending: {pendingProofs} | Completed: {completedProofs}<br/>
          Last proof: {lastProof ? lastProof.proof_hash?.substring(0, 20) + '...' : 'N/A'} | Service: {lastProof?.zkp_service_url || zkpUrl}
        </div>
      </section>

    </main>
  );
}
