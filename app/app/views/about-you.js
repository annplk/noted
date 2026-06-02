(function (root) {
  'use strict';
  var ui = root.Noted.ui, steps = root.Noted.steps;   // ui.js + goal.js load first (index.html order)
  var FIELDS = [
    { key: 'age',      label: 'age',    min: 16,  max: 90,  unit: '' },
    { key: 'weightKg', label: 'weight', min: 40,  max: 160, unit: ' kg' },
    { key: 'heightCm', label: 'height', min: 130, max: 210, unit: ' cm' }
  ];
  var ACT = [['low', 'not much'], ['fair', 'fairly'], ['high', 'very']];

  function rowVal(p, f) { return p[f.key] + f.unit; }

  root.Noted.views = root.Noted.views || {};
  root.Noted.views['about-you'] = {
    render: function (s) {
      var fromProfile = s.previousRoute === 'profile';   // editor from profile, vs. the onboarding step
      return (fromProfile ? ui.backHeader('about you', 'profile') : '') +
        '<main class="screen"><div class="screen__body">' +
        (fromProfile ? '' : steps(2)) +
        '<h1 class="txt-title">a little about you — so we can do the maths</h1>' +
        '<div class="picker">' + FIELDS.map(function (f, i) {
          return '<div class="picker__item' + (i === 0 ? ' is-open' : '') + '" data-key="' + f.key + '">' +
            '<button class="picker__row" type="button"><span class="picker__label">' + f.label + '</span>' +
            '<span class="picker__value"><span class="picker__out">' + rowVal(s.profile, f) + '</span>' + ui.icon('i-chevron-right', 'picker__chev') + '</span></button>' +
            '<div class="picker__panel"><div class="picker__band"></div><div class="picker__drum" data-min="' + f.min + '" data-max="' + f.max + '" data-unit="' + f.unit + '"><div class="picker__list"></div></div></div>' +
            '</div>';
        }).join('') + '</div>' +
        '<div class="group"><h2 class="txt-section">how active are you day-to-day?</h2><div class="choice-stack">' +
          ACT.map(function (a) {
            var sel = s.profile.activity === a[0] ? ' is-selected' : '';
            return '<label class="choice-card choice-card--compact' + sel + '"><input class="choice-card__input" type="radio" name="activity" value="' + a[0] + '"' + (sel ? ' checked' : '') + '>' +
              '<span class="choice-card__surface"><span class="choice-card__label">' + a[1] + '</span>' + ui.icon('i-check', 'choice-card__check') + '</span></label>';
          }).join('') +
        '</div></div>' +
        '</div><div class="screen__footer"><a class="btn btn--primary btn--block" data-nav="' + (fromProfile ? 'profile' : 'your-budget') + '" href="#' + (fromProfile ? 'profile' : 'your-budget') + '">' + (fromProfile ? 'done' : 'continue') + '</a></div></main>';
    },
    mount: function (s, store) {
      document.querySelectorAll('.picker__item').forEach(function (item) {
        var key = item.dataset.key;
        var drum = item.querySelector('.picker__drum');
        var list = item.querySelector('.picker__list');
        var unit = drum.dataset.unit;
        var min = +drum.dataset.min, max = +drum.dataset.max;
        var cur = store.get().profile[key];
        for (var n = min; n <= max; n++) {
          var o = document.createElement('div');
          o.className = 'picker__opt' + (n === cur ? ' is-current' : '');
          o.dataset.n = n; o.textContent = n; list.appendChild(o);
        }
        // centre the current value deterministically; suppress the snap the
        // programmatic scroll would fire — viewing/opening must NOT mutate state
        var suppress = false;
        function center() {
          var el = list.querySelector('.is-current');
          if (!el) return;
          suppress = true;
          drum.scrollTop = el.offsetTop - (drum.clientHeight - el.offsetHeight) / 2;
          setTimeout(function () { suppress = false; }, 80);
        }
        if (item.classList.contains('is-open')) requestAnimationFrame(center);

        item.querySelector('.picker__row').addEventListener('click', function () {
          var wasOpen = item.classList.contains('is-open');
          document.querySelectorAll('.picker__item').forEach(function (i) { i.classList.remove('is-open'); });
          if (!wasOpen) { item.classList.add('is-open'); requestAnimationFrame(center); }
        });

        var snapT;
        drum.addEventListener('scroll', function () {
          if (suppress) return;                          // ignore the centering scroll — only USER scrolls snap
          clearTimeout(snapT);
          snapT = setTimeout(function () {
            var mid = drum.scrollTop + drum.clientHeight / 2;
            var opts = list.children, best = null, bestD = Infinity;
            for (var i = 0; i < opts.length; i++) {
              var c = opts[i].offsetTop + opts[i].offsetHeight / 2;
              var d = Math.abs(c - mid); if (d < bestD) { bestD = d; best = opts[i]; }
            }
            if (!best) return;
            list.querySelectorAll('.is-current').forEach(function (e) { e.classList.remove('is-current'); });
            best.classList.add('is-current');
            var val = +best.dataset.n;
            var patch = {}; patch[key] = val; store.setProfileQuiet(patch);   // no re-render: keeps the open drum + scroll position
            item.querySelector('.picker__out').textContent = val + unit;       // reflect the value in the row label
          }, 90);
        });
      });
      document.querySelectorAll('input[name="activity"]').forEach(function (r) {
        r.addEventListener('change', function () { store.setProfileQuiet({ activity: r.value }); });   // :checked shows selection; no re-render
      });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
