/* ==========================================================================
   Ryan Yang Photography — gallery.js
   Handles: category filtering + the lightbox (open / close / prev / next).
   No dependencies. Cards are plain <figure class="card"> elements marked
   with data-category, data-title and data-location attributes.
   ========================================================================== */

(function () {
  "use strict";

  var cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));

  /* ---------------- Filtering ---------------- */

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var cat = chip.getAttribute("data-filter");

      chips.forEach(function (c) { c.classList.toggle("chip--active", c === chip); });

      cards.forEach(function (card) {
        var show = cat === "all" || card.getAttribute("data-category") === cat;
        card.classList.toggle("card--hidden", !show);
      });
    });
  });

  /* ---------------- Lightbox ---------------- */

  var lightbox = document.getElementById("lightbox");
  if (!lightbox) return; // about.html has no gallery

  var lbImg      = lightbox.querySelector("img");
  var lbTitle    = lightbox.querySelector(".lightbox__title");
  var lbLocation = lightbox.querySelector(".lightbox__location");
  var current    = -1;

  function visibleCards() {
    return cards.filter(function (c) { return !c.classList.contains("card--hidden"); });
  }

  function openAt(card) {
    var img = card.querySelector("img");
    current = visibleCards().indexOf(card);
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbTitle.textContent = card.getAttribute("data-title");
    lbLocation.textContent = card.getAttribute("data-location");
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden"; // stop the page scrolling behind
  }

  function close() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    current = -1;
  }

  function step(dir) {
    var list = visibleCards();
    if (!list.length) return;
    openAt(list[(current + dir + list.length) % list.length]);
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function () { openAt(card); });
  });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close(); // click on the dark backdrop
  });
  lightbox.querySelector(".lightbox__close").addEventListener("click", close);
  lightbox.querySelector(".lightbox__nav--prev").addEventListener("click", function () { step(-1); });
  lightbox.querySelector(".lightbox__nav--next").addEventListener("click", function () { step(1); });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape")     close();
    if (e.key === "ArrowLeft")  step(-1);
    if (e.key === "ArrowRight") step(1);
  });
})();
