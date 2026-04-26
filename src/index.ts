/**
 * @trustrails/trustrepid-sdk — TrustRepID SDK contract scaffold (v0.1)
 *
 * This file defines the SHAPE of the TrustRepID SDK. It is
 * documentation-of-intent. The methods return mock data with explicit
 * TODO comments pointing to the real systems they will integrate
 * with in v0.2.
 *
 * The trustrepid repo is a Next.js 16 application; package.json is
 * `private: true`. This src/ directory is NOT currently part of the
 * Next.js build path. It exists so:
 *   - Marco / Vitto / Leonard can read the intended SDK contract
 *     without having to read the README's TypeScript code blocks.
 *   - The SDK can be split into a publishable package later without
 *     having to design the interface from scratch.
 *
 * To turn this into a real npm package, a future sprint will:
 *   - Move this file (and its supporting docs) into a new
 *     `packages/trustrepid-sdk/` workspace.
 *   - Set `private: false` on the new package's package.json.
 *   - Wire `tsc` to build `dist/` and add `main`/`types` entries.
 *   - Replace the mock implementations with real RPC + Plonky3
 *     prover integrations.
 *
 * See `docs/USAGE.md` for the intended developer-facing flow.
 */

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type RepIDTier = 'CUSTODIED' | 'EARNING_AUTONOMY' | 'AUTONOMOUS';

export interface SBTRecord {
  /** Token id, hex-encoded keccak256(holder || ts || protocolVersion). */
  tokenId: string;
  /** Wallet address that holds the SBT. */
  holder: string;
  /** ISO-8601 timestamp the SBT was minted. */
  mintedAt: string;
  /** Hash pointer to the holder's current RepID commitment. */
  repIdCommitment: string;
  /** ipfs:// URI returned by tokenURI(). */
  metadataURI: string;
}

export interface MintParams {
  /** The wallet that will hold the new SBT. */
  holder: string;
  /** Hash to use as the initial RepID commitment. */
  repIdCommitment: string;
  /** Optional IPFS gateway override; default is Pinata. */
  ipfsGateway?: string;
}

export interface SBTMintResult {
  txHash: string;
  tokenId: string;
  ipfsURI: string;
}

export interface RepIDSnapshot {
  holder: string;
  /** Earned-RepID component, [0, 10000]. */
  earned: number;
  /** Perceived-RepID component, [0, 10000]. */
  perceived: number;
  /** 0.7 × earned + 0.3 × perceived. */
  combined: number;
  tier: RepIDTier;
  lastUpdated: string;
}

export interface ZKProof {
  /** Plonky3 STARK bytes, hex-encoded. */
  proof: string;
  /** Public inputs the proof was generated against. */
  publicSignals: { threshold: number; holderCommitment: string };
  /** When this proof was produced. */
  generatedAt: string;
}

export interface AuditEntry {
  eventId: string;
  /** SHA-256 of the event payload + previous hash + table + source id. */
  hashOfEntry: string;
  /** Previous entry's hash, or null for the first row in the chain. */
  previousHash: string | null;
  payload: Record<string, unknown>;
  recordedAt: string;
}

export interface VerifyResult {
  ok: boolean;
  rangeStart?: string;
  rangeEnd?: string;
  rowsVerified: number;
  /** First row index where verification fails, or null if all verified. */
  firstFailureAt: number | null;
}

// --- Staking + challenge types -------------------------------------------

export interface StakeResult {
  stakeId: string;
  amount: number;
  againstClaimId: string;
  status: 'STAKED';
  recordedAt: string;
}

export interface ChallengeEvidence {
  /** IPFS CID of the evidence bundle. */
  evidenceURI: string;
  /** Optional supporting on-chain tx hashes. */
  supportingTxs?: string[];
  /** Free-form rationale, max 2000 chars. */
  rationale: string;
}

export interface ChallengeResult {
  challengeId: string;
  claimId: string;
  status: 'CHALLENGE_OPEN' | 'CHALLENGE_VOTING';
  votingDeadline?: string;
}

export interface VoteResult {
  challengeId: string;
  voter: string;
  support: 'agree' | 'dispute';
  weight: number;
  recordedAt: string;
}

// ---------------------------------------------------------------------------
// SDK contract
// ---------------------------------------------------------------------------

export interface TrustRepIDClientOptions {
  /** RPC URL for the chain hosting the SBT contract. */
  rpcUrl: string;
  /** Address of the deployed IHyperDAGSBT contract. */
  contractAddress: string;
  /** Optional override for the IPFS gateway to resolve tokenURIs. */
  ipfsGateway?: string;
  /** When set, the SDK will not attempt any real RPC calls and will
   *  return mock data only. v0.1 default is `true` because no real
   *  prover/RPC integration is in this repo yet. */
  mockOnly?: boolean;
}

