# HyperDAG developer quickstart (15 minutes)

If you're Marco / Vitto / Leonard / a curious dev evaluating HyperDAG,
read this first. By the end you'll have hit three live endpoints, seen
one on-chain transaction, and understand which parts are real-today vs
spec-only.

---

## What HyperDAG ecosystem is (3 paragraphs)

**HyperDAG Protocol** is a trust infrastructure for AI agents and the
humans who custody them. Three load-bearing pieces compose:

1. **ERC-8004 Identity Registry** on Base Sepolia gives agents (and
   humans) a non-transferable on-chain identity. Each registration
   emits a `Registered` event with a hash-chained metadata URI.
2. **RepID** is the behavioural credit score riding on top of identity.
   It's earned through verified actions and decays through inactivity.
   Threshold checks (`R >= T`) can be proven in zero-knowledge so the
   verifier learns the threshold was met without learning the actual
   score.
3. **HAL audit chain** records every consequential decision (mint, RepID
   change, threshold proof) as a hash-chained row in `hal_audit_chain`.
   The chain is publicly verifiable — anyone can re-hash any row and
   compare to what's stored.

The Trinity Symphony (12-agent constitutional architecture) and the
PurposeHub attention router are application-layer products built on
top. This quickstart focuses on the protocol primitives you'd integrate
against.

## Honest maturity table (working today vs spec-only)

| Component | Status | Notes |
|---|---|---|
| ERC-8004 Identity Registry on Base Sepolia | **WORKING** | Contract at 0x8004…BD9e, SOPHIA #3747 inline-metadata mint is the gold standard. |
| Fleet status endpoint (`GET /api/v1/fleet/status`) | **WORKING** | Live RPC query, no DB cache trust. |
| SBT mint endpoint (`POST /api/v1/sbt/mint`) | **WORKING (mock)** | Default `SBT_MINT_MOCK=1`. Sean's wallet rotation switches on real mints. |
| RepID threshold proof (`POST /api/v1/repid/prove-threshold`) | **WORKING (HMAC stub)** | Real Plonky3 circuit lands in Sprint 3. |
| Audit chain public reads (`GET /api/v1/audit-chain/*`) | **WORKING** | Pagination, single event, range verify, stats. |
| Plonky3 prover wrapper | **STUB** | HMAC-SHA256 placeholder; same call shape as future real prover. |
| ERC-8004 ReputationRegistry feedback flow | **SPEC** | `repid/spec/AGENT-STAKING-CHALLENGE-PROTOCOL.md`. |
| Constitutional refusal contract (SHOFET) | **SPEC** | hyperdag-protocol/spec/SBT-MINTING-FLOW.md interface stub. |
| `@trustrails/trustrepid-sdk` npm package | **SCAFFOLD** | `trustrepid/src/index.ts` defines the contract; not yet published. |
| ANFIS-Ikigai attention scorer | **WORKING** | Lives in private `repid-engine`; not yet a public API. |

If something is marked **STUB** or **MOCK** in this table, every
response from that endpoint includes an explicit `is_mock: true` /
`mock_proof: true` indicator. Never a silent fake.

## Three live demo URLs

Replace `https://repid-engine-production.up.railway.app` with whatever
host Sean has deployed (the URL stays the same in production; staging
is on Railway's preview env).

| Demo | Page | Calls |
|---|---|---|
| Fleet status | `/fleet-status/` | `GET /api/v1/fleet/status` |
| SBT mint | `/sbt-mint/` | `GET /api/v1/sbt/challenge`, `POST /api/v1/sbt/mint` |
| RepID prover | `/repid-prover/` | `POST /api/v1/repid/prove-threshold`, `POST /api/v1/repid/verify-threshold` |
| Audit chain | `/audit-chain/` | `GET /api/v1/audit-chain/{recent,event/:id,verify,stats}` |

The four pages are linked from `/demo-tour/` which is the entry surface
for evaluators.

## Three curl commands to verify the API directly

```bash
ENGINE=https://repid-engine-production.up.railway.app

# 1. Fleet — 12 agents, live RPC against the ERC-8004 registry
curl -s "$ENGINE/api/v1/fleet/status" | jq '.agents | length, .fully_discoverable'

# 2. RepID threshold proof — generate (mock-only on stub)
curl -s -X POST "$ENGINE/api/v1/repid/prove-threshold" \
  -H 'content-type: application/json' \
  -d '{"holder":"0x71be63f3384f5fb98995898a86b02fb289d76570","threshold":5000}' | jq

# 3. Audit chain — recent rows
curl -s "$ENGINE/api/v1/audit-chain/recent?limit=5" | jq '.entries[] | {id, event_type, hash: .current_entry_hash}'
```

## How to integrate

The TrustRepID SDK contract scaffold defines the shape your client code
should call against:

- File: `trustrepid/src/index.ts` (in this repo).
- Usage examples: `trustrepid/docs/USAGE.md`.
- v0.1 is mock-only — the methods return deterministic mock data. v0.2
  will swap to real RPC + Plonky3 prover behind the same interface, so
  you can integrate today and pick up real implementations on a minor
  bump.

## Where specs live

| Spec | Path |
|---|---|
| Ecosystem map (5 public repos, layer boundaries) | `hyperdag-protocol/docs/ECOSYSTEM-MAP.md` |
| SBT mint flow | `hyperdag-protocol/spec/SBT-MINTING-FLOW.md` |
| ZKP RepID threshold proof | `repid/spec/ZKP-REPID-PROOF.md` |
| Agent staking + challenge protocol | `repid/spec/AGENT-STAKING-CHALLENGE-PROTOCOL.md` |
| Cross-repo conflict reconciliation | `hyperdag-protocol/docs/CROSS-REPO-RECONCILIATION-2026-04-26.md` |
| Methodology (Pythagorean Comma + scoring math) | `hyperdag-protocol/METHODOLOGY.md` |
| P-014 reduction-to-practice | `repid-engine/docs/P-014-REDUCTION-TO-PRACTICE.md` (private repo; available on request) |

## Where to ask questions

- **Bugs / feature requests:** open an issue against the relevant repo
  (each has issue templates under `.github/ISSUE_TEMPLATE/`).
- **Protocol-level questions:** `hyperdag-protocol` repo issues.
- **SDK integration questions:** `trustrepid` repo issues.
- **Direct line:** dealappseo@gmail.com (Sean Goodwin, founder).

## What this quickstart deliberately does NOT promise

- "Production-grade." v0.1 means demo-grade with honest mock indicators
  where the real implementation is in flight.
- "Audited contracts." The ERC-8004 IdentityRegistry is third-party
  (Marco De Rossi et al.); HyperDAG-specific extensions are under
  active development and not yet audited.
- "Cross-chain." Base Sepolia only in v0.1.
- "Real Plonky3 proofs." Sprint 3 ships those; v0.1 is HMAC-stub.

If you want to evaluate against any of those properties, the maturity
table above tells you which specific endpoint to revisit when v0.2
ships.
