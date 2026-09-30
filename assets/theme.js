// Theme: light by default, dark only when the visitor picks it with the toggle. Loaded in <head> so the choice applies before first paint.
(function () {
  var root = document.documentElement, KEY = 'theme';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* storage blocked: stay light */ }
  root.dataset.theme = saved === 'dark' ? 'dark' : 'light';

  var MOON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M20.4 14.6A8.5 8.5 0 0 1 9.4 3.6a.7.7 0 0 0-.9-.9 9.9 9.9 0 1 0 12.8 12.8.7.7 0 0 0-.9-.9z"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M5.3 18.7l1.5-1.5M17.2 6.8l1.5-1.5"/></svg>';

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    var render = function () {
      var dark = root.dataset.theme === 'dark';
      btn.innerHTML = dark ? SUN : MOON;
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.title = dark ? 'Light mode' : 'Dark mode';
      btn.setAttribute('aria-pressed', dark);
    };
    btn.hidden = false;
    render();
    btn.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, root.dataset.theme); } catch (e) { /* not persisted */ }
      render();
      document.dispatchEvent(new CustomEvent('themechange', { detail: root.dataset.theme }));
    });
  });
})();