/**
 * SDK contract surface. v0.1 returns mock data only. Each method has a
 * TODO comment pointing at the real source-of-truth system that v0.2
 * will integrate with.
 */
export interface TrustRepIDClient {
  // ---- SBT operations ----
  getSBT(holder: string): Promise<SBTRecord | null>;
  mintSBT(params: MintParams): Promise<SBTMintResult>;

  // ---- RepID operations ----
  getRepID(holder: string): Promise<RepIDSnapshot>;
  proveRepIDThreshold(holder: string, threshold: number): Promise<ZKProof>;

  // ---- Audit operations ----
  getAuditChainEntry(eventId: string): Promise<AuditEntry>;
  verifyAuditChain(fromEventId?: string, toEventId?: string): Promise<VerifyResult>;

  // ---- Agent challenge / staking operations ----
  stakeRepID(amount: number, againstClaimId: string): Promise<StakeResult>;
  challengeClaim(claimId: string, evidence: ChallengeEvidence): Promise<ChallengeResult>;
  voteOnChallenge(challengeId: string, support: 'agree' | 'dispute'): Promise<VoteResult>;
}

// ---------------------------------------------------------------------------
// v0.1 mock implementation
// ---------------------------------------------------------------------------

/**
 * v0.1 mock TrustRepIDClient. Constructs without any real network.
 *
 * Every method returns a deterministic mock derived from its inputs.
 * Real implementations land in v0.2; the contract (above) does not
 * change.
 */
export class TrustRepIDClientImpl implements TrustRepIDClient {
  private opts: TrustRepIDClientOptions;

  constructor(opts: TrustRepIDClientOptions) {
    this.opts = { mockOnly: true, ...opts };
  }

  // ---- SBT ----

  async getSBT(holder: string): Promise<SBTRecord | null> {
    // TODO(v0.2): query contract.tokenOfOwner(holder) and tokenURI() via
    // ethers.Contract. Resolve IPFS via opts.ipfsGateway. See
    // hyperdag-protocol/spec/SBT-MINTING-FLOW.md §"Phase 5".
    if (!this.opts.mockOnly) throw new Error('Real RPC integration not yet wired');
    return {
      tokenId: deterministicMockHex(holder, 'tokenId'),
      holder,
      mintedAt: '2026-04-26T00:00:00Z',
      repIdCommitment: deterministicMockHex(holder, 'repIdCommitment'),
      metadataURI: `ipfs://Qm${deterministicMockHex(holder, 'cid').slice(0, 44)}`,
    };
  }

  async mintSBT(params: MintParams): Promise<SBTMintResult> {
    // TODO(v0.2): call contract.mint(params.repIdCommitment) signed by
    // the holder's wallet. Wait for the SBTMinted event. Pin metadata to
    // IPFS via Pinata. See hyperdag-protocol/spec/SBT-MINTING-FLOW.md
    // §"Phase 4" and §"Phase 5".
    if (!this.opts.mockOnly) throw new Error('Real RPC integration not yet wired');
    return {
      txHash: deterministicMockHex(params.holder, 'tx'),
      tokenId: deterministicMockHex(params.holder, 'tokenId'),
      ipfsURI: `ipfs://Qm${deterministicMockHex(params.holder, 'cid').slice(0, 44)}`,
    };
  }

  // ---- RepID ----

  async getRepID(holder: string): Promise<RepIDSnapshot> {
    // TODO(v0.2): GET /api/v1/repid/:holder against the public repid-engine
    // API surface. Map the response to RepIDSnapshot. See
    // hyperdag-protocol/METHODOLOGY.md for the canonical scoring math.
    if (!this.opts.mockOnly) throw new Error('Real RPC integration not yet wired');
    const earned = 6500;
    const perceived = 5200;
    const combined = Math.round(0.7 * earned + 0.3 * perceived);
    return {
      holder,
      earned,
      perceived,
      combined,
      tier: tierFor(combined),
      lastUpdated: '2026-04-26T00:00:00Z',
    };
  }

  async proveRepIDThreshold(holder: string, threshold: number): Promise<ZKProof> {
    // TODO(v0.2): invoke the Plonky3 prover from
    // hyperdag-core/services/zkp-postcard. Build the witness from the
    // holder's current RepID commitment + nonce, generate the proof,
    // return the public signals and proof bytes. See
    // repid/spec/ZKP-REPID-PROOF.md §"Circuit: rep_id_threshold".
    if (!this.opts.mockOnly) throw new Error('Real prover integration not yet wired');
    return {
      proof: '0x' + deterministicMockHex(`${holder}:${threshold}`, 'proof'),
      publicSignals: {
        threshold,
        holderCommitment: deterministicMockHex(holder, 'commitment'),
      },
      generatedAt: new Date().toISOString(),
    };
  }

