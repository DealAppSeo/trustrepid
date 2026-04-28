# Reponomics live demo (v0.1)

A 60-second, no-wallet demo where a visitor watches two real fleet
agents (APM and VERITAS) trade with reputation-staked authority. Built
for Marco / Vitto / Leonard / public devs to evaluate without setting
anything up.

URL: `/reponomics-live/`
Source: `trustrepid/public/reponomics-live/index.html` + endpoints in
`repid-engine/src/services/{anonymous-signup,anonymous-round-runner}.ts`.

---

## Visitor flow

Five steps, each enables the next.

1. **Create demo token** — `POST /api/v1/builder/token-signup`. Server
   generates a 32-byte random token, derives a deterministic demo
   address `0xT0KEN<hash34>`, inserts a `builders` row with
   `auth_method='token_only'` and `earns_repid_rewards=false`. The
   visible `0xT0KEN` prefix makes it impossible to confuse with a real
   EVM wallet.
2. **Stake 100 testnet USDC** — `POST /api/v1/stake/deposit` with
   `{ builder_address, amount: 100000000 }`. Recorded in
   `stake_deposits`, simulated `tx_hash`, immediately snapshots the
   builder's authority via `stake_authority_snapshots`.
3. **Run a live trading round** — `POST /api/v1/demo/run-round-anonymous`.
   Server-side composition: `startTradingRound()` (APM and VERITAS
   each place a linked bet against the daily-mock NBA outcome) → 2s
   wait → `resolveOpenRounds({force: true})` (force-resolves so the
   visitor doesn't wait 4 hours) → returns both agents' RepID
   before/after with deltas + the audit-chain rows emitted during
   the round.
4. **Watch RepID update** — page polls `GET /api/v1/demo/two-builder/snapshot`
   every 2 seconds for 30 seconds, animating any RepID changes (green
   flash on increase, red on decrease). The bottom panel shows the
   audit-chain ticker live (every 5s from `/audit-chain/recent`).
5. **Share** — Twitter intent URL with the demo link prefilled.

## Architecture

```
                               POST /api/v1/builder/token-signup
[visitor browser] ───► /api/v1/...  ───► repid-engine (Express)
       │                                     │
       │                                     ├── createAnonymousBuilder()
       │                                     │   └── INSERT builders (auth_method=token_only)
       │                                     │
       │                                     ├── depositStake()
       │                                     │   └── INSERT stake_deposits + snapshotAuthority()
       │                                     │
       │                                     ├── runRoundAnonymous()
       │                                     │   ├── snapshot APM/VERITAS BEFORE
       │                                     │   ├── startTradingRound() — server-side, no Sean-sig needed
       │                                     │   ├── 2s wait
       │                                     │   ├── resolveOpenRounds({force:true})
       │                                     │   ├── snapshot APM/VERITAS AFTER
       │                                     │   └── emit demo_anonymous_round_completed
       │                                     │
       │                                     └── getTwoBuilderSnapshot() (poll target)
       │
       └── poll /api/v1/audit-chain/recent every 5s
```

The anonymous-round-runner is the load-bearing piece. It internally
calls `startTradingRound()` (which is gated by Sean-signature when
called via the public route) without needing the secret — the server
holds the gate; the visitor doesn't have to.

## What's real vs simulated

| Component | Status | Note |
|---|---|---|
| Token signup + builder row insert | **REAL** | Real Supabase write under `builders` |
| Stake deposit (off-chain ledger entry) | **REAL** | `stake_deposits` row with `is_simulated=true`. No on-chain USDC moves. |
| Authority computation (quadratic √stake × R × W × C) | **REAL** | Matches `computeAuthority` math exactly. |
| Trading round placement (linked_bets rows) | **REAL** | `bet_placed` audit event for both agents. |
| Plonky3 trade-auth proof | **HMAC stub** | `plonky3-bridge.ts` wraps the existing stub. Real circuit lands when Gemini's hyperdag-core branch merges. |
| Oracle outcome | **SIMULATED** | Deterministic per game id; `force:true` resolves immediately. |
| Linked bet resolution + atomic settlement | **REAL** | `apply_linked_bet_resolution` PL/pgSQL function + `chk_linked_bets_sign` CHECK constraint. |
| RepID / Wisdom / Character updates | **REAL** | `repid_score_events` written; `repid_agents.current_repid` updated atomically. |
| Builder repid recompute (ghost cohort decay) | **REAL** | Happens on every bet resolution. |
| Audit chain rows | **REAL** | Hash-chained in `hal_audit_chain`. Verifiable via `/api/v1/audit-chain/verify`. |
| Twitter share link | **REAL** | Standard `twitter.com/intent/tweet` URL. |

Per CLAUDE-RULE-4: every endpoint that wraps a simulated body returns
`is_simulated: true` (or `mock_proof: true` for threshold proofs).
The live demo's run-round-anonymous response carries this field; the
demo page surfaces it in the result panel.

## Privacy and security notes

- Token-only builders cannot earn RepID rewards (`earns_repid_rewards=false`).
  This prevents demo users from accruing real reputation that should
  belong to wallet-bound identities.
- The `0xT0KEN` address prefix is intentionally NOT a valid EVM
  checksum address. No real user can mistake it for their wallet.
- `session_token` is stored server-side. The visitor's browser only
  needs to keep the token for the duration of the demo session;
  there's no requirement to persist it. (A future "resume your demo"
  feature would let visitors paste the token back in, via
  `getBuilderByToken(token)`.)
