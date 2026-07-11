/* theme.js — theme toggle for Mini Forge Dev.
   The initial theme is applied by a tiny inline script in each page's <head>
   (before CSS paints) so there is no light/dark flash. This file only wires
   the visible toggle control and keeps the choice in localStorage. */
(function () {
  "use strict";

  var STORAGE_KEY = "mfd-theme";
  var META_COLOR = { dark: "#0C0E13", light: "#F6F5F2" };

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* Private browsing or blocked storage — theme still applies this page. */
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", META_COLOR[theme]);
    syncToggles(theme);
  }

  function syncToggles(theme) {
    var toggles = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < toggles.length; i++) {
      var btn = toggles[i];
      var isLight = theme === "light";
      /* aria-pressed=true means "light theme on"; label announces the action. */
      btn.setAttribute("aria-pressed", String(isLight));
      btn.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
      btn.setAttribute("title", isLight ? "Switch to dark theme" : "Switch to light theme");
      var label = btn.querySelector("[data-theme-label]");
      if (label) label.textContent = isLight ? "Light" : "Dark";
    }
  }

  function onToggleClick() {
    applyTheme(currentTheme() === "light" ? "dark" : "light");
  }

  function init() {
    var toggles = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].addEventListener("click", onToggleClick);
    }
    /* Sync controls and browser chrome color without persisting a choice
       the visitor has not made yet. */
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", META_COLOR[currentTheme()]);
    syncToggles(currentTheme());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