  // ---- Audit ----

  async getAuditChainEntry(eventId: string): Promise<AuditEntry> {
    // TODO(v0.2): query the public audit-chain readback endpoint
    // (hyperdag-core or repid-engine, whichever exposes it publicly).
    // See hyperdag-protocol/METHODOLOGY.md for the audit-chain shape.
    if (!this.opts.mockOnly) throw new Error('Real audit-chain integration not yet wired');
    return {
      eventId,
      hashOfEntry: deterministicMockHex(eventId, 'hash'),
      previousHash: null,
      payload: { mock: true, eventId },
      recordedAt: '2026-04-26T00:00:00Z',
    };
  }

  async verifyAuditChain(fromEventId?: string, toEventId?: string): Promise<VerifyResult> {
    // TODO(v0.2): walk the chain from fromEventId to toEventId, verify
    // each row's hash matches H(prevHash || canonicalJson(payload) ||
    // sourceTable || sourceId). See repid-engine's auditChainWriter.ts
    // for the canonical hashing recipe.
    if (!this.opts.mockOnly) throw new Error('Real verifier integration not yet wired');
    return {
      ok: true,
      ...(fromEventId !== undefined ? { rangeStart: fromEventId } : {}),
      ...(toEventId !== undefined ? { rangeEnd: toEventId } : {}),
      rowsVerified: 0,
      firstFailureAt: null,
    };
  }

  // ---- Staking + challenge ----

  async stakeRepID(amount: number, againstClaimId: string): Promise<StakeResult> {
    // TODO(v0.2): call the staking contract's lockStake() (when shipped).
    // For now, stakes are persisted in the engine. See
    // repid/spec/AGENT-STAKING-CHALLENGE-PROTOCOL.md §"Math: stake amounts".
    if (!this.opts.mockOnly) throw new Error('Real staking integration not yet wired');
    return {
      stakeId: deterministicMockHex(`${againstClaimId}:${amount}`, 'stake'),
      amount,
      againstClaimId,
      status: 'STAKED',
      recordedAt: new Date().toISOString(),
    };
  }

  async challengeClaim(claimId: string, evidence: ChallengeEvidence): Promise<ChallengeResult> {
    // TODO(v0.2): submit the challenge to the engine, transition the
    // claim into CHALLENGE_OPEN / CHALLENGE_VOTING per the protocol
    // spec. See repid/spec/AGENT-STAKING-CHALLENGE-PROTOCOL.md
    // §"State machine".
    if (!this.opts.mockOnly) throw new Error('Real challenge integration not yet wired');
    return {
      challengeId: deterministicMockHex(`${claimId}:${evidence.evidenceURI}`, 'chal'),
      claimId,
      status: 'CHALLENGE_VOTING',
      votingDeadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    };
  }

  async voteOnChallenge(challengeId: string, support: 'agree' | 'dispute'): Promise<VoteResult> {
    // TODO(v0.2): submit the vote with the caller's RepID weight.
    // Eligibility floor (RepID >= 5000 / >= 7000 for high-tier) is
    // enforced server-side. See repid/spec/AGENT-STAKING-CHALLENGE-
    // PROTOCOL.md §"Voting".
    if (!this.opts.mockOnly) throw new Error('Real vote integration not yet wired');
    return {
      challengeId,
      voter: '0x0000000000000000000000000000000000000000',
      support,
      weight: 0,
      recordedAt: new Date().toISOString(),
    };
  }
}

// ---------------------------------------------------------------------------
// Helpers — internal only
// ---------------------------------------------------------------------------

function tierFor(repId: number): RepIDTier {
  if (repId >= 5000) return 'AUTONOMOUS';
  if (repId >= 1000) return 'EARNING_AUTONOMY';
  return 'CUSTODIED';
}

/**
 * Deterministic hex string derived from inputs. Used by the v0.1 mock
 * implementations so test-doubling against the SDK is reproducible.
 * Not cryptographic — the mock implementation does not need to be.
 */
function deterministicMockHex(input: string, salt: string): string {
  let h = 0;
  const s = `${input}|${salt}`;
  for (let i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) >>> 0;
  // Pad out to 64 hex chars.
  let out = '';
  let cur = h;
  for (let i = 0; i < 16; i++) {
    cur = ((cur * 1103515245) + 12345) >>> 0;
    out += cur.toString(16).padStart(8, '0');
  }
  return out.slice(0, 64);
}
