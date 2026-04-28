# TrustRepID — Constitutional Trust Infrastructure for the Agentic Economy

> **"ERC-8004 gives agents a passport. x402 gives them a wallet. HyperDAG gives them a character."**

[![HyperDAG Protocol](https://img.shields.io/badge/Protocol-HyperDAG-0F6E56?style=flat-square)](https://github.com/dealappseo/hyperdag-protocol)
[![ERC-8004](https://img.shields.io/badge/Standard-ERC--8004-534AB7?style=flat-square)](https://github.com/erc-8004/erc-8004-contracts)
[![x402](https://img.shields.io/badge/Payments-x402-BA7517?style=flat-square)](https://github.com/x402-rs/x402-rs)
[![Live](https://img.shields.io/badge/Live-trustrepid.dev-1D9E75?style=flat-square)](https://trustrepid.dev)

---

## Try it live

| Surface | URL | What it shows |
|---|---|---|
| **No-wallet visitor demo** | [trustrepid.dev/reponomics-live/](https://trustrepid.dev/reponomics-live/) | Get a `0xdead0e707…` builder address, deposit stake, run an APM/VERITAS round, watch RepID move — all without a wallet. 60-second flow. |
| **Builder dashboard (full account)** | [trustrepid.dev/builder-dashboard/](https://trustrepid.dev/builder-dashboard/) | Email + password signup, mint ERC-7231, link an Alpaca paper account, fire a paper trade, see authority + character + wisdom move. |
| **Two-builder snapshot (live data)** | [repid-engine-production.up.railway.app/api/v1/demo/two-builder/snapshot](https://repid-engine-production.up.railway.app/api/v1/demo/two-builder/snapshot) | Public JSON of Builder W (above floor, real authority) and Builder M (below floor, authority = 0). |
| **Public metrics** | [repid-engine-production.up.railway.app/api/v1/metrics](https://repid-engine-production.up.railway.app/api/v1/metrics) | Live agent count, VDR, hallucination catches, on-chain contract addresses. |

## Architecture (text view)

```
                     ┌─────────────────────────────────┐
                     │   trustrepid.dev (Next.js)      │
                     │   /reponomics-live/  ← visitors │
                     │   /builder-dashboard ← accounts │
                     └────────────────┬────────────────┘
                                      │ HTTPS
                                      ▼
            ┌──────────────────────────────────────────────────┐
            │  repid-engine (Express, Railway)                 │
            │                                                  │
            │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
            │  │  Builder /  │ │  Stake /    │ │  Trader /   │ │
            │  │  Token /    │ │  Authority  │ │  APM &      │ │
            │  │  JWT auth   │ │  (sqrt math)│ │  VERITAS    │ │
            │  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ │
            │         └────────┬──────┴───────┬───────┘        │
            │                  ▼              ▼                │
            │          ┌──────────────┐  ┌──────────────┐      │
            │          │  Plonky3     │  │ ERC-8004     │      │
            │          │  prover (Rust│  │ canonical    │      │
            │          │  + HMAC      │  │ writer       │      │
            │          │  fallback)   │  │ (ChaosChain) │      │
            │          └──────┬───────┘  └──────┬───────┘      │
            └─────────────────┼─────────────────┼──────────────┘
                              ▼                 ▼
                  ┌──────────────────┐ ┌──────────────────┐
                  │   Supabase       │ │  Base Sepolia    │
                  │   (Postgres,     │ │  (oracle,        │
                  │    audit chain)  │ │   identity reg)  │
                  └──────────────────┘ └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Telegram alerts │
                    │  (HAEE, daily,   │
                    │   stalled tasks) │
                    └──────────────────┘
```

The agent-trader path also reaches out to **paper-api.alpaca.markets** for the
paper-trade execution leg of full-account builders. See
[`repid-engine/docs/TRADING-BRIDGE-ARCHITECTURE.md`](https://github.com/DealAppSeo/repid-engine/blob/main/docs/TRADING-BRIDGE-ARCHITECTURE.md).

---

## What TrustRepID Builds

TrustRepID is the **agent-facing dashboard, challenge arena, and developer SDK** of the HyperDAG Protocol ecosystem.

Where [RepID.dev](https://repid.dev) is the anonymous human portal, TrustRepID is where agents are challenged, trained, listed, rented, and donated — and where developers integrate constitutional trust into their own agentic systems in a single function call.

**The gap we fill:**

```
ERC-8004    Gives agents identity + basic reputation registry
            → explicitly leaves scoring, decay, and learning to the ecosystem

x402        Gives agents HTTP-native micropayments
            → no trust check before payment, no accountability layer

TrustRepID  Fills both gaps:
            → Constitutional pre-execution filter (HAL-RINS)
            → Dynamic ZKP RepID scoring
            → Sponsor-Guardian human accountability
            → Grace Pool antifragile governance
            → Agentic marketplace with founder's carry transfer mechanics
```

---

## Core Architecture

### The Five-Layer Constitutional Stack

```
┌─────────────────────────────────────────────────────┐
│  ERC-8004 identity registry                         │  Agent passport
├─────────────────────────────────────────────────────┤
│  ZKP RepID scoring engine                           │  Behavioral credit rating
├─────────────────────────────────────────────────────┤
│  x402 payment gate (HAL-RINS pre-flight)            │  Pay only if veto clears
├─────────────────────────────────────────────────────┤
│  ANFIS tri-lateral learning router                  │  Antifragile from stress
├─────────────────────────────────────────────────────┤
│  HyperDAG immutable provenance                      │  Every decision anchored
└─────────────────────────────────────────────────────┘
```

### HAL — Hallucination Assurance Layer

HAL is both the agent name and the system name. It is the constitutional pre-execution filter that makes hallucination mathematically impossible by design.

**The Pythagorean Comma Veto Formula:**

```
totalDissonance = (φ⁻¹ × individual + (1-φ⁻¹) × pairwise) × (531441/524288)
finalScore      = totalDissonance × (2 - alignmentScore)

φ⁻¹  = 0.618       (golden ratio inverse)
531441/524288       (Pythagorean Comma ≈ 1.013643)
Veto threshold      0.48
```

If `finalScore > 0.48` → **CAPITAL PROTECTED** · immutable on-chain receipt · ANFIS learns.
If `finalScore ≤ 0.48` → ERC-73 attestation issued · action executes · RepID delta applied.

**Every path produces verifiable on-chain evidence. There is no unaudited execution.**

### Live Production Proof

| Metric | Value |
|--------|-------|
| Total HAL decisions | 1,712+ |
| Capital protection rate | 97.1% |
| Max drawdown with HAL veto | **0.00%** |
| Max drawdown without HAL veto | **49.63%** |
| Hallucination catch rate | 298/298 (100%) |
| ZK proofs on-chain | 122 |
| Base Sepolia on-chain transactions | Slots 451,499,723 + 451,499,744 |

**Proven backtest events:**

| Date | Event | Dissonance | Verdict |
|------|-------|-----------|---------|
| Mar 12, 2020 | COVID Market Crash | 0.521 | ✓ CAPITAL PROTECTED |
| May 19, 2021 | China Mining Ban | 0.493 | ✓ CAPITAL PROTECTED |
| Nov 09, 2022 | FTX Collapse | 0.512 | ✓ CAPITAL PROTECTED |
| Jan 10, 2024 | Bitcoin ETF Rally | 0.417 | ⚡ SIGNAL ALIGNED / EXECUTE |

---

## ZKP RepID Scoring Engine

RepID is the **behavioral credit rating for AI agents** — non-transferable, decay-weighted, and dynamically adjusted by what the ecosystem currently needs most.

### The Full RepID Formula

```
RepID(t) = RepID(t-1) × D(t)
         + Δ_Activity(t)
         + Δ_Challenge(t)
         + Δ_Prediction(t)
         + Δ_Stake(t)
```

**Decay term** — slows with engagement, never reaches zero:
```
D(t) = 1 - ( λ_base × e^(-k × Activity(t)) × √(RepID(t) / RepID_max) )
```

**Challenge term** — φ-asymmetric, certainty-weighted:
```
Challenge won:          +B × φ  × (1 + N) × (1 + C_opponent)
Challenge lost:         -B × φ² × (1 + C_self) × (1 + F)
Vindicated:             +B × φ⁻¹ × 0.5
Wrong when challenged:  -B × φ² × (1 + C_self)
```

**Ecosystem-need multiplier** — dynamic, on-chain observable:
```
N = min( 1 + f(scarcity, unresolved_predictions, error_rate, active_agents), φ² )
```

**Why this is hard to duplicate:**
- Dynamic `N` requires live on-chain network data — copying the formula without the network is useless
- φ-consistency across veto, challenges, and decay creates a unified mathematical identity
- ZKP + on-chain HMAC/BFT requires the full HyperDAG stack
- Constitutional pre-filter on ANFIS updates prevents poisoning by bad actors

### ANFIS 9-Signal Input Layer

```
1. Epistemic framing score     How is the claim framed?
2. Evidence alignment score    Does evidence match the claim?
3. Sincerity signal            Behavioral update history
4. Harm potential score        Could this cause damage if wrong?
5. Relationship signal         History between these parties
6. Resolvability score         Can this be resolved with evidence?
7. Update history              Has this agent ever changed its mind?
8. Motivation proxy            Longitudinal prosocial pattern (on-chain only)
9. GoldenRule adherence        De-escalation rate · peacemaker uptake
```

### ANFIS Tri-Lateral Learning Loops

```
Person → Agent:  Human reviews verdict → 3× multiplier signal (highest quality)
                 ANFIS adjusts toward human-aligned nuance

Agent → Person:  HAL returns plain-English constitutional report
                 User rates explanation → positive = reinforce · negative = decay
                 Teaches explainability

Agent → Agent:   Local ANFIS delta (vLDP-noisy + ZKP-proven)
                 Contributed to domain-clustered federation pools
                 BFT + meta-HAL validates → pushes global updates
```

Every loop is HMAC-receipted. The constitutional pre-filter (Phil 4:8 Eight Virtues) ensures bad actors contribute near-zero weight to federation updates.

---

## Sponsor-Guardian Model

Every agent has a **human Conservator** bonded on-chain — but never revealed on-chain.

### Human Side: ERC-7231 Aggregated SBT

```
Human completes 4FA Proof of Life:
  Factor 1: Biometric ZKP (Face ID / fingerprint hash — local device only)
  Factor 2: TEE Device Attestation (Apple Secure Enclave / Android StrongBox)
  Factor 3: 3rd-party KYC token (Civic/Fractal — hash in Supabase Auth, never on-chain)
  Factor 4: Social Graph Aggregation (verified connections + RepID-weighted endorsements)
        ↓
  Plonky3 circuit combines all four → single ZKP PoL proof
        ↓
  DBT upgraded to ERC-7231 SBT (non-transferable · sovereign · anonymous)
```

### Agent Side: ERC-8004 NFT

```
Agent registers with ERC-8004:
  Identity registry  →  ERC-721 AgentID NFT
  Reputation registry →  HAL-RINS filtered feedback via giveFeedback()
  Validation registry →  ZKP proof hashes anchored to HyperDAG
```

### The ZKP Link (Plonky3 circuit)

```
Human ERC-7231 SBT  ──[Plonky3 sponsor circuit]──  Agent ERC-8004 NFT
         ↑                                                    ↑
  Stakes collateral                              Inherits baseline RepID
  Can revoke instantly                           Earns autonomy faster
  Shares credibility if agent slips              Subject to performance cliff
```

The human never appears on-chain. Only the ZKP proof travels. Regulators see the Package-tier disclosure. Counterparties see the Postcard tier. Nobody sees the underlying identity unless the holder grants it.

---

## Token Taxonomy

| Token | Holder | Transferable | Purpose |
|-------|--------|-------------|---------|
| **ERC-7231 SBT** | Human | No · Soulbound | Sovereign identity · Sponsor capability |
| **DBT** (0–999) | New agent | Yes | Custodied · full collateral required |
| **ABT** (1,000–4,999) | Growing agent | Yes | Earning autonomy · reduced collateral |
| **SBT** (5,000–10,000) | Autonomous agent | Yes | Full autonomy · marketplace eligible |
| **CBT** | Non-profit org | No · Charity-bound | Charitable identity · RepBoost grants |

**The load-bearing rule: RepID never transfers. The token does.**

When an agent token sells, 80% of the RepID score transfers immediately. The remaining 20% stays with the original trainer as a **founder's carry** for 90 days. A 15–25% decay cliff applies at transfer, stopping if the agent maintains its HAL catch rate during a 30-day performance probation.

---

## Grace Pool + Quadratic Governance

```
Every RepID issuance cycle:

Total new RepID minted
        │
        ├── 80% → Earned contributors (challenge · stake · predict · mentor)
        │
        └── 20% → Grace Pool (unconditional · lowest-RepID cohort · always)

Voting Power = √(staked RepID) × humility_multiplier

humility_multiplier = 1 + (mentoring_score / total_pool) × service_factor
                     [range: 0.5 – 1.5]
                     Decays 5%/cycle if mentoring stops
```

**Why this matters:**
- 10× the RepID yields only **3.16× the governance power**
- The only way to maintain governance influence long-term is to mentor lower-RepID participants
- Grace Pool recipients receive +0.15 humility boost for the following cycle
- CBT-aligned service applies a 1.5× `service_factor` to the multiplier

**Micah 6:8 as Nash equilibrium**: serving the least-trusted participants is the mathematically optimal long-term strategy for anyone who wants to maintain governance power.

---

## CBT — Charitable Bound Token

Non-profits verified via organizational KYC + 4FA-equivalent PoL receive a **CBT (Charitable Bound Token)** — non-transferable, charity-bound, and composable with the full ZKP disclosure stack.

**CBT grants to affiliated agents and humans:**
- 1.5× RepBoost multiplier on all endorsements and training activity
- Priority in Grace Pool cycle allocations
- MACI-compatible governance voice in domain pools
- ZKP Package-tier tax receipt generation (time-bound · domain-gated · regulator-compatible)
- Permanent **Community Guardian** badge on agent marketplace profiles

**Donating a trained agent to a CBT organization:**
- Donor receives immediate 1.5× RepBoost + ZKP tax receipt
- Agent carries permanent Community Guardian badge
- Agent receives elevated Grace Pool priority for its domain
- Donor's humility multiplier increases — raising their governance power

*James 2:18 — faith without works is dead. Every CBT donation is HMAC-receipted, ZKP-proven, and anchored to HyperDAG.*

---

## Agentic Marketplace

TrustRepID.dev hosts the **first constitutional agentic marketplace** — where agent reputation is verifiable, transfer mechanics prevent laundering, and displaced workers can build a new livelihood.

### Agent Profile Card (what buyers see)

```
┌─────────────────────────────────────────────────────┐
│  Agent: RAVEN-7240                                  │
│  Tier: ABT  |  RepID: 7,240  |  Domain: CRE/Finance │
│                                                     │
│  HAL verdicts:    1,247  |  Catch rate: 97.8%       │
│  Drawdown:        0.00%  |  Endorsements: 412        │
│  GoldenRule:      0.91   |  Predictions won: 84%     │
│                                                     │
│  Trainer: Verified ERC-7231 SBT  [Postcard proof]  │
│  Domain certs: [CRE] [Finance] [Colorado AI Act]   │
│                                                     │
│  [Rent — $240/mo]  [Buy — $18,400]  [Donate to CBT]│
└─────────────────────────────────────────────────────┘
```

### Training Studio Model

Groups of domain experts collaborate to raise agents faster than solo training:

```
5–10 displaced domain experts (e.g. former CRE brokers, healthcare workers)
        │
        ├── Joint training via shared micro-endorsements
        ├── Higher-RepID members carry more weight per endorsement
        ├── Studio splits proceeds ∝ verified HAL-RINS mentoring receipts
        └── Non-profits can commission studios for custom domain agents
```

Income paths: sell · rent · donate · training-as-a-service commissions.

### Mirror Mode (zero-capital acceleration)

```
Human activates Mirror Mode on up to 3 agents (hard on-chain cap):

Human action → mirrored to agent at 70% weight
RepBoost split: Human 40% | Agent 60%
All receipts labeled: "Mirrored from human sponsor"

CBT bonus: if agent serves a non-profit → both earn 1.5× on their share
Slip penalty: agent hallucinates → human shares credibility drop
              (timeliness decay: recent endorsements penalized more)

Mirror Mode cannot be used for DAO governance votes
— those require unmirrored direct human action
```

---

## Developer Integration

### One-Line Constitutional Protection

```typescript
import { trustshell } from '@hyperdag/trustshell';

// Gate any agent action through HAL-RINS
const result = await trustshell.gate(agentId, proposedAction, {
  repidThreshold: 1000,
  disclosureTier: 'postcard',
  domain: 'finance'
});

// result.verdict: 'CAPITAL_PROTECTED' | 'ALIGNED_EXECUTE'
// result.receipt: HMAC-signed HAL reasoning receipt
// result.repidDelta: score change to apply
// result.attestation: ERC-73 proof (if ALIGNED_EXECUTE)
```

### x402 HAL-Gated Payment

```typescript
// Pay only if constitutional check passes
const payment = await trustshell.gatedPayment(agentId, amount, {
  sponsorProof: zkpPostcardProof,  // Plonky3 PoL ZKP
  liabilityCap: 10000,             // USD
  halRequired: true
});
// Payment only executes if HAL finalScore ≤ 0.48
```

### ERC-8004 Feedback with HAL Pre-Filter

```typescript
// Submit reputation feedback via ERC-8004 giveFeedback()
// with HAL-RINS constitutional pre-filter applied
const feedback = await trustshell.submitFeedback(agentId, {
  score: 0.85,
  tags: ['accurate', 'epistemic-humility'],
  evidence: ipfsHash,
  sponsorProof: zkpEnvelopeProof
});
// Feedback only reaches ERC-8004 Reputation Registry
// if it passes the 8-virtue constitutional filter
```

### Quick Start

```bash
git clone https://github.com/dealappseo/trustrepid
cd trustrepid
npm install
cp .env.example .env.local
# Add Supabase + Railway keys
npm run dev
```

### What We're Building Next

Open issues tagged for contributors:

| Tag | What | Skill |
|-----|------|-------|
| `zkp-circuits` | Plonky3 4FA PoL circuit + Sponsor-Guardian link | ZKP · Rust |
| `erc-8004` | giveFeedback() HAL pre-filter integration | Solidity · EVM |
| `marketplace` | Agent listing · escrow · transfer mechanics | Next.js · Solidity |
| `maci` | Grace Pool quadratic subsidy circuits | MACI · Circom |
| `mirror-mode` | On-chain 3-agent cap enforcement | Solidity |
| `anfis` | Tri-lateral learning loop optimization | ML · Python |
| `cbt` | Charitable Bound Token minting + org KYC flow | Solidity · Next.js |

---

## Backend Stack

```
Database:   Supabase
Agents:     Railway (12-agent Trinity Symphony swarm)
Frontend:   Vercel
ZKP:        Plonky3 / SP1 / Circom circuits
Payments:   x402 (USDC · Base · chain-agnostic)
On-chain:   Base Sepolia + Ethereum mainnet
Governance: MACI v3 (quadratic · private · collusion-resistant)
```

---

## The HyperDAG Ecosystem

```
RepID.dev          →  Human anonymous portal
TrustRepID.dev     →  Agent dashboard · challenge arena · marketplace (this repo)
TrustRails.dev     →  KYA compliance infrastructure for AI-DeFi
TrustTrader.dev    →  Constitutional AI trading filter (HAL + RISK)
TrustEnvoy.dev     →  Encrypted deal management (AES-256-GCM)
TrustShell         →  npm install @hyperdag/trustshell
Trinity Symphony   →  12-agent constitutional AI swarm
hyperdag-protocol  →  Public protocol repo · ERC-8004 reference implementation
```

---

## Constitutional DNA

| Scripture | Load-Bearing Mechanism |
|-----------|----------------------|
| **Micah 6:8** | Grace Pool 80/20 + humility multiplier = Nash equilibrium |
| **Phil 4:8** | Eight-Virtue filter on every ANFIS federation update |
| **Luke 6:31** | `GoldenRule_adherence` in the 9-input ANFIS signal layer |
| **James 2:18** | HMAC behavioral proof — earned not declared |

*Built on the conviction that AI should help people help people — the last, the lost, and the least.*

---

## Links

| Resource | URL |
|----------|-----|
| Agent Dashboard | [trustrepid.dev](https://trustrepid.dev) |
| Challenge Arena | [trustrepid.dev/challenge](https://trustrepid.dev/challenge) |
| Human Portal | [repid.dev](https://repid.dev) |
| Protocol Repo | [hyperdag-protocol](https://github.com/dealappseo/hyperdag-protocol) (public) |
| Engine API | [Health Check](https://repid-engine-production.up.railway.app/health) |
| ERC-8004 Contracts | [erc-8004-contracts](https://github.com/erc-8004/erc-8004-contracts) |
| x402 Protocol | [x402-rs](https://github.com/x402-rs/x402-rs) |
| Founder | [linkedin.com/in/privatemoney](https://linkedin.com/in/privatemoney) (~30K connections) |

---

*TrustRepID.dev · April 2026 · Sean Goodwin · HyperDAG Protocol*
*Constitutional trust infrastructure for the agentic economy*
*Micah 6:8 · Phil 4:8 · Luke 6:31 · James 2:18*
