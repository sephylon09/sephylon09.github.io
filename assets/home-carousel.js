/* home-carousel.js — center-focused coverflow carousel */
(function () {
  'use strict';

  var carousel = document.querySelector('.coverflow-carousel');
  if (!carousel) return;

  var viewport = carousel.querySelector('.carousel-viewport');
  var cards    = Array.from(carousel.querySelectorAll('.carousel-card'));
  var dots     = Array.from(carousel.querySelectorAll('.carousel-dot'));
  var prevBtn  = carousel.querySelector('.carousel-prev');
  var nextBtn  = carousel.querySelector('.carousel-next');

  if (!cards.length) return;

  var n         = cards.length;
  var current   = 0;
  var autoTimer = null;
  var AUTO_DELAY = 5000;

  /* Scale and opacity of the two visible side cards */
  var SIDE_SCALE   = 0.82;
  var SIDE_OPACITY = 0.50;

  /* How many px of a side card peek in from each edge */
  var PEEK_PX = 72;

  var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Geometry ───────────────────────────────────────── */

  function cardWidth() {
    return cards[0].offsetWidth;
  }

  function viewportWidth() {
    return viewport.offsetWidth;
  }

  /*
   * Offset (px) to shift a side card's center away from the viewport center
   * so that exactly PEEK_PX of its scaled width is visible at the edge.
   *
   * side_card_visual_half = cardWidth * SIDE_SCALE / 2
   * side_card_center_from_left = PEEK_PX - side_card_visual_half  (for prev, it would be at the left)
   * that is negative (off-screen), so:
   * side_card_center_from_viewport_center = PEEK_PX - side_card_visual_half - viewportWidth/2
   * sideOffset = |that| (positive; negate for prev, positive for next)
   */
  function sideOffset() {
    var half = (cardWidth() * SIDE_SCALE) / 2;
    return Math.abs(PEEK_PX - half - viewportWidth() / 2);
  }

  /* ── Layout ─────────────────────────────────────────── */

  function applyLayout(animate) {
    var offset = sideOffset();

    cards.forEach(function (card, i) {
      /* Normalize diff so it's in the range [-floor(n/2), +ceil(n/2)] */
      var diff = ((i - current) % n + n) % n;
      if (diff > Math.floor(n / 2)) diff -= n;

      var tx, scale, opacity, zIndex, pEvents, cls;

      if (diff === 0) {
        tx = 0; scale = 1; opacity = 1; zIndex = 2; pEvents = 'auto'; cls = 'is-active';
      } else if (diff === -1 || diff === -(n - 1)) {
        tx = -offset; scale = SIDE_SCALE; opacity = SIDE_OPACITY; zIndex = 1; pEvents = 'auto'; cls = 'is-prev';
      } else if (diff === 1 || diff === (n - 1)) {
        tx = +offset; scale = SIDE_SCALE; opacity = SIDE_OPACITY; zIndex = 1; pEvents = 'auto'; cls = 'is-next';
      } else {
        /* Hidden — park off-screen in the correct direction */
        tx = diff < 0 ? -(offset * 2) : (offset * 2);
        scale = SIDE_SCALE * 0.85; opacity = 0; zIndex = 0; pEvents = 'none'; cls = 'is-hidden';
      }

      var trans = (animate && !noMotion)
        ? 'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.45s ease'
        : 'none';

      card.style.transition  = trans;
      card.style.transform   = 'translateX(calc(-50% + ' + tx + 'px)) scale(' + scale + ')';
      card.style.opacity     = opacity;
      card.style.zIndex      = zIndex;
      card.style.pointerEvents = pEvents;
      card.setAttribute('aria-hidden', String(diff !== 0));

      card.classList.remove('is-active', 'is-prev', 'is-next', 'is-hidden');
      card.classList.add(cls);
    });

    /* Sync dots */
    dots.forEach(function (dot, i) {
      var active = i === current;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', String(active));
      dot.setAttribute('tabindex', active ? '0' : '-1');
    });

    /* Keep arrows vertically centred on the active card */
    var h = cards[current].offsetHeight;
    if (h > 0) {
      viewport.style.height = (h + 16) + 'px';
      carousel.style.setProperty('--vp-height', (h + 16) + 'px');
    }
  }

  /* ── Navigation ─────────────────────────────────────── */

  function goTo(idx) {
    current = ((idx % n) + n) % n;
    applyLayout(true);
  }

  function startAuto() {
    if (noMotion) return;
    stopAuto();
    autoTimer = setInterval(function () { goTo(current + 1); }, AUTO_DELAY);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  /* ── Controls ───────────────────────────────────────── */

  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); startAuto(); });

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); startAuto(); });
  });

  /* Click a side card to bring it to centre */
  cards.forEach(function (card, i) {
    card.addEventListener('click', function (e) {
      if (i !== current && !e.target.closest('a, button, [role="button"]')) {
        e.preventDefault();
        goTo(i);
        startAuto();
      }
    });
  });

  /* Keyboard: left/right arrows when carousel is focused */
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); startAuto(); }
  });

  /* ── Drag / swipe ───────────────────────────────────── */

  var drag = null;
  var DRAG_THRESHOLD = 48;

  function dragStart(clientX) {
    drag = { startX: clientX, moved: false };
    stopAuto();
    /* Remove transition so dragging feels instant */
    if (!noMotion) {
      cards.forEach(function (c) { c.style.transition = 'none'; });
    }
  }

  function dragMove(clientX) {
    if (!drag) return;
    if (Math.abs(clientX - drag.startX) > 6) drag.moved = true;
  }

  function dragEnd(clientX) {
    if (!drag) return;
    var dx = clientX - drag.startX;
    if (drag.moved && Math.abs(dx) >= DRAG_THRESHOLD) {
      goTo(dx < 0 ? current + 1 : current - 1);
    } else {
      applyLayout(true); /* snap back if swipe too short */
    }
    drag = null;
    startAuto();
  }

  viewport.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    dragStart(e.clientX);
  });
  window.addEventListener('mousemove', function (e) { dragMove(e.clientX); });
  window.addEventListener('mouseup',   function (e) { dragEnd(e.clientX); });

  viewport.addEventListener('touchstart', function (e) {
    dragStart(e.touches[0].clientX);
  }, { passive: true });

  viewport.addEventListener('touchmove', function (e) {
    if (drag && drag.moved) e.preventDefault();
    dragMove(e.touches[0].clientX);
  }, { passive: false });

  viewport.addEventListener('touchend', function (e) {
    dragEnd(e.changedTouches[0].clientX);
  });

  /* Pause auto-play while hovering or focused inside the carousel */
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('focusin',    stopAuto);
  carousel.addEventListener('focusout',   startAuto);

  /* Recalculate positions on resize */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { applyLayout(false); }, 120);
  });

  /* ── Init ───────────────────────────────────────────── */

  /* First frame: position all cards without animation so the page
     doesn't flash. Second frame: measure the active card height and
     then start the auto-timer. */
  requestAnimationFrame(function () {
    applyLayout(false);
    requestAnimationFrame(function () {
      applyLayout(false); /* re-measure after paint */
      startAuto();
    });
  });

})();
