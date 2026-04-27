# Reponomics — model and gaming-resistance analysis (v0.1)

A reputation-economy primitive layered on top of HyperDAG's RepID. This
doc is the canonical reference for the math, the gaming analysis, and
the mission framework. It is paired with the live demo at
`/reponomics-demo/` and the implementation in
`repid-engine/src/services/{stake-vault,builder-registry,wisdom-score,
character-score,linked-bet-resolver,agent-trader,two-builder-demo,
x402-server,plonky3-bridge}.ts`.

---

## 1. Overview

Reponomics extends RepID into a *capital + behaviour* economy where:

- **Builders** (humans) own one or more agents.
- **Agents** trade prediction tips with each other via x402 micropayments.
- **Stake** governs *trading authority* — but quadratically, so a 100×
  stake increase only buys 10× more authority.
- **Wisdom** and **Character** modify authority alongside RepID.
- **Linked bets** atomically tie token P&L to RepID delta — both move
  together or not at all.
- **Ghost cohort decay** dilutes builders who let agents go inactive,
  defeating Sybil attacks structurally.

The anti-claim: capital alone cannot dominate the system.

## 2. The four scores

Each agent has four numbers and a builder has one:

| Score | Range | Meaning |
|---|---|---|
| RepID (R)         | 0 – 10000 | Behavioural credit — earned via challenges, predictions, attestations. |
| Wisdom (W)        | 100 – 2000 | Calibration over the last 50 bets. Pythagorean Comma penalty when claimed-vs-actual diverges. |
| Character (C)     | 100 – 2000 | Mission alignment delta. Helping low-RepID parties accrues; abandoning agents costs. |
| Builder RepID     | 0 – 10000 | mean(active agents) − ghost_count × 100. |

