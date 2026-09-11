import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { computeMetrics } from '@/lib/metrics';

export const revalidate = 60;

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const [agents, decisions, hallucinations] = await Promise.all([
      supabase.from('repid_agents').select('id,vdr_count'),
      supabase.from('repid_score_events')
        .select('id,llm_provider')
        .not('llm_provider','is',null),
      supabase.from('repid_score_events')
        .select('id').eq('hallucination_caught',true)
    ]);
    const metrics = computeMetrics(agents, decisions, hallucinations);
    // A degraded read is not a real read — say so (503), never a fabricated count.
    return NextResponse.json(metrics, { status: metrics.available ? 200 : 503 });
  } catch {
    return NextResponse.json({ available: false, error: 'metrics_unavailable' }, { status: 503 });
  }
}
