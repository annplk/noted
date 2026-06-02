const test = require('node:test');
const assert = require('node:assert');
require('../app/budget.js');
require('../app/derive.js');
require('../app/state.js');
const { createStore } = globalThis.Noted.state;

test('initial state: welcome route, seeded profile, empty day', () => {
  const s = createStore();
  assert.equal(s.get().route, 'welcome');
  assert.equal(s.get().today.meals.length, 0);
  assert.equal(s.get().profile.budget, 1650);
  assert.ok(s.get().profile.diet.has('vegetarian'));
});

test('logMeal appends a meal and notifies', () => {
  const s = createStore();
  let notified = 0; s.subscribe(() => notified++);
  s.logMeal({ name: 'veggie pasta', kcal: 500, items: ['pasta'], macros: { p: 15, c: 80, f: 10 } });
  assert.equal(s.get().today.meals.length, 1);
  assert.equal(s.get().today.meals[0].name, 'veggie pasta');
  assert.ok(s.get().today.meals[0].id);
  assert.equal(notified, 1);
});

test('setProfile recomputes budget from body+goal', () => {
  const s = createStore();
  s.setProfile({ age: 29, weightKg: 62, heightCm: 168, activity: 'fair', goal: 'lose' });
  assert.equal(s.get().profile.budget, 1650);
});

test('toggleDiet flips membership', () => {
  const s = createStore();
  s.toggleDiet('vegan');
  assert.ok(s.get().profile.diet.has('vegan'));
  s.toggleDiet('vegan');
  assert.ok(!s.get().profile.diet.has('vegan'));
});

test('reset returns a fresh welcome state', () => {
  const s = createStore();
  s.logMeal({ name: 'x', kcal: 100, items: [], macros: { p: 0, c: 0, f: 0 } });
  s.reset();
  assert.equal(s.get().today.meals.length, 0);
  assert.equal(s.get().route, 'welcome');
});

const D = globalThis.Noted.derive;
test('logging a meal reduces remaining and grows day macros', () => {
  const s = createStore();
  assert.equal(D.remaining(s.get()), 1650);
  s.logMeal({ name: 'veggie pasta', kcal: 500, items: ['pasta'], macros: { p: 15, c: 80, f: 10 } });
  assert.equal(D.remaining(s.get()), 1150);
  assert.deepEqual(D.dayMacros(s.get()), { p: 15, c: 80, f: 10 });
  s.logMeal({ name: 'salad', kcal: 450, items: ['halloumi'], macros: { p: 20, c: 30, f: 18 } });
  assert.equal(D.remaining(s.get()), 700);
  assert.equal(s.get().today.meals.length, 2);
});