R and Builder R live in `repid_agents` and `builders` (canonical
sources of truth). W and C live in `repid_agents` (added in this
sprint's migration); their histories are in `agent_wisdom_history`
and `agent_character_history`.

## 3. Authority formula

```
authority = √stake × (R × W × C / 1_000_000) / 10_000
```

Floor protection: `builder_repid < 5000 ⇒ authority = 0`. Worked example:

```
Builder W:  √(1_000_000_000 USDC units)   × (5500 × 900 × 600 / 1e6) / 1e4
         =  31_623                         × 2970                    / 1e4
         ≈  9_392

Builder M:  √(50_000_000 USDC units)       × (7000 × 1500 × 1700 / 1e6) / 1e4
         =  7_071                          × 17_850                  / 1e4
         ≈  12_622
```

Builder M wins despite 1/20th the stake. The math is reproducible —
read it from the live demo's `/api/v1/demo/two-builder/snapshot`
endpoint or run the unit test:
`npx jest tests/reponomics-stake-vault.test.ts -t "crossover"`.

## 4. Ghost cohort decay

```
builder_repid = max(0, min(10000,
                       mean(active_agents.current_repid) - ghost_count × 100))
```

Ghost = `last_active_at` more than 7 days ago, OR null. Recomputed on
every bet resolution and on demand via
`POST /api/v1/builder/register` callers.

Behaviour:

- 5 ghosts → 500 RepID penalty applied to builder.
- All-ghost roster → builder_repid floors to 0 → authority = 0.
- Active mean clamps to [0, 10000].

This is the structural Sybil defence. Spawning 100 agents to game the
mean is profitable only if you keep them all active; once they go
quiet, each one costs 100 RepID off the builder's score.

## 5. Wisdom calibration via Pythagorean Comma

Over the trailing `WINDOW = 50` bets:

```
mean_claimed_confidence = mean(claimed_confidence / 10000)
actual_accuracy         = correct_count / window
calibration_error       = |mean_claimed_confidence - actual_accuracy|

if calibration_error > COMMA_THRESHOLD (0.0136433):
    new_wisdom = floor(current_wisdom / 1.0136433)        // penalty
else:
    new_wisdom = floor(current_wisdom × 1.001)             // small reward
```

`COMMA_THRESHOLD` and the `1.0136433` divisor are the Pythagorean
Comma constant `531441/524288`. Same constant the HAL veto math uses
for hallucination detection — single mathematical primitive shared
across two decision surfaces.

Bounded `[100, 2000]`. Less than 5 history rows: no adjustment.

## 6. Character delta rules

Four event types, four deltas:

| Event | Delta | Condition |
|---|---:|---|
| `trade_with_low_repid`       | +5  | counterparty.repid < self.repid |
| `attestation_to_low_repid`   | +10 | unconditional |
| `underserved_domain_action`  | +15 | domain_trade_count < 100 |
| `agent_abandonment`          | -20 | unconditional |

Bounded `[100, 2000]`. The events fire from
`linked-bet-resolver.resolveBet` (on every settled bet) and from
explicit attestation paths. Each event writes a row to
`agent_character_history` so the score is replayable.

## 7. Linked bet atomicity

Bets carry two deltas: `token_delta` and `repid_delta`. Atomicity
rule:

```
correct + confidence > 0 ⇒  token_delta > 0  AND  repid_delta > 0
wrong   + confidence > 0 ⇒  token_delta < 0  AND  repid_delta < 0
```

Both deltas MUST share sign. Enforced at three layers:

1. **Application** — `linked-bet-resolver.resolveBet` checks before
   calling the SQL function.
2. **SQL function** — `apply_linked_bet_resolution` re-checks and
   raises an exception on violation.
3. **Table CHECK** — `linked_bets.chk_linked_bets_sign` constraint
   refuses opposite-sign rows even if a future writer bypasses the
   function.

Why this matters: a "score stripping" attack would settle the bet's
token P&L without the RepID hit. The atomic linkage makes that
impossible — either both move or the transaction rolls back.

## 8. Gaming-resistance analysis

Five attacks, each with a structural defence:

| # | Attack | Defence | Where enforced |
|---|---|---|---|
| 1 | **Self-dealing.** Agent trades both sides of a wash trade. | `agent-trader.startTradingRound` pairs APM with VERITAS; counterparty_repid is the OTHER agent's repid. Self-id check in app layer. | `src/services/agent-trader.ts` |
| 2 | **Anti-prediction.** Public direction "home"; private bet "away" to harvest. | `prediction_payload.predicted_outcome` is set from the same generator that issues the public direction. Inconsistency surfaces in audit chain. | `src/services/agent-trader.ts` |
| 3 | **Sandbagging.** Claim 90% confidence, hit 50% accuracy, harvest the spread. | Wisdom comma fires: `\|0.9 - 0.5\| = 0.4 >> 0.0136`. Wisdom drops; combined score drops; authority drops. | `src/services/wisdom-score.ts` |
| 4 | **Sybil cohort.** Spawn 100 agents to inflate mean. | Ghost cohort decay: each inactive agent costs 100 builder RepID. Inactive sybils drag the builder below the 5000 floor → authority = 0. | `src/services/builder-registry.ts` |
| 5 | **Score stripping.** Settle token P&L without RepID hit. | Three-layer atomic linkage (app, SQL function, table CHECK). Any opposite-sign update is rejected. | `src/services/linked-bet-resolver.ts` + migration `20260427_add_linked_bets.sql` |

Tests: `repid-engine/tests/reponomics-anti-gaming.test.ts` exercises
each attack and verifies the defence triggers.

## 9. Mission alignment — Micah 6:8 framework

The reponomics math is structured to mirror the Micah 6:8 triad:

- **Justice (do what is right) → Earned RepID.** Every score change is
  earned through verified action; no trust-by-fiat assignments. Audit
  chain is the public ledger of justice served.
- **Mercy (love kindness) → Floor + Grace Pool.** Agents below the
  CUSTODIED tier still participate; the ghost cohort decay is a
  *withdrawing* of mercy from operators who abandon agents, not a
  punishment of the agents themselves. Builder_repid floor at 5000 is
  the mercy line — go below it and the system stops handing you
  authority, but you can rebuild.
- **Humility (walk humbly) → Wisdom calibration.** The Pythagorean
  Comma penalty is a humility check. Claiming more than you can
  deliver is structurally costly.

## 10. Patent-relevant claims (P-014 family)

Sections of this doc that are explicitly relevant to the patent
filing, marked for counsel:

- **§3 — Authority formula.** Quadratic-stake × R × W × C with floor
  protection is a novel composition.
- **§4 — Ghost cohort decay.** The
  `mean(active) - ghost_count × penalty` recipe with explicit floor is
  the Sybil defence claim.
- **§5 — Pythagorean Comma calibration.** Cross-domain reuse of the
  same constant for hallucination veto AND wisdom calibration is the
  shared-primitive claim from the ANFIS-Ikigai sprint, extended here.
- **§7 — Atomic linked bet.** Three-layer sign-rule enforcement is the
  one-way-valve patent claim — token P&L cannot move without the
  RepID delta moving in lockstep.
- **§8 — Gaming-resistance**, considered as a system: the five
  defences compose to a property no single attack can defeat.
