/* home-carousel.js — app carousel for Mini Forge Dev homepage */
(function () {
  "use strict";

  var carousel = document.querySelector(".app-carousel");
  if (!carousel) return;

  var slides = carousel.querySelectorAll(".app-slide");
  var dots   = carousel.querySelectorAll(".carousel-dot");
  var prev   = carousel.querySelector(".carousel-prev");
  var next   = carousel.querySelector(".carousel-next");

  if (!slides.length) return;

  var current = 0;
  var total   = slides.length;
  var timer   = null;
  var DELAY   = 5000;

  function goTo(idx) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    dots[current].setAttribute("aria-selected", "false");

    current = (idx + total) % total;

    slides[current].classList.add("active");
    dots[current].classList.add("active");
    dots[current].setAttribute("aria-selected", "true");
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(function () { goTo(current + 1); }, DELAY);
  }

  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  if (prev) {
    prev.addEventListener("click", function () { goTo(current - 1); startTimer(); });
  }
  if (next) {
    next.addEventListener("click", function () { goTo(current + 1); startTimer(); });
  }

  for (var i = 0; i < dots.length; i++) {
    (function (dot, idx) {
      dot.addEventListener("click", function () { goTo(idx); startTimer(); });
      dot.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { dots[(idx + 1) % total].focus(); }
        if (e.key === "ArrowLeft")  { dots[(idx - 1 + total) % total].focus(); }
      });
    })(dots[i], i);
  }

  /* Pause auto-play on hover/focus so users can read without interruption */
  carousel.addEventListener("mouseenter", stopTimer);
  carousel.addEventListener("mouseleave", startTimer);
  carousel.addEventListener("focusin",    stopTimer);
  carousel.addEventListener("focusout",   startTimer);

  /* Respect user preference for reduced motion */
  var noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!noMotion) { startTimer(); }
})();
