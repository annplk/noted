(function (root) {
  'use strict';
  var RECIPES = [
    { id: 'lemony-green-orzo', title: 'lemony green orzo', time: '20 min', diet: 'vegetarian', kcal: 500, quick: true,
      macros: { p: 15, c: 75, f: 15 }, photo: '../assets/recipes/lemony-green-orzo.jpg',
      ingredients: ['orzo pasta', 'baby spinach', 'peas', 'lemon', 'parmesan', 'olive oil'],
      steps: ['boil the orzo until just tender, then drain.', 'wilt the spinach and peas in a little olive oil.', 'stir through lemon zest, juice, and the orzo.', 'finish with parmesan and a crack of pepper.'] },
    { id: 'spring-minestrone', title: 'spring minestrone', time: '35 min', diet: 'vegetarian', kcal: 400, quick: false,
      macros: { p: 15, c: 60, f: 10 }, icon: 'f-bowl', tint: 'arugula',
      ingredients: ['spring vegetables', 'cannellini beans', 'small pasta', 'tomatoes', 'vegetable stock', 'basil'],
      steps: ['soften the vegetables in olive oil.', 'add stock and tomatoes, simmer 15 min.', 'add beans and pasta, cook until tender.', 'finish with torn basil.'] },
    { id: 'wild-mushroom-risotto', title: 'wild mushroom risotto', time: '30 min', diet: 'vegetarian', kcal: 770, quick: false,
      macros: { p: 18, c: 95, f: 28 }, photo: '../assets/recipes/wild-mushroom-risotto.jpg',
      ingredients: ['arborio rice', 'wild mushrooms', 'shallot', 'white wine', 'parmesan', 'butter'],
      steps: ['fry the mushrooms, set aside.', 'soften the shallot, toast the rice.', 'add wine, then stock a ladle at a time.', 'stir through mushrooms, parmesan and butter.'] },
    { id: 'roasted-veg-bowl', title: 'roasted veg grain bowl', time: '25 min', diet: 'vegetarian', kcal: 550, quick: false,
      macros: { p: 16, c: 80, f: 18 }, photo: '../assets/recipes/roasted-veg-bowl.jpg',
      ingredients: ['mixed vegetables', 'cooked grains', 'chickpeas', 'tahini', 'lemon', 'olive oil'],
      steps: ['roast the vegetables and chickpeas.', 'warm the grains.', 'whisk tahini with lemon and water.', 'bowl it up and drizzle the dressing.'] },
    { id: 'halloumi-tomato-salad', title: 'halloumi & tomato salad', time: '15 min', diet: 'vegetarian', kcal: 600, quick: true,
      macros: { p: 28, c: 20, f: 40 }, icon: 'f-herb', tint: 'focaccia',
      ingredients: ['halloumi', 'ripe tomatoes', 'cucumber', 'mint', 'olive oil', 'lemon'],
      steps: ['griddle the halloumi until golden.', 'chop the tomatoes and cucumber.', 'toss with mint, oil and lemon.', 'top with the warm halloumi.'] },
    { id: 'shakshuka', title: 'shakshuka', time: '25 min', diet: 'vegetarian', kcal: 450, quick: false,
      macros: { p: 22, c: 30, f: 25 }, photo: '../assets/recipes/shakshuka.jpg',
      ingredients: ['eggs', 'tomatoes', 'peppers', 'onion', 'paprika', 'cumin'],
      steps: ['soften onion and peppers.', 'add tomatoes and spices, simmer.', 'make wells and crack in the eggs.', 'cover until the whites set.'] }
  ];
  function byId(id) { return RECIPES.filter(function (r) { return r.id === id; })[0]; }
  function recipeStatus(kcal, remaining) {   // dynamic budget status against the live day
    var left = Math.max(0, remaining);
    return { over: kcal > remaining, amount: kcal - left };
  }
  function whyFits(r, ctx) {
    var rem = ctx.remaining;
    var left = Math.max(0, rem);
    var st = recipeStatus(r.kcal, rem);
    var diet = (ctx.diet && ctx.diet.size) ? Array.from(ctx.diet).join(', ') : 'your choices';
    var avoid = (ctx.avoid && ctx.avoid.size) ? Array.from(ctx.avoid)[0] : 'allergen';
    var budgetLine;
    if (!st.over) {
      budgetLine = '<b>within budget</b> — ≈ ' + r.kcal + ' of ≈ ' + left.toLocaleString('en-US') + ' left';
    } else if (rem > 0) {
      budgetLine = '<b>over budget</b> — ≈ ' + r.kcal + ', ≈ ' + st.amount.toLocaleString('en-US') + ' past your ≈ ' + left.toLocaleString('en-US') + ' left';
    } else {
      budgetLine = '<b>over budget</b> — you\'ve reached today\'s limit';
    }
    return {
      budget: budgetLine,
      diet: '<b>matches your diet</b> — ' + (r.diet || diet),
      allergens: '<b>no allergens</b> — ' + avoid + '-free'
    };
  }
  root.Noted = root.Noted || {};
  root.Noted.recipes = { RECIPES: RECIPES, byId: byId, whyFits: whyFits, recipeStatus: recipeStatus };
})(typeof window !== 'undefined' ? window : globalThis);
