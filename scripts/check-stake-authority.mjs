/**
 * Runnable check for lib/engine.ts getStakeAuthority(). No test framework in this repo, so this is
 * a standalone live contract probe: it hits the same PUBLIC endpoint and asserts the exact shape the
 * mapper depends on. If the engine's /stake/authority contract drifts, this fails. Skips (exit 0)
 * when the engine is unreachable so an outage isn't read as a code regression.
 *
 * Run: node scripts/check-stake-authority.mjs
 */
import assert from 'node:assert/strict';

const ENGINE_URL = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || 'https://repid-engine-production.up.railway.app';
const BUILDER = process.argv[2] || 'trinity-sophia';

let res;
try {
  res = await fetch(`${ENGINE_URL}/api/v1/stake/authority/${encodeURIComponent(BUILDER)}`, { headers: { accept: 'application/json' } });
} catch (e) {
  console.log(`SKIP — engine unreachable (${e.message}); getStakeAuthority degrades to null on this path`);
  process.exit(0);
}

assert.equal(res.status, 200, `expected 200, got ${res.status}`);
const d = await res.json();

// The fields getStakeAuthority reads/maps must be present and the right kind.
assert.equal(typeof d.builder_id, 'string', 'builder_id must be a string');
assert.ok('stake_total' in d, 'stake_total must be present');
assert.ok(d.authority === null || typeof d.authority === 'string', 'authority must be string|null');
assert.equal(typeof d.authority_withheld, 'boolean', 'authority_withheld must be boolean');
assert.equal(typeof d.authority_is_binding, 'boolean', 'authority_is_binding must be boolean');
assert.ok(d.basis && typeof d.basis === 'object', 'basis must be an object');

// Honesty invariant the UI relies on: a withheld authority is null, never a stand-in 0.
if (d.authority_withheld) assert.equal(d.authority, null, 'withheld authority must be null, not a zero');

console.log(`PASS — getStakeAuthority contract holds for ${BUILDER}: stake_total=${d.stake_total} authority=${d.authority} withheld=${d.authority_withheld}`);
