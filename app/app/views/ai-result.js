(function (root) {
  'use strict';
  var ui = root.Noted.ui, E = root.Noted.estimate;

  function mealName(s) {
    var t = (s.describeDraft || '').trim();
    return t ? t.replace(/\s+/g, ' ').slice(0, 32) : 'a quick bite';
  }
  // use the estimate generated on "Estimate"; generate one lazily if somehow absent
  // (e.g. ai-result reached directly), persisting it so render + mount stay in sync
  function estimateFor(s) {
    if (!s.estimate) s.estimate = E.generate();
    return s.estimate;
  }

  root.Noted.views = root.Noted.views || {};
  root.Noted.views['ai-result'] = {
    render: function (s) {
      var est = estimateFor(s);
      return ui.backHeader('', 'describe') +
        '<main class="screen"><div class="screen__body">' +
          '<h1 class="txt-title">here\'s what i understood</h1>' +
          '<div class="group"><label class="estimate estimate--hero reveal">' +
            '<input type="checkbox" class="reveal__toggle" aria-label="see the range">' +
            '<span class="estimate__value">' + ui.approx(est.kcal) + '</span>' +
            '<span class="estimate__range reveal__resting">tap to see range</span>' +
            '<span class="estimate__range estimate__range--revealed reveal__revealed">' + est.range + '</span>' +
          '</label><div class="macros">' +
            '<span class="macro-pill macro-pill--protein">protein ≈ ' + est.macros.p + 'g</span>' +
            '<span class="macro-pill macro-pill--carbs">carbs ≈ ' + est.macros.c + 'g</span>' +
            '<span class="macro-pill macro-pill--fat">fat ≈ ' + est.macros.f + 'g</span></div></div>' +
          '<div class="group"><p class="txt-caption">from these items —</p><div>' +
            est.items.map(function (it) {
              return '<div class="food-row food-row--evidence">' +
                '<span class="food-row__body"><span class="food-row__name">' + it.name + '</span><span class="food-row__meta">' + it.meta + '</span></span>' +
                '<button class="food-row__action" type="button" aria-label="edit ' + it.name + '">' + ui.icon('i-edit') + '</button>' +
                '<span class="stepper"><button class="stepper__btn" type="button" data-step="-1" aria-label="fewer">' + ui.icon('i-minus') + '</button>' +
                '<span class="stepper__value">1</span>' +
                '<button class="stepper__btn" type="button" data-step="1" aria-label="more">' + ui.icon('i-add') + '</button></span>' +
                '<button class="food-row__remove" type="button" aria-label="remove">' + ui.icon('i-close') + '</button></div>';
            }).join('') + '</div></div>' +
        '</div><div class="screen__footer">' +
          '<button class="btn btn--primary btn--block" id="logit">log it</button>' +
          '<a class="btn btn--secondary btn--block" data-nav="describe" href="#describe">redescribe?</a>' +
        '</div></main>';
    },
    mount: function (s, store) {
      // pencil toggles inline edit; rows themselves are inert (evidence)
      document.querySelectorAll('.food-row').forEach(function (row) {
        row.querySelector('.food-row__action').addEventListener('click', function () { row.classList.toggle('is-editing'); });
        var val = row.querySelector('.stepper__value');
        row.querySelectorAll('.stepper__btn').forEach(function (b) {
          b.addEventListener('click', function () { val.textContent = Math.max(1, +val.textContent + +b.dataset.step); });
        });
        // demo: removing a row is a visual affordance only — the generated estimate is
        // what gets logged (this prototype has no real per-item recompute)
        row.querySelector('.food-row__remove').addEventListener('click', function () { row.remove(); });
      });
      document.getElementById('logit').addEventListener('click', function () {
        var est = estimateFor(s);
        store.logMeal({ name: mealName(s), kcal: est.kcal, items: est.items.map(function (i) { return i.name.split(' ')[0]; }), macros: est.macros });
        store.setDraft('');               // clear the draft without a redundant re-render
        store.navigate('home', { estimate: null });   // fresh estimate next time through describe
      });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
