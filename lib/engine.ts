const ENGINE_URL = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || 'https://repid-engine-production.up.railway.app';

export interface Agent {
  id: string;
  agent_name: string;
  current_repid: number;
  tier: 'CUSTODIED_DBT' | 'EARNING_AUTONOMY' | 'AUTONOMOUS';
  activity_30d: number;
  last_updated: string;
  erc8004_address: string;
}

export interface EngineHealth {
  status: string;
  version: string;
  timestamp: string;
  supabaseConnected: boolean;
  engine: string;
}

export interface RepIdEvent {
  id: number;
  event_type: string;
  delta: number;
  repid_before: number;
  repid_after: number;
  certainty_at_claim: number | null;
  eas_attestation_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ZKPDisclosure {
  proofType: string;
  agentName: string;
  tier: string;
  erc8004Address: string;
  easSchema: string;
  constitutionVersion?: string;
  repIdScore: string;
  decisionHistory?: string;
  decisionCount?: number;
  capitalProtectionRate?: number;
  constitutionalPassRate?: number;
  merkleRoot?: string;
}

export const TIER_COLORS = {
  AUTONOMOUS: { bg: 'bg-amber-100', text: 'text-amber-800',
    border: 'border-amber-400', label: 'AUTONOMOUS', emoji: '🏆' },
  EARNING_AUTONOMY: { bg: 'bg-blue-100', text: 'text-blue-800',
    border: 'border-blue-400', label: 'EARNING AUTONOMY', emoji: '📈' },
  CUSTODIED_DBT: { bg: 'bg-gray-100', text: 'text-gray-700',
    border: 'border-gray-400', label: 'CUSTODIED DBT', emoji: '🔒' },
} as const;

export async function getEngineHealth(): Promise<EngineHealth | null> {
  try {
    const res = await fetch(`${ENGINE_URL}/health`, { next: { revalidate: 30 } });
    return res.ok ? res.json() : null;
  } catch { return null; }
}

export async function getAgents(limit = 20): Promise<Agent[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && anonKey) {
    const res = await fetch(`${supabaseUrl}/rest/v1/repid_agents?current_repid=gt.0&order=current_repid.desc&select=id,agent_name,current_repid,tier,activity_30d,last_updated,erc8004_address&limit=${limit}`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      },
      next: { revalidate: 10 }
    });
    if (!res.ok) throw new Error(`getAgents Supabase failed: ${res.status}`);
    return res.json();
  }

  const res = await fetch(`${ENGINE_URL}/agents?limit=${limit}`,
    { next: { revalidate: 10 } });
  if (!res.ok) throw new Error(`getAgents failed: ${res.status}`);
  return res.json();
}

export async function getAgent(id: string): Promise<Agent | null> {
  try {
    const res = await fetch(`${ENGINE_URL}/agents/${id}`,
      { cache: 'no-store' });
    return res.ok ? res.json() : null;
  } catch { return null; }
}

export async function getAgentHistory(id: string): Promise<RepIdEvent[]> {
  try {
    const res = await fetch(`${ENGINE_URL}/agents/${id}/history`,
      { cache: 'no-store' });
    return res.ok ? res.json() : [];
  } catch { return []; }
}

export async function getZKPDisclosure(
  id: string, proofType: 'POSTCARD' | 'ENVELOPE'
): Promise<ZKPDisclosure | null> {
  try {
    const res = await fetch(
      `${ENGINE_URL}/agents/${id}/zkp/${proofType}`,
      { cache: 'no-store' }
    );
    return res.ok ? res.json() : null;
  } catch { return null; }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAgentBadges(id: string): Promise<any[]> {
  try {
    const res = await fetch(`${ENGINE_URL}/agents/${id}/badges`, { cache: 'no-store' });
    return res.ok ? res.json() : [];
  } catch { return []; }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAgentEthics(id: string): Promise<any> {
  try {
    const res = await fetch(`${ENGINE_URL}/agents/${id}/ethics`, { cache: 'no-store' });
    return res.ok ? res.json() : null;
  } catch { return null; }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getBounties(): Promise<any[]> {
  try {
    const res = await fetch(`${ENGINE_URL}/bounties`, { next: { revalidate: 60 } });
    return res.ok ? res.json() : [];
  } catch { return []; }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getBounty(id: string): Promise<any> {
  try {
    const res = await fetch(`${ENGINE_URL}/bounties/${id}`, { cache: 'no-store' });
    return res.ok ? res.json() : null;
  } catch { return null; }
}

export function formatRepId(repId: number): string {
  return repId.toLocaleString();
}

export function formatDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : `${delta}`;
}
