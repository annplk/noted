(function (root) {
  'use strict';
  var ui = root.Noted.ui, E = root.Noted.estimate;
  root.Noted.views = root.Noted.views || {};
  root.Noted.views.describe = {
    render: function (s) {
      var hasText = (s.describeDraft || '').trim().length > 0;
      return ui.backHeader('describe', 'home') +
        '<main class="screen"><div class="screen__body">' +
          '<p class="txt-caption describe__lead">describe it in plain words — we\'ll do the rounding</p>' +
          '<div class="describe describe--expanded">' +
            '<textarea class="describe__field" id="describe-field" rows="3" aria-label="describe your meal" placeholder="a big bowl of veggie pasta with extra parmesan">' + (s.describeDraft || '') + '</textarea>' +
            '<div class="describe__tools">' +
              '<button class="describe__icon" type="button" aria-label="add a photo">' + ui.icon('i-camera') + '</button>' +
              '<button class="describe__icon" type="button" aria-label="scan a barcode">' + ui.icon('i-barcode') + '</button>' +
              '<span class="describe__tools-spacer"></span>' +
              '<button class="describe__icon" type="button" aria-label="dictate">' + ui.icon('i-mic') + '</button>' +
            '</div>' +
          '</div>' +
        '</div><div class="screen__footer">' +
          '<button class="btn btn--primary btn--block' + (hasText ? '' : ' is-disabled') + '" id="estimate-btn"' + (hasText ? '' : ' disabled') + '>estimate</button>' +
        '</div></main>';
    },
    mount: function (s, store) {
      var field = document.getElementById('describe-field');
      var btn = document.getElementById('estimate-btn');
      field.addEventListener('input', function () {
        store.setDraft(field.value);
        var on = field.value.trim().length > 0;
        btn.disabled = !on; btn.classList.toggle('is-disabled', !on);
      });
      btn.addEventListener('click', function () { if (!btn.disabled) store.navigate('ai-result', { estimate: E.generate() }); });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
