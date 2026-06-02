const test = require('node:test');
const assert = require('node:assert');
require('../app/data/recipes.js');
const { RECIPES, byId, whyFits, recipeStatus } = globalThis.Noted.recipes;

test('six recipes, all with required fields', () => {
  assert.equal(RECIPES.length, 6);
  RECIPES.forEach(r => {
    ['id','title','time','kcal','macros','ingredients','steps'].forEach(k => assert.ok(r[k] !== undefined, r.id + ' missing ' + k));
    assert.ok(r.photo || r.icon, r.id + ' needs photo or icon');
  });
});

test('exactly two recipes are photo-less (icon)', () => {
  assert.equal(RECIPES.filter(r => !r.photo && r.icon).length, 2);
});

test('byId finds the hero recipe', () => {
  assert.equal(byId('lemony-green-orzo').kcal, 500);
});

test('whyFits reports within-budget against live remaining', () => {
  const lines = whyFits(byId('lemony-green-orzo'), { remaining: 1150, diet: new Set(['vegetarian']), avoid: new Set(['peanuts']) });
  assert.match(lines.budget, /within budget/);
  assert.match(lines.budget, /500/);
  assert.match(lines.budget, /1,150/);
  assert.match(lines.diet, /vegetarian/);
  assert.match(lines.allergens, /peanut/);
});

test('whyFits flags over-budget calmly (never the word red/alarm)', () => {
  const lines = whyFits(byId('wild-mushroom-risotto'), { remaining: 100, diet: new Set(), avoid: new Set() });
  assert.match(lines.budget, /over/);
});

test('recipeStatus flags in-budget when kcal <= remaining (exact fit = in)', () => {
  assert.equal(recipeStatus(500, 1150).over, false);
  assert.equal(recipeStatus(500, 500).over, false);
});

test('recipeStatus flags over when kcal > remaining; amount = kcal - max(0,remaining)', () => {
  const a = recipeStatus(770, 100);
  assert.equal(a.over, true);
  assert.equal(a.amount, 670);
});

test('recipeStatus clamps remaining at 0 — amount never exceeds kcal, never negative', () => {
  const a = recipeStatus(500, -200);
  assert.equal(a.over, true);
  assert.equal(a.amount, 500);
});

test('whyFits avoids negative numbers when nothing is left (rem <= 0)', () => {
  const lines = whyFits(byId('lemony-green-orzo'), { remaining: -50, diet: new Set(['vegetarian']), avoid: new Set(['peanuts']) });
  assert.match(lines.budget, /over budget/);
  assert.match(lines.budget, /limit/);
  assert.doesNotMatch(lines.budget, /-\d/);
});

test('whyFits over-budget with budget left states the past amount (positive)', () => {
  const lines = whyFits(byId('wild-mushroom-risotto'), { remaining: 100, diet: new Set(), avoid: new Set() });
  assert.match(lines.budget, /over budget/);
  assert.match(lines.budget, /670 past/);
  assert.doesNotMatch(lines.budget, /-\d/);
});
