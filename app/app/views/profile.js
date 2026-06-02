(function (root) {
  'use strict';
  var ui = root.Noted.ui;
  var DIET = ['vegetarian', 'vegan', 'pescatarian', 'gluten-free'];
  var AVOID = ['peanuts', 'tree nuts', 'dairy', 'eggs', 'gluten', 'soy', 'sesame', 'fish', 'shellfish'];
  var GOALS = [['lose', 'lose weight'], ['maintain', 'stay where i am'], ['gain', 'gain weight']];

  function chip(label, on, group) {
    return '<label class="chip' + (on ? ' is-selected' : '') + '"><input class="chip__input" type="checkbox" data-group="' + group + '" value="' + label + '"' + (on ? ' checked' : '') + '>' +
      ui.icon('i-check', 'chip__check') + label + '</label>';
  }

  root.Noted = root.Noted || {}; root.Noted.views = root.Noted.views || {};
  root.Noted.views.profile = {
    render: function (s) {
      var p = s.profile;
      return '<main class="screen"><div class="screen__body">' + ui.brandHeader('profile') +
        '<section class="stack"><h2 class="txt-section">your goal</h2><div class="choice-stack">' +
          GOALS.map(function (g) {
            var sel = p.goal === g[0] ? ' is-selected' : '';
            return '<label class="choice-card choice-card--compact' + sel + '"><input class="choice-card__input" type="radio" name="pgoal" value="' + g[0] + '"' + (sel ? ' checked' : '') + '>' +
              '<span class="choice-card__surface"><span class="choice-card__label">' + g[1] + '</span>' + ui.icon('i-check', 'choice-card__check') + '</span></label>';
          }).join('') + '</div></section>' +

        '<section class="stack"><h2 class="txt-section">daily budget</h2>' +
          '<a class="setting-row" data-nav="your-budget" href="#your-budget"><span class="setting-row__text"><span class="setting-row__label">' +
          'budget</span><span class="setting-row__hint">tap to adjust</span></span><span class="estimate estimate--inline"><span class="estimate__value">' + ui.approx(p.budget) + '</span></span></a></section>' +

        '<section class="stack"><h2 class="txt-section">about you</h2>' +
          '<a class="setting-row" data-nav="about-you" href="#about-you"><span class="setting-row__text"><span class="setting-row__label">age · weight · height · activity</span>' +
          '<span class="setting-row__hint">' + p.age + ' · ' + p.weightKg + ' kg · ' + p.heightCm + ' cm · ' + p.activity + '</span></span>' + ui.icon('i-chevron-right') + '</a></section>' +

        '<section class="stack"><h2 class="txt-section">your diet</h2><div class="chip-group">' +
          DIET.map(function (d) { return chip(d, p.diet.has(d), 'diet'); }).join('') + '</div></section>' +
        '<section class="stack"><h2 class="txt-section">anything you avoid</h2><div class="chip-group">' +
          AVOID.map(function (a) { return chip(a, p.avoid.has(a), 'avoid'); }).join('') + '</div></section>' +

        '<section class="stack"><div class="setting-row"><span class="setting-row__text"><span class="setting-row__label">friend\'s nudges</span>' +
          '<span class="setting-row__hint">an occasional recipe on home</span></span>' +
          '<label class="toggle"><input class="toggle__input" type="checkbox" id="p-nudges"' + (p.nudges ? ' checked' : '') + '><span class="toggle__track"><span class="toggle__knob"></span></span></label></div></section>' +
        '</div></main>' + ui.tabBar('profile');
    },
    mount: function (s, store) {
      document.querySelectorAll('input[name="pgoal"]').forEach(function (r) {
        r.addEventListener('change', function () { store.setProfile({ goal: r.value }); });   // recomputes budget
      });
      document.querySelectorAll('.chip__input').forEach(function (c) {
        c.addEventListener('change', function () { c.dataset.group === 'diet' ? store.toggleDiet(c.value) : store.toggleAvoid(c.value); });
      });
      document.getElementById('p-nudges').addEventListener('change', function (e) { store.setNudges(e.target.checked); });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
