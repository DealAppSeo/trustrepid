# TrustRepID SDK — Usage (v0.1)

**Status:** v0.1 contract-shape only. The SDK does not yet ship an
installable npm package. This doc describes the intended usage shape
so reviewers and integration partners can evaluate the contract before
v0.2 ships the runtime.

The contract surface is defined in `src/index.ts`. The current
implementation is mock-only — every method returns deterministic mock
data with `TODO(v0.2)` comments pointing to the real source-of-truth
system it will integrate with.

---

## Installation (intended; not yet available)

```bash
npm install @trustrails/trustrepid-sdk ethers
```

Currently this command will fail with `npm ERR! 404` because no
package has been published. v0.2 ships the package; until then,
import from a workspace path during local development or read the
contract directly from `src/index.ts`.

## Construction

```typescript
import { TrustRepIDClientImpl } from '@trustrails/trustrepid-sdk';

const client = new TrustRepIDClientImpl({
  rpcUrl: 'https://sepolia.base.org',
  contractAddress: '0x…',
  ipfsGateway: 'https://gateway.pinata.cloud',
  mockOnly: true,    // v0.1 default; v0.2 will allow false
});
```

## Common flows

### Resolving a holder's current RepID + tier

```typescript
const snap = await client.getRepID(holderAddress);
console.log(snap.combined, snap.tier);
// → 6110 EARNING_AUTONOMY
```

### Generating a threshold proof

```typescript
const proof = await client.proveRepIDThreshold(holderAddress, 5000);
// → { proof: '0x…', publicSignals: { threshold: 5000, holderCommitment: '…' }, … }
```

The proof can then be submitted to any contract that calls
`Plonky3Verifier.verify(proof, [threshold, holderCommitment])`.
See `repid/spec/ZKP-REPID-PROOF.md` for the full circuit spec.

### Staking on a claim

```typescript
const stake = await client.stakeRepID(100, claimId);
// → { stakeId, amount: 100, againstClaimId: claimId, status: 'STAKED', … }
```

### Challenging a claim

```typescript
const challenge = await client.challengeClaim(claimId, {
  evidenceURI: 'ipfs://Qm…',
  rationale: 'Counter-evidence: contract X paid late on 2026-03-01.',
});
// → { challengeId, status: 'CHALLENGE_VOTING', votingDeadline: '…' }
```

See `repid/spec/AGENT-STAKING-CHALLENGE-PROTOCOL.md` for the full
state machine, stake math, and voting thresholds.

### Verifying the audit chain

```typescript
const result = await client.verifyAuditChain(firstEventId, lastEventId);
if (!result.ok) {
  console.error(`Chain broke at row ${result.firstFailureAt}`);
}
```

## What the v0.1 mock returns

The mock implementation derives every output deterministically from
its inputs. Two calls with the same input return the same mock; the
intent is reproducible test-doubling, not realistic data.

Mock output is intentionally unrealistic in places (e.g. all
`getRepID` calls return earned=6500 and perceived=5200). v0.2 wires
to the real engine and the values come from production data.

## What the SDK does NOT do (in v0.1 or v0.2)

- It does not store a holder's wallet private key. The caller is
  responsible for signing transactions; the SDK builds the calldata.
- It does not generate proofs without a witness. The Plonky3 prover
  needs the holder's RepID, nonce, and address — the SDK accepts
  these via a witness-provider abstraction (TBD in v0.2).
- It does not host the audit chain. Audit data lives in the engine
  (private) or a public mirror (TBD); the SDK only reads.

## Migration path (v0.1 → v0.2)

1. Promote `src/` to a publishable workspace (likely
   `packages/trustrepid-sdk/`).
2. Add a build step (`tsc` → `dist/`).
3. Set `private: false` on the new package's `package.json`.
4. Replace each `TODO(v0.2)` in `src/index.ts` with the real
   implementation, citing the source-of-truth file in the comment.
5. Bump version to `0.2.0` and publish.

## References

- SDK contract: `src/index.ts`
- SBT mint flow: `hyperdag-protocol/spec/SBT-MINTING-FLOW.md`
- ZKP RepID proof: `repid/spec/ZKP-REPID-PROOF.md`
- Agent staking + challenge protocol: `repid/spec/AGENT-STAKING-CHALLENGE-PROTOCOL.md`
- Ecosystem map: `hyperdag-protocol/docs/ECOSYSTEM-MAP.md`
