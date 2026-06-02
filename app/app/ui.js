(function (root) {
  'use strict';
  function icon(id, cls) { return '<svg class="icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function approx(n) { return '<span class="estimate__approx">≈</span>' + n.toLocaleString('en-US'); }

  function brandHeader(title) {
    return '<div class="header header--brand">' +
      '<svg class="title-mark" role="img" aria-label="noted"><use href="#tomato-o"/></svg>' +
      '<h1 class="header__title">' + title + '</h1></div>';
  }
  function backHeader(title, backRoute) {
    return '<div class="topbar"><div class="header">' +
      '<a class="header__back" data-nav="' + backRoute + '" href="#' + backRoute + '" aria-label="back">' + icon('i-back') + '</a>' +
      (title ? '<h1 class="header__title">' + title + '</h1>' : '') + '</div></div>';
  }

  var TABS = [
    { id: 'home', route: 'home', icon: 'i-home', label: 'home' },
    { id: 'search', route: 'describe', icon: 'i-search', label: 'search' },
    { id: 'recipes', route: 'recipe-feed', icon: 'i-recipes', label: 'recipes' },
    { id: 'profile', route: 'profile', icon: 'i-profile', label: 'profile' }
  ];
  function tabBar(activeId) {
    return '<nav class="tabbar tabbar--tight">' + TABS.map(function (t) {
      return '<a class="tab' + (t.id === activeId ? ' is-active' : '') + '" data-nav="' + t.route + '" href="#' + t.route + '">' +
        '<span class="tab__icon">' + icon(t.icon) + '</span>' +
        '<span class="tab__label">' + t.label + '</span></a>';
    }).join('') + '</nav>';
  }

  root.Noted = root.Noted || {};
  root.Noted.ui = { icon: icon, approx: approx, brandHeader: brandHeader, backHeader: backHeader, tabBar: tabBar };
})(typeof window !== 'undefined' ? window : globalThis);
