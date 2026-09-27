// Run: node --experimental-strip-types src/lib/lines.check.mts
import assert from 'node:assert/strict';
import { layoutLine, parseStations, metricNumber } from './lines.ts';

assert.deepEqual(parseStations(['Caller goes quiet', 'End of turn @ 772', ' Groq @ 312ms ', '']), [
  { label: 'Caller goes quiet' },
  { label: 'End of turn', ms: 772 },
  { label: 'Groq', ms: 312 },
]);

const sonar = layoutLine(['Caller goes quiet', 'End of turn @ 772', 'Deepgram @ 165', 'Groq @ 312', 'Cartesia @ 163']);
assert.equal(sonar.timed, true);
assert.equal(sonar.totalMs, 1412);
assert.equal(sonar.at[0], 0);
assert.equal(sonar.at.at(-1), 100);
assert.ok(Math.abs(sonar.at[1] - 54.67) < 0.01);

const plain = layoutLine(['A', 'B @ 10', 'C']); // partly timed = evenly spaced
assert.equal(plain.timed, false);
assert.deepEqual(plain.at, [0, 50, 100]);

assert.equal(metricNumber({ metrics: [{ label: 'Target', value: '900 ms' }] }, /target/i), 900);
assert.equal(metricNumber({ metrics: [{ label: 'p95', value: '1,487 ms' }] }, /p95/), 1487);
assert.equal(metricNumber({ metrics: [] }, /target/i), undefined);
console.log('lines ok');

import { parseRoute, describeRoute } from './lines.ts';
assert.deepEqual(parseRoute(['Router', 'Dense | BM25', 'hold: Human approval', 'loop 3: Validate, Fact-check', 'Deepgram @ 165']), [
  { kind: 'stop', label: 'Router', ms: undefined, hold: false },
  { kind: 'split', branches: ['Dense', 'BM25'] },
  { kind: 'stop', label: 'Human approval', ms: undefined, hold: true },
  { kind: 'loop', laps: 3, stops: ['Validate', 'Fact-check'] },
  { kind: 'stop', label: 'Deepgram', ms: 165, hold: false },
]);
assert.equal(describeRoute(['A | B', 'hold: C']), 'A and B in parallel -> C (waits for human approval)');
console.log('routes ok');
