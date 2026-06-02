(function (root) {
  'use strict';
  var ui = root.Noted.ui, R = root.Noted.recipes, D = root.Noted.derive;
  function marker(r) {
    if (r.photo) return '<span class="recipe-card__marker recipe-card__marker--photo"><img class="recipe-card__photo" src="' + r.photo + '" alt=""></span>';
    return '<span class="recipe-card__marker recipe-card__marker--' + (r.tint || 'arugula') + '">' + ui.icon(r.icon) + '</span>';
  }
  function card(r, rem) {
    var st = R.recipeStatus(r.kcal, rem);
    var pill = st.over
      ? '<span class="recipe-card__pill recipe-card__pill--over"><span class="recipe-card__kcal">≈ ' + st.amount + ' over</span></span>'
      : '<span class="recipe-card__pill">' + ui.icon('i-check') + 'in budget · <span class="recipe-card__kcal">≈ ' + r.kcal + '</span></span>';
    return '<a class="recipe-card" data-recipe="' + r.id + '" href="#recipe-detail" data-budget="' + (st.over ? 'over' : 'in') + '" data-quick="' + (r.quick ? 'yes' : 'no') + '">' +
      marker(r) + '<span class="recipe-card__body"><span class="recipe-card__title">' + r.title + '</span>' +
      '<span class="recipe-card__meta"><span style="white-space:nowrap">' + r.time + '</span> · ' + r.diet + '</span>' + pill + '</span>' +
      ui.icon('i-chevron-right') + '</a>';
  }
  root.Noted.views = root.Noted.views || {};
  root.Noted.views['recipe-feed'] = {
    render: function (s) {
      var rem = D.remaining(s);
      return '<main class="screen"><div class="screen__body">' + ui.brandHeader('recipes') +
        '<div class="chip-group"><label class="chip"><input class="chip__input" type="checkbox" id="f-in">' + ui.icon('i-check', 'chip__check') + 'in budget</label>' +
        '<label class="chip"><input class="chip__input" type="checkbox" id="f-quick">' + ui.icon('i-check', 'chip__check') + 'quick</label></div>' +
        '<div class="feed" id="feed">' + R.RECIPES.map(function (r) { return card(r, rem); }).join('') + '</div>' +
        '</div></main>' + ui.tabBar('recipes');
    },
    mount: function (s, store) {
      document.getElementById('feed').addEventListener('click', function (e) {
        var c = e.target.closest('.recipe-card'); if (!c) return; e.preventDefault();
        store.selectRecipe(c.dataset.recipe); store.navigate('recipe-detail');
      });
      var fin = document.getElementById('f-in'), fq = document.getElementById('f-quick');
      function apply() {
        document.querySelectorAll('.recipe-card').forEach(function (c) {
          var ok = (!fin.checked || c.dataset.budget === 'in') && (!fq.checked || c.dataset.quick === 'yes');
          c.style.display = ok ? '' : 'none';
        });
      }
      fin.addEventListener('change', apply); fq.addEventListener('change', apply);
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
