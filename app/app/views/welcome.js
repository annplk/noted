(function (root) {
  'use strict';
  root.Noted = root.Noted || {}; root.Noted.views = root.Noted.views || {};
  root.Noted.views.welcome = {
    render: function () {
      return '' +
        '<main class="screen screen--center welcome">' +
          '<a class="splash-link" data-nav="goal" href="#goal" aria-label="tap to continue"></a>' +
          '<div class="welcome__stage">' +
            '<svg class="welcome__tomato" aria-hidden="true"><use href="#tomato-o"/></svg>' +
            '<span class="wordmark welcome__mark" role="img" aria-label="Noted">N<svg class="tomato-o" aria-hidden="true"><use href="#tomato-o"/></svg>ted</span>' +
          '</div>' +
          '<p class="txt-section welcome__tag">honest about what you ate.</p>' +
        '</main>';
    },
    mount: function (state, store) {
      // auto-advance after the animation. A tap navigates via the splash-link's
      // data-nav; the route guard below is the real safety, this just tidies the timer.
      var t = setTimeout(function () { if (store.get().route === 'welcome') store.navigate('goal'); }, 2600);
      document.querySelector('.splash-link').addEventListener('click', function () { clearTimeout(t); });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
