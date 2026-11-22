/* Lightbox: klik gambar mana pun (.js-zoom) untuk melihatnya ukuran penuh */
(function () {
  var box = document.getElementById("lightbox");
  if (!box) return;
  var imgEl = document.getElementById("lightboxImg");
  var capEl = document.getElementById("lightboxCaption");
  var counterEl = document.getElementById("lightboxCounter");
  var items = [];
  var index = 0;

  function srcOf(el) {
    return el.getAttribute("data-img") || el.getAttribute("src");
  }
  function capOf(el) {
    return el.getAttribute("data-caption") || el.getAttribute("alt") || "";
  }

  function groupOf(el) {
    var scope =
      el.closest(".modal-content") || el.closest(".project-card") || document;
    return Array.prototype.slice.call(scope.querySelectorAll(".js-zoom"));
  }

  function render() {
    if (!items.length) return;
    var current = items[index];
    imgEl.src = current.src;
    imgEl.alt = current.caption || "Enlarged image";
    capEl.textContent = current.caption;
    counterEl.textContent = index + 1 + " / " + items.length;
    var multiple = items.length > 1;
    box.querySelectorAll(".lightbox-nav").forEach(function (btn) {
      btn.style.display = multiple ? "inline-flex" : "none";
    });
    counterEl.style.display = multiple ? "block" : "none";
  }

  function open(list, startAt) {
    items = list;
    index = startAt || 0;
    render();
    box.classList.add("open");
    document.body.classList.add("lightbox-open");
  }

  function close() {
    box.classList.remove("open");
    document.body.classList.remove("lightbox-open");
    imgEl.removeAttribute("src");
  }

  function step(dir) {
    if (items.length < 2) return;
    index = (index + dir + items.length) % items.length;
    render();
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest(".js-zoom");
    if (!trigger) return;
    e.preventDefault();
    e.stopPropagation();
    var els = groupOf(trigger);
    var list = els
      .map(function (el) {
        return { src: srcOf(el), caption: capOf(el) };
      })
      .filter(function (o) {
        return o.src;
      });
    var start = 0;
    for (var i = 0; i < els.length; i++) {
      if (els[i] === trigger) {
        start = i;
        break;
      }
    }
    open(list, start);
  });

  box.querySelector(".lightbox-close").addEventListener("click", close);
  box
    .querySelector(".lightbox-nav.prev")
    .addEventListener("click", function (e) {
      e.stopPropagation();
      step(-1);
    });
  box
    .querySelector(".lightbox-nav.next")
    .addEventListener("click", function (e) {
      e.stopPropagation();
      step(1);
    });
  box.addEventListener("click", function (e) {
    if (
      e.target === box ||
      e.target.classList.contains("lightbox-img-wrap") ||
      e.target.id === "lightboxImg"
    ) {
      close();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") {
      close();
    }
    if (e.key === "ArrowRight") {
      step(1);
    }
    if (e.key === "ArrowLeft") {
      step(-1);
    }
  });
})();
