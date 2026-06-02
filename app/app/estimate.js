(function (root) {
  'use strict';
  var r5 = root.Noted.budget.roundTo5;     // shared macro rounding (budget.js loads first)

  // A small pantry of plausible foods. Each item's kcal ≈ 4·p + 4·c + 9·f, so a meal
  // summed from them stays self-consistent (calories and macros agree). `meta` is a
  // human-readable portion only. This stands in for a real parser — the "AI" is canned.
  var POOL = [
    { name: 'grilled chicken',   meta: '1 fillet',  kcal: 215, p: 40, c: 0,  f: 6 },
    { name: 'white rice',        meta: '1 cup',     kcal: 200, p: 4,  c: 45, f: 0 },
    { name: 'olive oil',         meta: '1 tbsp',    kcal: 125, p: 0,  c: 0,  f: 14 },
    { name: 'avocado',           meta: '½',         kcal: 180, p: 2,  c: 9,  f: 15 },
    { name: 'mixed greens',      meta: '1 bowl',    kcal: 35,  p: 2,  c: 6,  f: 0 },
    { name: 'cherry tomatoes',   meta: '1 handful', kcal: 30,  p: 1,  c: 6,  f: 0 },
    { name: 'pasta',             meta: '1 plate',   kcal: 320, p: 12, c: 62, f: 3 },
    { name: 'parmesan',          meta: '2 tbsp',    kcal: 90,  p: 8,  c: 1,  f: 6 },
    { name: 'salmon',            meta: '1 fillet',  kcal: 280, p: 34, c: 0,  f: 16 },
    { name: 'egg',               meta: '1 large',   kcal: 75,  p: 6,  c: 1,  f: 5 },
    { name: 'whole-grain bread', meta: '1 slice',   kcal: 90,  p: 4,  c: 16, f: 1 },
    { name: 'greek yogurt',      meta: '1 pot',     kcal: 110, p: 10, c: 8,  f: 4 },
    { name: 'banana',            meta: '1 medium',  kcal: 110, p: 1,  c: 27, f: 0 },
    { name: 'almonds',           meta: '1 handful', kcal: 175, p: 6,  c: 6,  f: 14 },
    { name: 'chickpeas',         meta: '½ cup',     kcal: 135, p: 7,  c: 22, f: 2 },
    { name: 'cheddar',           meta: '1 slice',   kcal: 115, p: 7,  c: 1,  f: 9 },
    { name: 'roasted veg',       meta: '1 serving', kcal: 95,  p: 3,  c: 14, f: 3 },
    { name: 'hummus',            meta: '2 tbsp',    kcal: 75,  p: 2,  c: 6,  f: 5 }
  ];

  function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }

  function sample(n) {                       // n distinct items, drawn without replacement
    var pool = POOL.slice(), out = [];
    while (out.length < n && pool.length) {
      out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    return out;
  }

  function roundKcal(x) {                     // nearest 50; large meals to 100 (design-system rule)
    return x > 700 ? Math.round(x / 100) * 100 : Math.round(x / 50) * 50;
  }

  // The canned "AI": a random but plausible, self-consistent meal estimate.
  function generate() {
    var picks = sample(randInt(2, 4));
    var sum = picks.reduce(function (a, it) {
      return { kcal: a.kcal + it.kcal, p: a.p + it.p, c: a.c + it.c, f: a.f + it.f };
    }, { kcal: 0, p: 0, c: 0, f: 0 });

    var kcal = roundKcal(sum.kcal);
    var spread = Math.max(50, Math.round(kcal * 0.12 / 50) * 50);   // ±~12%, on the 50-grid
    var lo = Math.max(50, kcal - spread), hi = kcal + spread;

    return {
      kcal: kcal,
      range: 'likely ' + lo.toLocaleString('en-US') + '–' + hi.toLocaleString('en-US'),
      macros: { p: r5(sum.p), c: r5(sum.c), f: r5(sum.f) },
      items: picks.map(function (it) { return { name: it.name, meta: it.meta }; })
    };
  }

  root.Noted = root.Noted || {};
  root.Noted.estimate = { generate: generate, POOL: POOL };
})(typeof window !== 'undefined' ? window : globalThis);
