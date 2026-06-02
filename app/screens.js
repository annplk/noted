/* ==========================================================================
   Noted — screens chrome: scale the mock device to fit the window.

   Presentation scaffolding only, NOT product logic: the screens keep their true
   390×844 layout; this just renders the whole device smaller so it's fully
   visible without a page scroll. The first (and only) sanctioned JS in the
   project, and — like the bezel, status bar and home indicator — it touches the
   device chrome, never the product UI.
   ========================================================================== */
(function () {
  var MARGIN = 32;                                       /* breathing room around the device */
  var fullBleed = window.matchMedia('(max-width: 430px)');

  function fit() {
    var phone = document.querySelector('.phone');
    if (!phone) return;

    if (fullBleed.matches) {                             /* real phone: full-bleed, never scale */
      phone.style.removeProperty('--phone-scale');
      return;
    }

    /* offsetWidth/Height report the *unscaled* layout box (CSS transforms don't
       affect them), so the measurement is stable no matter the current scale. */
    var w = phone.offsetWidth;
    var h = phone.offsetHeight;
    var scale = Math.min(
      1,
      (window.innerHeight - MARGIN) / h,
      (window.innerWidth  - MARGIN) / w
    );
    phone.style.setProperty('--phone-scale', scale);
  }

  window.addEventListener('resize', fit);
  if (fullBleed.addEventListener) fullBleed.addEventListener('change', fit);
  fit();
})();
