(function (root) {
  'use strict';
  var ACTIVITY = { low: 1.25, fair: 1.4, high: 1.55 };
  var GOAL_ADJ = { lose: -400, maintain: 0, gain: 300 };

  function round50(x) { return Math.round(x / 50) * 50; }
  function roundTo5(x) { return Math.round(x / 5) * 5; }

  // Sex-neutral Mifflin-St Jeor (no sex field by brand choice: no BMI/judgment).
  function computeBudget(p) {
    var bmr = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age - 78;
    var tdee = bmr * (ACTIVITY[p.activity] || 1.4) + (GOAL_ADJ[p.goal] || 0);
    return round50(Math.max(1200, tdee));
  }

  root.Noted = root.Noted || {};
  root.Noted.budget = { computeBudget: computeBudget, round50: round50, roundTo5: roundTo5 };
})(typeof window !== 'undefined' ? window : globalThis);