- All POST endpoints pass through the existing SQL-keyword body
  sanitizer in `src/index.ts`. The demo page submits no free-form
  prose, so the sanitizer never trips.

## Out of scope

Per the sprint spec, NOT shipped in this iteration:

- Alpaca / Kraken integration (real trading venues)
- ERC-7231 minting (the upgrade path that would re-enable RepID rewards)
- Real agent creation flow (visitors can't spawn their own APM/VERITAS analogue yet)
- Email-based full account signup
- "Notify me when complete" reminders
- Real on-chain ERC-8004 RepID writes (Gemini's hyperdag-core sprint
  ships these; until then the engine's RepID writes are off-chain)

## Verifying the live demo end-to-end

```bash
ENGINE=https://repid-engine-production.up.railway.app

# 1. Create a demo token
TOKEN_JSON=$(curl -s -X POST "$ENGINE/api/v1/builder/token-signup")
echo "$TOKEN_JSON" | jq

# 2. Stake 100 USDC against the new builder address
ADDRESS=$(echo "$TOKEN_JSON" | jq -r .builder_address)
curl -s -X POST "$ENGINE/api/v1/stake/deposit" \
  -H 'content-type: application/json' \
  -d "{\"builder_address\":\"$ADDRESS\",\"amount\":\"100000000\"}" | jq

# 3. Run a round (no Sean signature required)
curl -s -X POST "$ENGINE/api/v1/demo/run-round-anonymous" \
  -H 'content-type: application/json' \
  -d '{}' | jq

# 4. See the audit chain catch up
curl -s "$ENGINE/api/v1/audit-chain/recent?limit=20" | jq '.entries[] | {id, event_type: .event_type}'
```

Each step is independently reproducible. Marco / Vitto / Leonard can
copy these commands into a terminal and watch the responses without
visiting the page.

## Browser test plan

1. Open `https://trustrepid.dev/reponomics-live/` (or whatever Sean
   deploys).
2. Click "Create demo token" → token + address appear.
3. Click "Stake 100 USDC" → stake total + authority shown.
4. Click "Run round" → round_id + audit_entries count.
5. Watch APM and VERITAS cards animate (green/red flash) as the
   snapshot poller picks up the new RepID values.
6. Audit ticker at the bottom should show ~5-7 new event rows in
   under 10 seconds (round_started, bet_placed×2, bet_resolved×2,
   wisdom_update, character_update).
7. Step 5 lights up after 30s with a Twitter share link.

If any step fails, the page surfaces the error inline and the auth-bypass
allowlist + Phase 1 Railway deploy may need to be re-verified.
