(function (root) {
  'use strict';
  var ui = root.Noted.ui, R = root.Noted.recipes, D = root.Noted.derive;
  root.Noted.views = root.Noted.views || {};
  root.Noted.views['recipe-detail'] = {
    render: function (s) {
      var r = R.byId(s.selectedRecipeId) || R.RECIPES[0];
      var rem = D.remaining(s);
      var w = R.whyFits(r, { remaining: rem, diet: s.profile.diet, avoid: s.profile.avoid });
      var hero = r.photo
        ? '<div class="recipe-hero"><img class="recipe-hero__img" src="' + r.photo + '" alt="' + r.title + '"></div>'
        : '<div class="recipe-hero recipe-hero--icon recipe-hero--' + (r.tint || 'arugula') + '">' + ui.icon(r.icon, 'icon--food') + '</div>';
      function whyRow(html) { return '<div class="why__row">' + ui.icon('i-check', 'why__check') + '<span class="why__text">' + html + '</span></div>'; }
      return ui.backHeader('', s.previousRoute === 'home' ? 'home' : 'recipe-feed') +
        '<main class="screen screen--compact"><div class="screen__body">' + hero +
          '<div class="group"><h1 class="txt-title">' + r.title + '</h1>' +
            '<span class="estimate estimate--inline"><span class="estimate__value">' + ui.approx(r.kcal) + '</span></span></div>' +
          '<div class="why"><h2 class="why__title">why this fits you</h2>' +
            whyRow(w.budget) + whyRow(w.diet) + whyRow(w.allergens) +
            '<div class="macros"><span class="macro-pill macro-pill--protein">protein ≈ ' + r.macros.p + 'g</span>' +
            '<span class="macro-pill macro-pill--carbs">carbs ≈ ' + r.macros.c + 'g</span>' +
            '<span class="macro-pill macro-pill--fat">fat ≈ ' + r.macros.f + 'g</span></div></div>' +
          '<div class="group"><h2 class="txt-section">ingredients</h2><ul class="list">' + r.ingredients.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul></div>' +
          '<div class="group"><h2 class="txt-section">a few simple steps</h2><ol class="list">' + r.steps.map(function (st) { return '<li>' + st + '</li>'; }).join('') + '</ol></div>' +
        '</div><div class="screen__footer"><button class="btn btn--primary btn--block" id="logit">log it</button></div></main>';
    },
    mount: function (s, store) {
      var r = R.byId(s.selectedRecipeId) || R.RECIPES[0];
      document.getElementById('logit').addEventListener('click', function () {
        store.logMeal({ name: r.title, kcal: r.kcal, items: r.ingredients.slice(0, 3), macros: r.macros });
        store.navigate('home');
      });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
