(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var store = window.Noted.state.createStore();
    window.Noted.store = store;
    window.Noted.router.start(store);
  });
})();
