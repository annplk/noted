(function (root) {
  'use strict';
  var ui = root.Noted.ui, D = root.Noted.derive;
  function pill(label, v) { return '<span class="macro-pill macro-pill--' + label + '">' + label + ' ≈ ' + v + 'g</span>'; }

  function mealCard(m, idx) {
    return '<div class="card card--meal" data-idx="' + idx + '">' +
      '<div class="card__label">' + m.time + '</div>' +
      '<div class="card__meal">' + m.name + '</div>' +
      '<span class="estimate estimate--inline"><span class="estimate__value">' + ui.approx(m.kcal) + '</span></span>' +
      '<div class="card__rule"></div><div class="card__items">' + m.items.join(' · ') + '</div></div>';
  }

  root.Noted.views = root.Noted.views || {};
  root.Noted.views.home = {
    render: function (s) {
      var rem = D.remaining(s), dm = D.dayMacros(s), meals = s.today.meals, over = rem < 0;
      var budget =
        '<div class="card budget">' +
          '<div class="budget__label">' + (over ? 'over by' : 'left for today') + '</div>' +
          '<span class="estimate"><span class="estimate__value">' + ui.approx(Math.abs(rem)) + '</span></span>' +
          '<div class="budget__context">of ≈ ' + s.profile.budget.toLocaleString('en-US') + ' today</div>' +
          '<div class="macros">' + pill('protein', dm.p) + pill('carbs', dm.c) + pill('fat', dm.f) + '</div></div>';
      var prompt = '<a class="describe" data-nav="describe" href="#describe" aria-label="describe a meal">' +
        '<span class="describe__input">what did you eat?</span><span class="describe__icon" aria-hidden="true">' + ui.icon('i-mic') + '</span></a>';

      var stack = '';
      if (meals.length) {
        var cls = 'meal-stack' + (meals.length > 1 ? (s.today.expanded ? ' is-expanded' : ' is-collapsed') : '');
        stack = '<div class="meal-stack-wrap"><span class="card__magnet"></span>' +
          '<div class="' + cls + '" id="meal-stack">' + meals.map(mealCard).join('') + '</div>' +
          (meals.length > 1 ? '<button class="meal-stack__cue" type="button" id="stack-cue">' + (s.today.expanded ? 'tap to collapse ▴' : meals.length + ' meals today · tap to expand ▾') + '</button>' : '') +
          '</div>';
      }
      var nudge = (s.profile.nudges && meals.length) ?
        '<a class="card card--nudge" data-nav="recipe-detail" href="#recipe-detail" data-recipe="lemony-green-orzo">' +
          '<span class="card__magnet card__magnet--arugula"></span>' + ui.icon('f-leaf', 'icon--fresh') +
          '<p class="txt-voice txt-voice--fresh">fancy something green tonight?</p></a>' : '';

      var body = meals.length
        ? budget + prompt + stack + nudge
        : budget + prompt + '<p class="lede center-text home__empty-hint">nothing logged yet — tell me what you ate.</p>';

      return '<main class="screen"><div class="screen__body">' + ui.brandHeader('today') + body + '</div></main>' + ui.tabBar('home');
    },
    mount: function (s, store) {
      var cue = document.getElementById('stack-cue');
      if (cue) cue.addEventListener('click', function () { store.toggleExpand(); });
      var stack = document.getElementById('meal-stack');
      if (stack && s.today.meals.length > 1) stack.addEventListener('click', function (e) {
        if (e.target.closest('.reveal')) return; store.toggleExpand();
      });
      var nudge = document.querySelector('.card--nudge');
      if (nudge) nudge.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); store.selectRecipe(nudge.dataset.recipe); store.navigate('recipe-detail'); });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
