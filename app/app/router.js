(function (root) {
  'use strict';
  var store = null;
  var TABBAR_ROUTES = { home: 1, 'recipe-feed': 1, profile: 1 };

  function viewFor(route) { return (root.Noted.views || {})[route]; }

  function render() {
    var state = store.get();
    var view = viewFor(state.route) || root.Noted.views.welcome;
    var app = document.getElementById('app');
    app.innerHTML = view.render(state);
    if (view.mount) view.mount(state, store);
    // tab-bar screens share the white surface down to the home indicator
    document.getElementById('home-indicator').classList.toggle('on-tabbar', !!TABBAR_ROUTES[state.route]);
    app.scrollTop = 0;
  }

  function start(theStore) {
    store = theStore;
    store.subscribe(render);
    // delegate in-app navigation
    document.getElementById('app').addEventListener('click', function (e) {
      var nav = e.target.closest('[data-nav]');
      if (nav) { e.preventDefault(); store.navigate(nav.getAttribute('data-nav')); }
    });
    // reload always resets to welcome (in-memory state); ignore any inbound hash
    if (location.hash) history.replaceState(null, '', location.pathname);
    render();
  }

  root.Noted = root.Noted || {};
  root.Noted.router = { start: start };   // render is internal (needs an active store)
})(typeof window !== 'undefined' ? window : globalThis);
