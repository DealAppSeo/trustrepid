import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// No test framework in this repo — compile the pure helper standalone (it has no imports) and require
// it. Run: node tests/metrics.check.mjs
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = mkdtempSync(join(tmpdir(), 'metrics-'));
execSync(`npx tsc lib/metrics.ts --outDir "${out}" --module commonjs --target es2019 --moduleResolution node`, { cwd: root, stdio: 'inherit', shell: true });
const req = createRequire(import.meta.url);
const { computeMetrics } = req(join(out, 'metrics.js'));

const ok = (data) => ({ data, error: null });
const err = () => ({ data: null, error: { message: 'boom' } });

// Happy path: real counts.
const live = computeMetrics(
  ok([{ vdr_count: 2 }, { vdr_count: 3 }]),
  ok([{ llm_provider: 'a' }, { llm_provider: 'a' }, { llm_provider: 'b' }]),
  ok([{}]),
);
assert.deepEqual(live, { available: true, agents: 2, vdr: 5, decisions: 3, providers: 2, hallucinations: 1 });

// Any query error → degraded, and CRUCIALLY no fabricated numeric counts.
for (const [label, a, d, h] of [
  ['agents errored', err(), ok([]), ok([])],
  ['decisions errored', ok([]), err(), ok([])],
  ['hallucinations errored', ok([]), ok([]), err()],
]) {
  const m = computeMetrics(a, d, h);
  assert.equal(m.available, false, `${label}: must be unavailable`);
  assert.equal(m.error, 'metrics_unavailable', `${label}: must carry the error`);
  assert.equal(m.agents, undefined, `${label}: must NOT fabricate an agents count`);
  assert.equal(m.vdr, undefined, `${label}: must NOT fabricate a vdr count`);
}

console.log('metrics.check: PASS — live counts computed; every query error degrades to unavailable with no fabricated numbers');
