(function (root) {
  'use strict';
  var ui = root.Noted.ui, steps = root.Noted.steps;
  var DIET = ['vegetarian', 'vegan', 'pescatarian', 'gluten-free'];
  var AVOID = ['peanuts', 'tree nuts', 'dairy', 'eggs', 'gluten', 'soy', 'sesame', 'fish', 'shellfish'];

  function chip(label, on, group) {
    return '<label class="chip' + (on ? ' is-selected' : '') + '"><input class="chip__input" type="checkbox" data-group="' + group + '" value="' + label + '"' + (on ? ' checked' : '') + '>' +
      ui.icon('i-check', 'chip__check') + label + '</label>';
  }
  function addChip() { return '<button class="chip chip--add" type="button" aria-label="add your own">' + ui.icon('i-add') + '</button>'; }

  root.Noted.views = root.Noted.views || {};
  root.Noted.views.preferences = {
    render: function (s) {
      return '<main class="screen"><div class="screen__body">' + steps(4) +
        '<section class="stack"><h2 class="txt-section">your diet</h2><div class="chip-group">' +
          DIET.map(function (d) { return chip(d, s.profile.diet.has(d), 'diet'); }).join('') + addChip() + '</div></section>' +
        '<section class="stack"><h2 class="txt-section">anything you avoid?</h2><div class="chip-group">' +
          AVOID.map(function (a) { return chip(a, s.profile.avoid.has(a), 'avoid'); }).join('') + addChip() + '</div></section>' +
        '</div><div class="screen__footer screen__footer--center">' +
          '<a class="btn btn--primary btn--block" data-nav="home" href="#home">all set</a>' +
          '<a class="btn btn--text" data-nav="home" href="#home">skip for now</a>' +
        '</div></main>';
    },
    mount: function (s, store) {
      document.querySelectorAll('.chip__input').forEach(function (c) {
        c.addEventListener('change', function () {
          if (c.dataset.group === 'diet') store.toggleDiet(c.value); else store.toggleAvoid(c.value);
        });
      });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
