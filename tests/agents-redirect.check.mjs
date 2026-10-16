import assert from 'node:assert/strict';

// The minted ERC-8004 token URIs https://trustrepid.dev/agents/trinity-<name> must forward to the
// engine's registration file (D-113). No test framework in this repo.
// Run: node --experimental-strip-types tests/agents-redirect.check.mjs
const { default: config } = await import('../next.config.ts');
const redirects = await config.redirects();
const r = redirects.find((x) => x.source === '/agents/:name');

assert.ok(r, 'no redirect for /agents/:name');
assert.equal(r.permanent, false, 'must stay temporary: the tokens may be repointed on-chain later');
assert.match(r.destination, /^https:\/\/[^/]+\/api\/v1\/agents\/:name\/registration\.json$/);
console.log('ok', r.source, '->', r.destination);
