(function (root) {
  'use strict';
  var ui = root.Noted.ui, steps = root.Noted.steps;
  root.Noted.views = root.Noted.views || {};
  root.Noted.views['your-budget'] = {
    render: function (s) {
      var fromProfile = s.previousRoute === 'profile';   // reached as an editor from profile, vs. the onboarding step
      return (fromProfile ? ui.backHeader('budget', 'profile') : '') +
        '<main class="screen"><div class="screen__body">' + (fromProfile ? '' : steps(3)) +
        '<h1 class="txt-title">here\'s your daily budget</h1>' +
        '<div class="col-center"><div class="budget-edit">' +
          '<div class="budget-edit__display" id="be-display"><span class="estimate estimate--hero"><span class="estimate__value">' + ui.approx(s.profile.budget) + '</span></span>' +
          '<span class="budget-edit__hint">tap to change</span></div>' +
          '<div class="budget-edit__field" id="be-field"><input class="field__input" id="be-input" type="number" inputmode="numeric" value="' + s.profile.budget + '">' +
          '<button class="btn btn--secondary" type="button" id="be-save">save</button></div>' +
        '</div></div>' +
        '<p class="lede center-text">worked out from what you told us. it\'s yours to change, anytime.</p>' +
        '</div><div class="screen__footer"><a class="btn btn--primary btn--block" data-nav="' + (fromProfile ? 'profile' : 'preferences') + '" href="#' + (fromProfile ? 'profile' : 'preferences') + '">' + (fromProfile ? 'done' : 'looks good') + '</a></div></main>';
    },
    mount: function (s, store) {
      var disp = document.getElementById('be-display'), field = document.getElementById('be-field');
      disp.addEventListener('click', function () { disp.style.display = 'none'; field.style.display = 'flex'; document.getElementById('be-input').focus(); });
      document.getElementById('be-save').addEventListener('click', function () {
        store.setBudget(+document.getElementById('be-input').value || s.profile.budget);  // re-render restores display
      });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
