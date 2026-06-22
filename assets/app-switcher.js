/* app-switcher.js — shared app tab switcher for Mini Forge Dev */
(function () {
  "use strict";

  function initSwitcher(container) {
    var tabs   = container.querySelectorAll(".app-tab[data-app]");
    var panels = container.querySelectorAll(".app-policy[data-app-panel]");
    if (!tabs.length || !panels.length) return;

    var appIds = [];
    for (var i = 0; i < tabs.length; i++) {
      appIds.push(tabs[i].getAttribute("data-app"));
    }

    function hashApp() {
      var h = window.location.hash.replace("#", "");
      return appIds.indexOf(h) !== -1 ? h : appIds[0];
    }

    function activate(appId) {
      for (var i = 0; i < tabs.length; i++) {
        var match = tabs[i].getAttribute("data-app") === appId;
        tabs[i].classList.toggle("active", match);
        tabs[i].setAttribute("aria-selected", String(match));
        tabs[i].setAttribute("tabindex", match ? "0" : "-1");
      }
      for (var j = 0; j < panels.length; j++) {
        panels[j].classList.toggle("active", panels[j].getAttribute("data-app-panel") === appId);
      }
    }

    /* Adding switcher-ready causes CSS to hide inactive panels */
    container.classList.add("switcher-ready");
    activate(hashApp());

    (function attachTabListeners() {
      for (var i = 0; i < tabs.length; i++) {
        (function (tab, idx) {
          tab.addEventListener("click", function () {
            var id = tab.getAttribute("data-app");
            history.pushState(null, "", "#" + id);
            activate(id);
          });

          tab.addEventListener("keydown", function (e) {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
              e.preventDefault();
              tabs[(idx + 1) % tabs.length].focus();
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
              e.preventDefault();
              tabs[(idx - 1 + tabs.length) % tabs.length].focus();
            }
          });
        })(tabs[i], i);
      }
    })();

    window.addEventListener("hashchange", function () {
      activate(hashApp());
    });
  }

  var containers = document.querySelectorAll(".app-switcher-container");
  for (var i = 0; i < containers.length; i++) {
    initSwitcher(containers[i]);
  }
})();
