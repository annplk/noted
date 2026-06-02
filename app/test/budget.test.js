const test = require('node:test');
const assert = require('node:assert');
require('../app/budget.js');
const { computeBudget, round50, roundTo5 } = globalThis.Noted.budget;

test('round50 rounds to nearest 50', () => {
  assert.equal(round50(1625.8), 1650);
  assert.equal(round50(1624), 1600);
});

test('roundTo5 rounds macros to nearest 5', () => {
  assert.equal(roundTo5(62), 60);
  assert.equal(roundTo5(63), 65);
});

test('computeBudget matches the demo day (1650)', () => {
  // age 29, weight 62, height 168, fair activity, lose goal
  assert.equal(
    computeBudget({ age: 29, weightKg: 62, heightCm: 168, activity: 'fair', goal: 'lose' }),
    1650
  );
});

test('computeBudget never drops below the 1200 floor', () => {
  assert.equal(
    computeBudget({ age: 80, weightKg: 45, heightCm: 150, activity: 'low', goal: 'lose' }) >= 1200,
    true
  );
});

test('gain > maintain > lose for the same body', () => {
  const base = { age: 30, weightKg: 70, heightCm: 175, activity: 'fair' };
  const lose = computeBudget({ ...base, goal: 'lose' });
  const maintain = computeBudget({ ...base, goal: 'maintain' });
  const gain = computeBudget({ ...base, goal: 'gain' });
  assert.ok(gain > maintain && maintain > lose);
});

test('unknown activity/goal fall back calmly (fair / maintain)', () => {
  const known = computeBudget({ age: 30, weightKg: 70, heightCm: 175, activity: 'fair', goal: 'maintain' });
  assert.equal(computeBudget({ age: 30, weightKg: 70, heightCm: 175, activity: 'zzz', goal: 'maintain' }), known);
  assert.equal(computeBudget({ age: 30, weightKg: 70, heightCm: 175, activity: 'fair', goal: 'zzz' }), known);
});
