/* ============================================
   AFDAL PORTFOLIO — SCRIPT (FINAL)
   Modul:
   1. Mobile nav toggle
   2. Badge tilt 3D + liquid shine
   3. Mouse-following spotlight
   4. Scroll reveal (IntersectionObserver)
   5. Scrollspy — indikator navigasi aktif
   6. Navbar shrink saat scroll
   7. Light / Dark mode (ikut browser + transisi halus)
   8. Bahasa EN / ID (ikut browser; teks ada di js/i18n.js)
   ============================================ */

(function () {
  "use strict";

  /* ---------- Deteksi kemampuan perangkat (dipakai semua modul) ---------- */
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* ============================================
     MODUL 1 — MOBILE NAV TOGGLE
     ============================================ */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Buka menu");
  }

  navToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
  });

  navLinks.addEventListener("click", function (e) {
    if (e.target.matches(".navbar__link")) closeMenu();
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".navbar")) closeMenu();
  });


  /* ============================================
     MODUL 2 — BADGE TILT 3D + SHINE
     (hanya perangkat ber-mouse, hormati reduced motion)
     ============================================ */
  (function initBadgeTilt() {
    const hero = document.getElementById("hero");
    const badge = document.getElementById("profileBadge");
    if (!hero || !badge || !canHover || reduceMotion) return;

    const frame = badge.querySelector(".badge__frame");

    // ---- Konfigurasi ----
    const MAX_TILT = 10;   // derajat kemiringan maksimal
    const MAX_SHIFT = 10;  // px pergeseran parallax maksimal
    const EASE = 0.12;     // 0–1: makin kecil = makin halus/berat

    const target = { rx: 0, ry: 0, tx: 0, ty: 0, sx: 30, sy: 20 };
    const current = { rx: 0, ry: 0, tx: 0, ty: 0, sx: 30, sy: 20 };

    let rafId = null;
    let pointerInside = false;

    function lerp(a, b, t) { return a + (b - a) * t; }
    function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

    function render() {
      let settled = true;

      for (const key in target) {
        current[key] = lerp(current[key], target[key], EASE);
        if (Math.abs(current[key] - target[key]) > 0.01) settled = false;
      }

      frame.style.transform =
        "translate3d(" + current.tx.toFixed(2) + "px, " + current.ty.toFixed(2) + "px, 0) " +
        "rotateX(" + current.rx.toFixed(2) + "deg) " +
        "rotateY(" + current.ry.toFixed(2) + "deg)";

      frame.style.setProperty("--shine-x", current.sx.toFixed(1) + "%");
      frame.style.setProperty("--shine-y", current.sy.toFixed(1) + "%");

      if (!settled || pointerInside) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null; // loop berhenti total saat idle → hemat CPU
      }
    }

    function startLoop() {
      if (rafId === null) rafId = requestAnimationFrame(render);
    }

    hero.addEventListener("pointermove", function (e) {
      const rect = frame.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = clamp((e.clientX - cx) / (rect.width * 2), -1, 1);
      const dy = clamp((e.clientY - cy) / (rect.height * 2), -1, 1);

      target.ry = dx * MAX_TILT;
      target.rx = -dy * MAX_TILT;
      target.tx = dx * MAX_SHIFT;
      target.ty = dy * MAX_SHIFT;
      target.sx = 50 + dx * 60;
      target.sy = 35 + dy * 60;

      pointerInside = true;
      startLoop();
    });

    frame.addEventListener("pointerenter", function () {
      frame.classList.add("is-tilting");
    });

    frame.addEventListener("pointerleave", function () {
      frame.classList.remove("is-tilting");
    });

    hero.addEventListener("pointerleave", function () {
      pointerInside = false;
      target.rx = 0; target.ry = 0;
      target.tx = 0; target.ty = 0;
      target.sx = 30; target.sy = 20;
      startLoop();
    });
  })();


  /* ============================================
     MODUL 3 — MOUSE-FOLLOWING SPOTLIGHT
     Cahaya oranye halus yang mengikuti kursor.
     Hanya aktif di perangkat ber-mouse. Jika "reduced motion"
     aktif, cahaya tetap mengikuti kursor tapi tanpa easing.
     ============================================ */
  (function initSpotlight() {
    const spotlight = document.getElementById("spotlight");
    if (!spotlight || !canHover) return;

    const EASE = reduceMotion ? 1 : 0.1;   // 1 = langsung menempel ke kursor
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    let rafId = null;
    let visible = false;

    function place() {
      // translate3d → digambar GPU, tidak memicu reflow layout
      spotlight.style.transform =
        "translate3d(" + current.x.toFixed(1) + "px, " + current.y.toFixed(1) + "px, 0)";
    }

    function render() {
      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;
      place();

      const settled =
        Math.abs(current.x - target.x) < 0.5 &&
        Math.abs(current.y - target.y) < 0.5;

      rafId = settled ? null : requestAnimationFrame(render);
    }

    function hide() {
      spotlight.classList.remove("is-active");
      visible = false;
    }

    window.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;   // abaikan sentuhan di laptop layar sentuh

      target.x = e.clientX;
      target.y = e.clientY;

      if (!visible) {
        // Kemunculan pertama: langsung muncul DI kursor (tidak meluncur dari tengah layar)
        current.x = target.x;
        current.y = target.y;
        place();
        spotlight.classList.add("is-active");
        visible = true;
      }
      if (rafId === null) rafId = requestAnimationFrame(render);
    }, { passive: true });

    // Kursor keluar jendela / tab kehilangan fokus → cahaya memudar
    document.documentElement.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
  })();


  /* ============================================
     MODUL 4 — SCROLL REVEAL
     Semua elemen [data-reveal] muncul saat masuk viewport.
     data-reveal-delay="1..5" → muncul berurutan (stagger).
     ============================================ */
  (function initScrollReveal() {
    const elements = document.querySelectorAll("[data-reveal]");
    if (!elements.length) return;

    function showAll() {
      elements.forEach(function (el) { el.classList.add("is-visible"); });
    }

    // Reduced motion ATAU browser tanpa IntersectionObserver
    // → langsung tampilkan semua (fix: di mobile lama konten tak pernah muncul)
    if (reduceMotion || !("IntersectionObserver" in window)) {
      showAll();
      return;
    }

    // Pasang class .reveal lewat JS (bukan HTML) → progressive enhancement:
    // jika JS gagal dimuat, konten tetap terlihat normal.
    elements.forEach(function (el) { el.classList.add("reveal"); });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // animasi 1x saja → ringan
        }
      });
    }, {
      // FIX MOBILE: threshold 0.15 + rootMargin -40px terlalu ketat di layar
      // kecil (kartu tinggi sulit mencapai 15% di dalam root yang diperkecil).
      // Threshold rendah + margin persentase → andal di semua ukuran layar.
      threshold: 0.05,
      rootMargin: "0px 0px -8% 0px"
    });

    elements.forEach(function (el) { observer.observe(el); });

    // Jaring pengaman: jika karena viewport mobile (address bar dinamis)
    // ada elemen di layar yang belum ter-reveal, tampilkan manual.
    function revealVisibleNow() {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      elements.forEach(function (el) {
        if (el.classList.contains("is-visible")) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      });
    }

    window.addEventListener("load", revealVisibleNow);
    setTimeout(revealVisibleNow, 1000);
  })();


  /* ============================================
     MODUL 5 — SCROLLSPY (indikator navigasi aktif)
     Link navbar menyala sesuai section yang sedang dilihat.
     ============================================ */
  (function initScrollspy() {
    const links = document.querySelectorAll("[data-nav]");
    if (!links.length) return;

    // Peta: id section → link navbar
    const linkMap = {};
    links.forEach(function (link) {
      linkMap[link.getAttribute("href").slice(1)] = link;
    });

    const sections = Object.keys(linkMap)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    function setActive(id) {
      links.forEach(function (link) { link.classList.remove("is-active"); });
      if (linkMap[id]) linkMap[id].classList.add("is-active");
    }

    const observer = new IntersectionObserver(function (entries) {
      // Pilih section yang paling dominan terlihat di layar
      let best = null;
      entries.forEach(function (entry) {
        if (entry.isIntersecting && (!best || entry.intersectionRatio > best.intersectionRatio)) {
          best = entry;
        }
      });
      if (best) setActive(best.target.id);
    }, {
      // "Jendela pengamatan" di tengah layar → perpindahan terasa natural
      rootMargin: "-35% 0px -55% 0px",
      threshold: [0, 0.1, 0.5]
    });

    sections.forEach(function (section) { observer.observe(section); });
  })();


  /* ============================================
     MODUL 6 — NAVBAR SHRINK
     Navbar sedikit memadat setelah scroll turun.
     ============================================ */
  (function initNavbarShrink() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    let ticking = false;

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(function () {
        navbar.classList.toggle("is-scrolled", window.scrollY > 40);
        ticking = false;
      });
    }, { passive: true });
  })();


  /* ============================================
     MODUL 7 — LIGHT / DARK MODE
     Prioritas tema:
       1. pilihan pengunjung (localStorage "afdal-theme")
       2. tema browser/OS (prefers-color-scheme) — ikut berubah live
       3. gelap
     Ganti tema memakai View Transitions API (cross-fade halus ke seluruh
     halaman); browser lama memakai cadangan transition CSS (.theme-fade).
     Atribut data-theme awal sudah dipasang inline script di <head> (anti-flash).
     ============================================ */
  (function initTheme() {
    const root = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const KEY = "afdal-theme";
    const lightQuery = window.matchMedia("(prefers-color-scheme: light)");

    function systemTheme() { return lightQuery.matches ? "light" : "dark"; }

    function savedTheme() {
      try {
        const v = localStorage.getItem(KEY);
        if (v === "light" || v === "dark") return v;
      } catch (e) {}
      return null;
    }

    function currentTheme() {
      return root.getAttribute("data-theme") === "light" ? "light" : "dark";
    }

    // Pasang tema + samakan warna bar browser (HP) dengan background halaman
    function paint(theme) {
      root.setAttribute("data-theme", theme);
      if (themeMeta) {
        const bg = getComputedStyle(root).getPropertyValue("--bg-primary").trim();
        if (bg) themeMeta.setAttribute("content", bg);
      }
    }

    let vtCount = 0;
    let fadeTimer = null;

    function applyTheme(theme, animate) {
      if (theme === currentTheme()) { paint(theme); return; }

      const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!animate || !motionOk) { paint(theme); return; }

      if (typeof document.startViewTransition === "function") {
        const id = ++vtCount;
        root.classList.add("theme-vt");
        const vt = document.startViewTransition(function () { paint(theme); });
        const cleanup = function () {
          if (id === vtCount) root.classList.remove("theme-vt");
        };
        vt.finished.then(cleanup, cleanup);
        return;
      }

      // Cadangan: transition CSS pada warna
      root.classList.add("theme-fade");
      paint(theme);
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(function () { root.classList.remove("theme-fade"); }, 650);
    }

    // Sinkronkan saat halaman dimuat (warna bar browser)
    paint(currentTheme());

    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        const next = currentTheme() === "dark" ? "light" : "dark";
        try {
          // Jika pilihan sama dengan tema browser → hapus pilihan tersimpan
          // (kembali mengikuti browser otomatis). Jika beda → simpan sebagai pilihan.
          if (next === systemTheme()) localStorage.removeItem(KEY);
          else localStorage.setItem(KEY, next);
        } catch (e) {}
        applyTheme(next, true);
      });
    }

    // Tema browser/OS berubah (mis. jadwal otomatis siang/malam) → ikuti,
    // kecuali pengunjung sudah memilih tema yang berbeda secara manual.
    function onSystemChange() {
      if (!savedTheme()) applyTheme(systemTheme(), true);
    }
    if (lightQuery.addEventListener) lightQuery.addEventListener("change", onSystemChange);
    else if (lightQuery.addListener) lightQuery.addListener(onSystemChange);   // Safari lama
  })();


  /* ============================================
     MODUL 8 — GANTI BAHASA (EN / ID)
     Teks diambil dari js/i18n.js (window.AFDAL_TEXT) — edit teks di sana.
     Prioritas bahasa:
       1. pilihan pengunjung (localStorage "afdal-lang")
       2. bahasa browser (navigator.languages)
       3. Inggris
     ============================================ */
  (function initLanguage() {
    const langToggle = document.getElementById("langToggle");
    const TEXT = window.AFDAL_TEXT;
    if (!langToggle || !TEXT) return;

    const KEY = "afdal-lang";
    let currentLang = "en";

    // Bahasa pertama di daftar preferensi browser yang kita dukung
    function browserLang() {
      const list = (navigator.languages && navigator.languages.length)
        ? navigator.languages
        : [navigator.language || "en"];
      for (let i = 0; i < list.length; i++) {
        const code = String(list[i]).toLowerCase().split("-")[0];
        if (code === "id" || code === "in") return "id";   // "in" = kode lama untuk Indonesia
        if (code === "en") return "en";
      }
      return "en";
    }

    function savedLang() {
      try {
        const v = localStorage.getItem(KEY);
        if (v === "id" || v === "en") return v;
      } catch (e) {}
      return null;
    }

    // Aman dari HTML liar: escape dulu, baru ubah {aksen} dan **tebal**
    function format(text) {
      return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\*\*([\s\S]+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\{([\s\S]+?)\}/g, '<span class="text-accent">$1</span>');
    }

    function applyLanguage(lang) {
      currentLang = lang;

      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        const item = TEXT[el.getAttribute("data-i18n")];
        if (!item) return;
        // Teks bahasa terpilih; jika kosong → cadangan Inggris
        const text = item[lang] || item.en;
        if (text) el.innerHTML = format(text);
      });

      document.documentElement.setAttribute("lang", lang);
      // Label tombol menunjukkan bahasa TUJUAN (sedang EN → tampil "ID")
      langToggle.textContent = lang === "en" ? "ID" : "EN";
    }

    applyLanguage(savedLang() || browserLang());

    langToggle.addEventListener("click", function () {
      const next = currentLang === "en" ? "id" : "en";
      try {
        // Sama dengan bahasa browser → hapus pilihan tersimpan (otomatis lagi)
        if (next === browserLang()) localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, next);
      } catch (e) {}
      applyLanguage(next);
    });

    // Bahasa browser diubah saat halaman terbuka
    window.addEventListener("languagechange", function () {
      if (!savedLang()) applyLanguage(browserLang());
    });
  })();

})();