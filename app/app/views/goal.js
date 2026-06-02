(function (root) {
  'use strict';
  var ui = root.Noted.ui;
  var GOALS = [['lose', 'lose weight'], ['maintain', 'stay where i am'], ['gain', 'gain weight']];
  root.Noted.views = root.Noted.views || {};
  root.Noted.views.goal = {
    render: function (s) {
      return '<main class="screen"><div class="screen__body">' +
        steps(1) +
        '<h1 class="txt-title">what brings you to noted?</h1>' +
        '<div class="choice-stack">' + GOALS.map(function (g) {
          var sel = s.profile.goal === g[0] ? ' is-selected' : '';
          return '<label class="choice-card' + sel + '"><input class="choice-card__input" type="radio" name="goal" value="' + g[0] + '"' + (sel ? ' checked' : '') + '>' +
            '<span class="choice-card__surface"><span class="choice-card__label">' + g[1] + '</span>' + ui.icon('i-check', 'choice-card__check') + '</span></label>';
        }).join('') + '</div>' +
        '</div><div class="screen__footer"><a class="btn btn--primary btn--block" data-nav="about-you" href="#about-you">continue</a></div></main>';
    },
    mount: function (s, store) {
      document.querySelectorAll('input[name="goal"]').forEach(function (r) {
        r.addEventListener('change', function () { store.setProfile({ goal: r.value }); });
      });
    }
  };
  function steps(active) {
    var d = ''; for (var i = 1; i <= 4; i++) d += '<span class="step-dot' + (i === active ? ' step-dot--active' : '') + '"></span>';
    return '<div class="steps" role="img" aria-label="step ' + active + ' of 4">' + d + '</div>';
  }
  root.Noted.steps = steps;   // reused by other onboarding views
})(typeof window !== 'undefined' ? window : globalThis);
