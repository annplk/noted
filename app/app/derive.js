(function (root) {
  'use strict';
  var r5 = root.Noted.budget.roundTo5;   // shared rounding rule (budget.js loads first)
  function remaining(state) {
    var spent = state.today.meals.reduce(function (s, m) { return s + m.kcal; }, 0);
    return state.profile.budget - spent;
  }
  function dayMacros(state) {
    var t = state.today.meals.reduce(function (a, m) {
      return { p: a.p + m.macros.p, c: a.c + m.macros.c, f: a.f + m.macros.f };
    }, { p: 0, c: 0, f: 0 });
    return { p: r5(t.p), c: r5(t.c), f: r5(t.f) };
  }
  root.Noted = root.Noted || {};
  root.Noted.derive = { remaining: remaining, dayMacros: dayMacros };
})(typeof window !== 'undefined' ? window : globalThis);
