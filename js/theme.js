/* ============================================
   Digital Shadow — Theme Toggle
   Dark/Light mode with localStorage
   ============================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'ds-theme';
  var html = document.documentElement;
  var toggleBtn = document.getElementById('themeToggle');

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
    updateIcon(theme);
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  function updateIcon(theme) {
    if (!toggleBtn) return;
    var icon = toggleBtn.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }

  var stored = getStoredTheme();
  if (stored) {
    html.setAttribute('data-theme', stored);
    updateIcon(stored);
  } else {
    updateIcon('dark');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var current = html.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }
})();
