/* app-renderer.js — renders app cards, app selectors, and footer app links
   from the shared metadata in apps-data.js, and drives the privacy/support
   app switcher (hash navigation, keyboard support, accordion deep links).

   Without JavaScript the pages stay usable: the home page shows a <noscript>
   app list, and the privacy/support pages show every panel stacked. */
(function () {
  "use strict";

  var APPS = window.MFD_APPS || [];
  if (!APPS.length) return;

  /* ── Small DOM helpers ─────────────────────────────── */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function icon(app, size, lazy) {
    var img = document.createElement("img");
    img.src = app.optimizedLogo;
    img.alt = "";
    img.width = size;
    img.height = size;
    img.decoding = "async";
    if (lazy) img.loading = "lazy";
    return img;
  }

  function findApp(id) {
    for (var i = 0; i < APPS.length; i++) {
      if (APPS[i].id === id) return APPS[i];
    }
    return null;
  }

  /* ── Home page: app directory ──────────────────────── */

  var PLAY_ICON =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M4.1 2.4a1.6 1.6 0 0 0-.6 1.3v16.6c0 .53.23 1 .6 1.3l9.35-9.6L4.1 2.4z"/>' +
    '<path d="M15.6 10.5 5.9 1.9c.3-.1.66-.06 1 .13l11.05 6.3-2.35 2.17z" opacity="0.85"/>' +
    '<path d="m15.6 13.5 2.35 2.17L6.9 21.97c-.34.19-.7.23-1 .13l9.7-8.6z" opacity="0.85"/>' +
    '<path d="m18.9 9-2.1 2 2.1 2 2.5-1.43c.8-.46.8-1.68 0-2.14L18.9 9z" opacity="0.7"/>' +
    "</svg>";

  function buildCard(app) {
    var card = el("article", "app-card");
    card.id = "app-" + app.id;

    var top = el("div", "app-card-top");
    top.appendChild(icon(app, 56, true));

    var identity = el("div", "app-card-id");
    identity.appendChild(el("h3", "app-card-name", app.name));
    identity.appendChild(el("p", "app-card-category", app.category));
    top.appendChild(identity);
    card.appendChild(top);

    card.appendChild(el("p", "app-card-desc", app.description));

    var actions = el("div", "app-card-actions");
    if (app.status === "published" && app.playUrl) {
      var play = el("a", "btn btn-primary btn-sm");
      play.href = app.playUrl;
      play.target = "_blank";
      play.rel = "noopener noreferrer";
      play.innerHTML = PLAY_ICON;
      play.appendChild(document.createTextNode("Google Play"));
      var sr = el("span", "sr-only", " (opens in a new tab)");
      play.appendChild(sr);
      actions.appendChild(play);
    } else {
      var soon = el("span", "app-soon-note", "In development");
      actions.appendChild(soon);
    }

    var links = el("div", "app-card-links");
    var privacy = el("a", "app-card-link", "Privacy");
    privacy.href = "privacy-policy.html#" + app.privacyHash;
    var support = el("a", "app-card-link", "Support");
    support.href = "support.html#" + app.supportHash;
    links.appendChild(privacy);
    links.appendChild(support);
    actions.appendChild(links);
    card.appendChild(actions);

    return card;
  }

  function renderGrids() {
    var grids = document.querySelectorAll("[data-app-grid]");
    if (!grids.length) return false;
    for (var i = 0; i < grids.length; i++) {
      var grid = grids[i];
      var wanted = grid.getAttribute("data-app-grid");
      grid.innerHTML = "";
      for (var j = 0; j < APPS.length; j++) {
        if (APPS[j].status === wanted) grid.appendChild(buildCard(APPS[j]));
      }
    }
    return true;
  }

  /* ── Live app counts (hero stats, group badges) ────── */

  function renderCounts() {
    var counters = document.querySelectorAll("[data-app-count]");
    for (var i = 0; i < counters.length; i++) {
      var wanted = counters[i].getAttribute("data-app-count");
      var n = 0;
      for (var j = 0; j < APPS.length; j++) {
        if (wanted === "all" || APPS[j].status === wanted) n++;
      }
      counters[i].textContent = String(n);
    }
  }

  /* ── Footer: per-app links ─────────────────────────── */

  function renderFooterApps() {
    var lists = document.querySelectorAll("[data-footer-apps]");
    for (var i = 0; i < lists.length; i++) {
      var list = lists[i];
      list.innerHTML = "";
      for (var j = 0; j < APPS.length; j++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "/#app-" + APPS[j].id;
        a.textContent = APPS[j].name;
        li.appendChild(a);
        list.appendChild(li);
      }
    }
  }

  /* ── Privacy / Support: app switcher ───────────────── */

  function openAncestorDetails(node) {
    var cur = node;
    while (cur && cur !== document.body) {
      if (cur.tagName === "DETAILS") cur.open = true;
      cur = cur.parentElement;
    }
  }

  function initSwitcher(container) {
    var selector = container.querySelector("[data-app-selector]");
    var panels = container.querySelectorAll("[data-app-panel]");
    if (!selector || !panels.length) return;

    var panelIds = [];
    for (var i = 0; i < panels.length; i++) {
      panelIds.push(panels[i].getAttribute("data-app-panel"));
    }

    /* Build one tab per panel that exists on this page */
    selector.setAttribute("role", "tablist");
    var tabs = [];
    for (var t = 0; t < panelIds.length; t++) {
      var app = findApp(panelIds[t]);
      if (!app) continue;
      var tab = el("button", "app-select-tab");
      tab.type = "button";
      tab.setAttribute("role", "tab");
      tab.setAttribute("data-app", app.id);
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
      tab.appendChild(icon(app, 32, false));
      tab.appendChild(el("span", "app-select-name", app.name));
      selector.appendChild(tab);
      tabs.push(tab);
    }
    if (!tabs.length) return;

    function activate(appId, focusTab) {
      for (var i = 0; i < tabs.length; i++) {
        var match = tabs[i].getAttribute("data-app") === appId;
        tabs[i].classList.toggle("active", match);
        tabs[i].setAttribute("aria-selected", String(match));
        tabs[i].setAttribute("tabindex", match ? "0" : "-1");
        if (match && focusTab) tabs[i].focus();
      }
      for (var j = 0; j < panels.length; j++) {
        panels[j].classList.toggle(
          "active",
          panels[j].getAttribute("data-app-panel") === appId
        );
      }
    }

    /* Resolve a location hash to an app id. The hash may be an app id
       (#letterforge) or the id of an element inside a panel (#lf-advertising). */
    function resolveHash() {
      var h = window.location.hash.replace("#", "");
      if (!h) return { app: panelIds[0], target: null };
      if (panelIds.indexOf(h) !== -1) return { app: h, target: null };
      var target = document.getElementById(h);
      if (target) {
        var panel = target.closest("[data-app-panel]");
        if (panel) {
          return { app: panel.getAttribute("data-app-panel"), target: target };
        }
      }
      return { app: panelIds[0], target: null };
    }

    function applyHash(scrollToTarget) {
      var where = resolveHash();
      activate(where.app, false);
      if (where.target) {
        openAncestorDetails(where.target);
        if (scrollToTarget) {
          where.target.scrollIntoView({ block: "start" });
        }
      }
    }

    /* Hide inactive panels only once JS is ready (CSS hooks on this class) */
    container.classList.add("switcher-ready");
    applyHash(true);

    for (var k = 0; k < tabs.length; k++) {
      (function (tab, idx) {
        tab.addEventListener("click", function () {
          var id = tab.getAttribute("data-app");
          if (history.pushState) {
            history.pushState(null, "", "#" + id);
          } else {
            window.location.hash = id;
          }
          activate(id, false);
        });
        tab.addEventListener("keydown", function (e) {
          var next = null;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            next = (idx + 1) % tabs.length;
          } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            next = (idx - 1 + tabs.length) % tabs.length;
          } else if (e.key === "Home") {
            next = 0;
          } else if (e.key === "End") {
            next = tabs.length - 1;
          }
          if (next !== null) {
            e.preventDefault();
            tabs[next].focus();
          }
        });
      })(tabs[k], k);
    }

    window.addEventListener("hashchange", function () {
      applyHash(true);
    });
  }

  /* ── Init ──────────────────────────────────────────── */

  function init() {
    var renderedGrids = renderGrids();
    renderCounts();
    renderFooterApps();

    var containers = document.querySelectorAll("[data-switcher]");
    for (var i = 0; i < containers.length; i++) {
      initSwitcher(containers[i]);
    }

    /* If the home page was opened with an #app-… deep link, the anchor only
       exists after rendering, so scroll to it now. */
    if (renderedGrids && window.location.hash) {
      var target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ block: "start" });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
