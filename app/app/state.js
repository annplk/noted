(function (root) {
  'use strict';
  var budget = root.Noted.budget;

  function initial() {
    // demo seed — the onboarding flow overwrites these via setProfile(); the SPA
    // never persists, so a reload returns to exactly this state. budget is derived
    // from the seed body so the two can't drift apart.
    var profile = {
      goal: 'lose', age: 29, weightKg: 62, heightCm: 168, activity: 'fair',
      diet: new Set(['vegetarian']), avoid: new Set(['peanuts']), nudges: true
    };
    profile.budget = budget.computeBudget(profile);
    return {
      route: 'welcome',
      previousRoute: null,                              // where we came from (for back headers / contextual CTAs)
      profile: profile,
      today: { meals: [], expanded: false },
      selectedRecipeId: null,
      describeDraft: '',
      estimate: null                                    // the last "AI" estimate (set on Estimate, read by ai-result)
    };
  }

  function createStore() {
    var state = initial();
    var subs = [];
    var uid = 0;                                         // per-store, so meal ids are deterministic
    function notify() { subs.forEach(function (fn) { fn(state); }); }
    return {
      get: function () { return state; },
      subscribe: function (fn) { subs.push(fn); return function () { var i = subs.indexOf(fn); if (i !== -1) subs.splice(i, 1); }; },
      set: function (patch) { Object.assign(state, patch); notify(); },
      reset: function () { state = initial(); notify(); },
      navigate: function (route, extra) { if (route !== state.route) state.previousRoute = state.route; state.route = route; if (extra) Object.assign(state, extra); notify(); },
      logMeal: function (meal) {
        state.today.meals.unshift({
          id: 'm' + (++uid), time: meal.time || nowLabel(),
          name: meal.name, kcal: meal.kcal, items: meal.items || [], macros: meal.macros
        });
        notify();
      },
      toggleExpand: function () { state.today.expanded = !state.today.expanded; notify(); },
      setProfile: function (patch) {
        Object.assign(state.profile, patch);
        state.profile.budget = budget.computeBudget(state.profile);
        notify();
      },
      setProfileQuiet: function (patch) {   // picker live-scroll: update + recompute budget, NO notify (keeps the open drum)
        Object.assign(state.profile, patch);
        state.profile.budget = budget.computeBudget(state.profile);
      },
      setBudget: function (n) { state.profile.budget = budget.round50(n); notify(); },
      toggleDiet: function (k) { toggleSet(state.profile.diet, k); notify(); },
      toggleAvoid: function (k) { toggleSet(state.profile.avoid, k); notify(); },
      setNudges: function (on) { state.profile.nudges = !!on; notify(); },
      setDraft: function (t) { state.describeDraft = t; },          // no notify: live typing
      selectRecipe: function (id) { state.selectedRecipeId = id; notify(); }
    };
  }

  function toggleSet(set, k) { if (set.has(k)) set.delete(k); else set.add(k); }
  function nowLabel() {
    var d = new Date(), h = d.getHours(), m = d.getMinutes();
    var ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12;
    return 'today · ' + h + ':' + (m < 10 ? '0' + m : m) + ' ' + ap;
  }

  root.Noted = root.Noted || {};
  root.Noted.state = { createStore: createStore, initial: initial };
})(typeof window !== 'undefined' ? window : globalThis);
