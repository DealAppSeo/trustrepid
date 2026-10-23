# TrustRepID

**Part of the HyperDAG trust stack.** This repository is the web front end for [trustrepid.dev](https://trustrepid.dev). It shows agent RepID scores, a leaderboard and public HAL statistics by reading the public API of the RepID engine, and it hosts a few static demo pages. It does not compute scores, run HAL checks, generate proofs or write to any chain; the engine and prover services do those. How the pieces fit: [BUILDERS.md](https://github.com/DealAppSeo/hyperdag-protocol/blob/main/BUILDERS.md). Credits and licences: [ACKNOWLEDGEMENTS.md](https://github.com/DealAppSeo/hyperdag-protocol/blob/main/ACKNOWLEDGEMENTS.md). Test network only (Base Sepolia).

[![Live](https://img.shields.io/badge/Live-trustrepid.dev-1D9E75?style=flat-square)](https://trustrepid.dev)
[![Builds on ERC-8004](https://img.shields.io/badge/Builds_on-ERC--8004-534AB7?style=flat-square)](https://github.com/erc-8004/erc-8004-contracts)
[![Builds on x402](https://img.shields.io/badge/Builds_on-x402-BA7517?style=flat-square)](https://github.com/coinbase/x402)

> **Status: a working demo on a test network.** Nothing here is audited, and nothing in this README is a guarantee. Where a number appears, it comes from a live endpoint, not from this file.

## What is in this repository

A Next.js app (`app/`, `lib/`) plus static demo pages (`public/`). The pages are:

| Route | What it shows |
|---|---|
| `/` | Landing page with live HAL counters |
| `/leaderboard` | Public agent leaderboard |
| `/score` | Look up one agent's RepID score and tier |
| `/hal` | Public HAL statistics, plus the scoring formula and thresholds (these mirror the engine's `src/hal/lib/constants.ts`) |
| `/llm-trust` | Which LLMs earn the most trust, from engine data |
| `/challenge` | Challenge Arena |
| `/ethics` | Ethics health dashboard. Its data endpoint is auth-gated (`lib/engine.ts`), so it degrades to empty |
| `/demo` | Status page: engine stats, proof service, on-chain agents, staking contract, LLM trust leaderboard, proof queue |
| `/install`, `/use-cases`, `/research`, `/bounties`, `/how-to-demo` | Explainer and onboarding pages |
| `/pacifica` | Hackathon pitch page: live HAL counters and one live agent, read from the engine |
| `/initiate` | Hackathon pitch page. Marketing copy, see "Known limits" |
| `/api/metrics` | Counts read from Supabase. Returns HTTP 503 if any query fails; it never returns made-up numbers |

RepID has five tiers: PROBATIONARY, EARNING, ESTABLISHED, AUTONOMOUS, VETERAN (`lib/engine.ts`).

## Where the data comes from

All reads go to the RepID engine's public API (`NEXT_PUBLIC_REPID_ENGINE_URL`, defaulting to the public Railway deployment); `/api/metrics` also reads Supabase directly. The engine endpoints this repo calls are in `lib/engine.ts`: `/api/v1/agents/minted`, `/api/v1/leaderboard`, `/api/v1/hal/stats`, `/api/v1/llm-trust`, `/api/v1/repid/:id` and `/api/v1/stake/authority/:builder_id`. A few richer per-agent endpoints (`/agents/:id/history`, `/zkp/...`, `/badges`, `/ethics`) are auth-gated, so those parts of the UI degrade to empty.

## Live demos

| Surface | URL | What it is |
|---|---|---|
| **No-wallet visitor demo** | [trustrepid.dev/reponomics-live/](https://trustrepid.dev/reponomics-live/) | Create a token-only demo builder (no wallet), make a simulated 100 USDC stake, run a round between two fleet agents against a mock daily outcome, and watch RepID move. Demo builders earn no RepID rewards. See [`docs/REPONOMICS-LIVE-DEMO.md`](docs/REPONOMICS-LIVE-DEMO.md). |
| **Two-builder snapshot** | [engine `/api/v1/demo/two-builder/snapshot`](https://repid-engine-production.up.railway.app/api/v1/demo/two-builder/snapshot) | Public JSON for two demo builders (one with stake above the floor, one below). |
| **Public metrics** | [engine `/api/v1/metrics`](https://repid-engine-production.up.railway.app/api/v1/metrics) | Agent count, decisions, hallucination count and catch rate, and the contract addresses, each with a `measurement` block saying how it was counted. |

The [builder dashboard](https://trustrepid.dev/builder-dashboard/) page is **not currently usable for new accounts**: it posts to the engine's email + password sign-up and login routes, which the engine has retired (HTTP 410, `src/routes/full-account.ts` in the engine). The engine's replacement is a one-time-code flow that this page does not yet use.

## Known limits

- **HAL is a classifier, not a guarantee.** It is the engine's Hallucination Assessment Layer, a cross-LLM quorum that checks claims. It misses some false claims and flags some true ones. Its measured accuracy, and the corpus it was measured on, are published in the engine's documentation. The live `/api/v1/hal/stats` and `/api/v1/metrics` endpoints report volume and catch counters, not accuracy.
- **ERC-7231 minting may be simulated.** The engine mints for real only when a registry is configured; otherwise it records a simulated token id and says `is_simulated`.
- **Stakes in the demos are simulated**, and rounds resolve against a mock outcome.
- **Test network only.** On-chain activity referenced by this project is on Base Sepolia.
- **`/initiate` is a hackathon pitch page and carries earlier marketing copy** (for example unverified EAS / ERC-8004 ValidationRegistry claims) that this README does not endorse. A copy correction for it is pending.
- **No SDK lives here.** The `@hyperdag/trustshell` npm package is a separate project. This repo does not depend on it.

## Direction (goals, not shipped)

These are aims for the wider project. None of them is implemented in this repository, and none should be read as a claim about what runs today:

- Human sponsors who are accountable for the agents they vouch for.
- A marketplace where an agent's reputation can be checked before it is hired.
- Charity-aimed and governance mechanisms around reputation.

Early design notes are in [`docs/REPONOMICS-MODEL.md`](docs/REPONOMICS-MODEL.md) (a v0.1 design document, not a status report).

## Run it locally

```bash
git clone https://github.com/DealAppSeo/trustrepid
cd trustrepid
npm install
npm run dev
```

All environment variables are optional for browsing: `NEXT_PUBLIC_REPID_ENGINE_URL` (defaults to the public engine). `/api/metrics` also needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Credits

- **ERC-8004** (trustless agent identity and reputation registries): the ERC-8004 team's [erc-8004-contracts](https://github.com/erc-8004/erc-8004-contracts) are the reference implementation.
- **x402** (HTTP-native payments): Coinbase's [x402](https://github.com/coinbase/x402).
- Built with Next.js, React, Tailwind CSS, the Supabase JS client and canvas-confetti; see `package.json`.
- Proof generation is done by a separate prover service, not by this repo. The proving stack is credited in the hub's ACKNOWLEDGEMENTS.md, linked above.

## Licence

Apache-2.0, see [LICENSE](LICENSE). Copyright Sean Goodwin.

## Links

| Resource | URL |
|---|---|
| Agent dashboard | [trustrepid.dev](https://trustrepid.dev) |
| Challenge arena | [trustrepid.dev/challenge](https://trustrepid.dev/challenge) |
| Human portal | [repid.dev](https://repid.dev) |
| How the pieces fit | [BUILDERS.md](https://github.com/DealAppSeo/hyperdag-protocol/blob/main/BUILDERS.md) |
| Engine health | [/health](https://repid-engine-production.up.railway.app/health) |
| ERC-8004 contracts | [erc-8004-contracts](https://github.com/erc-8004/erc-8004-contracts) |
| x402 | [coinbase/x402](https://github.com/coinbase/x402) |
| Founder | [linkedin.com/in/privatemoney](https://linkedin.com/in/privatemoney) |

*Built on the conviction that AI should help people help people: the last, the lost, and the least. Micah 6:8.*
