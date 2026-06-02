const test = require('node:test');
const assert = require('node:assert');
require('../app/budget.js');     // estimate reuses budget rounding (loads first)
require('../app/estimate.js');
const { generate } = globalThis.Noted.estimate;

function runs(n, fn) { for (let i = 0; i < n; i++) fn(generate()); }

test('generate returns a well-formed estimate', () => {
  const e = generate();
  assert.equal(typeof e.kcal, 'number');
  assert.equal(typeof e.range, 'string');
  assert.ok(e.macros && typeof e.macros.p === 'number' && typeof e.macros.c === 'number' && typeof e.macros.f === 'number');
  assert.ok(Array.isArray(e.items));
  assert.ok(e.items.length >= 2 && e.items.length <= 4, 'items 2..4, got ' + e.items.length);
  e.items.forEach(it => { assert.equal(typeof it.name, 'string'); assert.equal(typeof it.meta, 'string'); });
});

test('kcal is rounded to 50 and within a plausible meal range', () => {
  runs(300, e => {
    assert.equal(e.kcal % 50, 0, 'kcal multiple of 50: ' + e.kcal);
    assert.ok(e.kcal >= 50 && e.kcal <= 1300, 'kcal in plausible range: ' + e.kcal);
  });
});

test('macros round to 5 and are non-negative', () => {
  runs(300, e => {
    ['p', 'c', 'f'].forEach(k => {
      assert.equal(e.macros[k] % 5, 0, k + ' multiple of 5: ' + e.macros[k]);
      assert.ok(e.macros[k] >= 0, k + ' non-negative: ' + e.macros[k]);
    });
  });
});

test('range brackets the kcal estimate (no degenerate range)', () => {
  runs(300, e => {
    const m = e.range.match(/(\d[\d,]*)\D+?(\d[\d,]*)/);
    assert.ok(m, 'range has two numbers: ' + e.range);
    const lo = +m[1].replace(/,/g, ''), hi = +m[2].replace(/,/g, '');
    assert.ok(lo <= e.kcal && e.kcal <= hi, `lo ${lo} <= kcal ${e.kcal} <= hi ${hi}`);
    assert.ok(lo < hi, `lo ${lo} < hi ${hi}`);
  });
});

test('macros are roughly consistent with kcal (ingredient-derived)', () => {
  runs(300, e => {
    const macroCal = e.macros.p * 4 + e.macros.c * 4 + e.macros.f * 9;
    assert.ok(Math.abs(macroCal - e.kcal) <= 0.25 * e.kcal + 60, `macroCal ${macroCal} ~ kcal ${e.kcal}`);
  });
});

test('items within a meal are distinct', () => {
  runs(200, e => {
    const names = e.items.map(i => i.name);
    assert.equal(new Set(names).size, names.length, 'distinct items: ' + names.join(', '));
  });
});

test('successive estimates vary (randomised)', () => {
  const seen = new Set();
  for (let i = 0; i < 40; i++) { const e = generate(); seen.add(e.kcal + '|' + e.items.map(x => x.name).join(',')); }
  assert.ok(seen.size > 5, 'expected variety across runs, got ' + seen.size);
});
