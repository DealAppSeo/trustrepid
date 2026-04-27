# Demo tour v2 — the five working flows

This is the consolidated entry doc for evaluators. Five demo pages,
each backed by a real public endpoint, each with a curl command anyone
can run independently.

---

## Browser URLs

| Tile | Page |
|---|---|
| 1. Fleet status | `/fleet-status/` |
| 2. SBT mint | `/sbt-mint/` |
| 3. RepID prover | `/repid-prover/` |
| 4. Audit chain | `/audit-chain/` |
| 5. Reponomics two-builder | `/reponomics-demo/` |
| Tour landing | `/demo-tour-v2/` |

The reponomics tour is paired with `/reponomics-explainer/` (5-section
walkthrough) and the model doc `docs/REPONOMICS-MODEL.md` for evaluators
who want the full math.

## Curl examples

Replace `$ENGINE` with the deployed URL.

```bash
ENGINE=https://repid-engine-production.up.railway.app

# Fleet
curl -s "$ENGINE/api/v1/fleet/status" | jq '.fleet_size, .fully_discoverable'

# SBT (mock)
curl -s "$ENGINE/api/v1/sbt/challenge?holder=0x71be63f3384f5fb98995898a86b02fb289d76570" | jq

# RepID threshold proof (HMAC stub)
curl -s -X POST "$ENGINE/api/v1/repid/prove-threshold" \
  -H 'content-type: application/json' \
  -d '{"holder":"0x71be63f3384f5fb98995898a86b02fb289d76570","threshold":0}' | jq

# Audit chain stats
curl -s "$ENGINE/api/v1/audit-chain/stats" | jq

# Reponomics — two-builder snapshot
curl -s "$ENGINE/api/v1/demo/two-builder/snapshot" | jq '.crossover, .builder_w.authority, .builder_m.authority'

# Reponomics — bootstrap a snapshot point (so the chart has data)
curl -s -X POST "$ENGINE/api/v1/demo/two-builder/bootstrap" | jq

# Reponomics — start a trading round (gated by Sean signature header)
SEAN_SIG=$(echo -n 'start-trading-round' | openssl dgst -sha256 -hmac "$SEAN_SIG_SECRET" | awk '{print $2}')
curl -s -X POST "$ENGINE/api/v1/trader/round/start" \
  -H "X-SEAN-SIGNATURE: $SEAN_SIG" \
  | jq

# Reponomics — resolve any open rounds whose oracle window has elapsed
curl -s -X POST "$ENGINE/api/v1/trader/round/resolve-open" \
  -H "X-SEAN-SIGNATURE: $SEAN_SIG" \
  -H 'content-type: application/json' \
  -d '{"force": true}' | jq
```

## What's mock vs real

See `docs/REPONOMICS-MODEL.md` §0 and `docs/DEVELOPER-QUICKSTART.md`
maturity table. Every endpoint that wraps a mock body emits an
explicit `is_simulated: true` indicator (or `mock_proof: true` for
threshold proofs).

## Migration deploy order

When merging the reponomics branch and migrating Supabase, apply in
order:

```
20260427_add_builder_registry.sql
20260427_add_stake_vault.sql
20260427_add_wisdom_character_scores.sql
20260427_add_linked_bets.sql                 -- includes apply_linked_bet_resolution PL/pgSQL function
20260427_seed_two_builder_demo.sql           -- bumps APM + VERITAS, creates Builder W/M, 5 sybils
```

Plus the prior sprints' pending migrations:

```
20260426_fleet_registration_columns.sql      -- fleet sprint
20260427_add_sbt_mint_events.sql             -- e2e demo sprint
```

## Verifying the reponomics demo end-to-end

1. Apply migrations.
2. `POST /api/v1/demo/two-builder/bootstrap` — seeds a snapshot row so
   the chart has data.
3. `GET /api/v1/demo/two-builder/snapshot` — confirm Builder M's
   authority exceeds Builder W's. The crossover assertion is the
   reponomics claim.
4. `POST /api/v1/trader/round/start` (with Sean signature header) —
   APM and VERITAS each place a bet against an oracle-mocked NBA
   outcome.
5. Wait for `expected_resolution` window to elapse, then
   `POST /api/v1/trader/round/resolve-open --force`.
6. `GET /api/v1/audit-chain/recent` — see `bet_placed`,
   `bet_resolved`, `wisdom_update`, `character_update`,
   `builder_repid_recompute`, `stake_deposit` events in chain order.
7. `GET /api/v1/demo/two-builder/snapshot` again — Builder W's
   wisdom/character should be drifting based on outcomes.
8. Repeat (4)–(7) several times; eventually Builder W's sybils drift
   into ghost-cohort territory and the floor enforcement triggers
   visibly.

## What this demo deliberately does NOT promise

- Real on-chain x402 settlement (gated by `X402_REAL_RPC=true`).
- Real Plonky3 trade-auth proofs (Gemini's hyperdag-core sprint
  ships those; until then, HMAC stub).
- Real sports oracle (deterministic mock; resolveOpenRounds with
  `force: true` lets you test without waiting for a real game).
- Multi-tenancy (single-Sean-deployer for v0.1; v1 onboarding is a
  separate sprint).
