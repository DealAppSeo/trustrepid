const ENGINE_URL = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || 'https://repid-engine-production.up.railway.app';

// Canonical 5-tier scheme (matches repid-engine compute_tier + CLAUDE.md).
// The old 3-tier names (CUSTODIED_DBT/EARNING_AUTONOMY) were a deprecated
// taxonomy the engine no longer emits.
export type Tier = 'PROBATIONARY' | 'EARNING' | 'ESTABLISHED' | 'AUTONOMOUS' | 'VETERAN';

export interface Agent {
  id: string;
  agent_name: string;
  current_repid: number;
  tier: Tier;
  activity_30d: number;
  last_updated: string;
  erc8004_address: string;
  vdr_count?: number;
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

export const TIER_COLORS: Record<Tier, { bg: string; text: string; border: string; label: string; emoji: string }> = {
  VETERAN: { bg: 'bg-purple-100', text: 'text-purple-800',
    border: 'border-purple-400', label: 'VETERAN', emoji: '👑' },
  AUTONOMOUS: { bg: 'bg-amber-100', text: 'text-amber-800',
    border: 'border-amber-400', label: 'AUTONOMOUS', emoji: '🏆' },
  ESTABLISHED: { bg: 'bg-blue-100', text: 'text-blue-800',
    border: 'border-blue-400', label: 'ESTABLISHED', emoji: '📈' },
  EARNING: { bg: 'bg-teal-100', text: 'text-teal-800',
    border: 'border-teal-400', label: 'EARNING', emoji: '🌱' },
  PROBATIONARY: { bg: 'bg-gray-100', text: 'text-gray-700',
    border: 'border-gray-400', label: 'PROBATIONARY', emoji: '🔒' },
} as const;

/** Fallback for any tier string the engine returns that we don't style. */
export const DEFAULT_TIER_STYLE = TIER_COLORS.PROBATIONARY;

export interface PublicStats {
  decisionsScored: number;
  auditChainLength: number;
}

/** Public HAL stats for the landing tiles (no auth). */
export async function getPublicStats(): Promise<PublicStats | null> {
  try {
    const res = await fetch(`${ENGINE_URL}/api/v1/hal/stats`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const d = await res.json();
    return {
      decisionsScored: Number(d.total_classifications ?? 0),
      auditChainLength: Number(d.audit_chain_length ?? 0),
    };
  } catch { return null; }
}

export async function getEngineHealth(): Promise<EngineHealth | null> {
  try {
    const res = await fetch(`${ENGINE_URL}/health`, { next: { revalidate: 30 } });
    return res.ok ? res.json() : null;
  } catch { return null; }
}

/**
 * Public agent leaderboard. Uses the engine's public /api/v1/agents/minted
 * (the auth-gated /agents needs an API key; the direct-Supabase path 401s
 * under RLS). Maps the minted shape onto our Agent interface.
 */
export async function getAgents(limit = 20): Promise<Agent[]> {
  const res = await fetch(`${ENGINE_URL}/api/v1/agents/minted?limit=${limit}`,
    { next: { revalidate: 10 } });
  if (!res.ok) throw new Error(`getAgents failed: ${res.status}`);
  const data = await res.json();
  const rows: Array<Record<string, unknown>> = Array.isArray(data) ? data : (data.agents ?? []);
  return rows.slice(0, limit).map((r) => ({
    id: String(r.agent_id ?? r.name ?? ''),
    agent_name: String(r.display_name ?? r.name ?? r.agent_id ?? 'unknown'),
    current_repid: Number(r.current_repid ?? 0),
    tier: (r.tier as Tier) ?? 'PROBATIONARY',
    activity_30d: Number(r.activity_30d ?? 0),
    last_updated: String(r.last_updated ?? ''),
    erc8004_address: String(r.erc8004_token_id ?? r.erc8004_address ?? ''),
  }));
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
