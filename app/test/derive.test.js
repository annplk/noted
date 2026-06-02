const test = require('node:test');
const assert = require('node:assert');
require('../app/budget.js');   // derive reuses budget.roundTo5
require('../app/derive.js');
const { remaining, dayMacros } = globalThis.Noted.derive;

const state = {
  profile: { budget: 1650 },
  today: { meals: [
    { kcal: 500, macros: { p: 15, c: 80, f: 10 } },
    { kcal: 450, macros: { p: 22, c: 30, f: 18 } }
  ] }
};

test('remaining subtracts logged kcal from budget', () => {
  assert.equal(remaining(state), 700);
});

test('remaining can go negative (over budget, never clamped)', () => {
  assert.equal(remaining({ profile: { budget: 400 }, today: { meals: [{ kcal: 500, macros:{p:0,c:0,f:0} }] } }), -100);
});

test('dayMacros sums and rounds each macro to 5g', () => {
  assert.deepEqual(dayMacros(state), { p: 35, c: 110, f: 30 });
});

test('empty day → full budget, zero macros', () => {
  assert.equal(remaining({ profile: { budget: 1650 }, today: { meals: [] } }), 1650);
  assert.deepEqual(dayMacros({ profile: { budget: 1650 }, today: { meals: [] } }), { p: 0, c: 0, f: 0 });
});
