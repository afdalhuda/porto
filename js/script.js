/* ============================================
   AFDAL PORTFOLIO — SCRIPT (FINAL)
   Modul:
   1. Mobile nav toggle
   2. Kokarde lanyard (fisika tali + seret mouse)
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
     MODUL 2 — KOKARDE LANYARD (fisika tali + seret mouse)
     Kartu portrait menggantung dengan tali dari tepi atas beranda.
     • Fisika Verlet: rantai 10 ruas tali + kartu kaku (2 titik) di ujungnya
     • Seret kartu ke mana saja (mouse / sentuh), lepas → berayun & dilempar
     • Gerakkan mouse melewati kartu → kartu tersenggol sedikit
     • Layer ada di dalam #hero → hanya di beranda; loop dijeda saat hero
       tidak terlihat atau tab tidak aktif (hemat CPU)
     Ukuran/posisi diatur CSS (--badge-w, --rope, .lanyard__anchor).
     ============================================ */
  (function initLanyard() {
    const hero = document.getElementById("hero");
    const layer = document.getElementById("lanyard");
    const card = document.getElementById("lanyardCard");
    if (!hero || !layer || !card) return;

    const face = card.querySelector(".lanyard__face");
    const anchorEl = layer.querySelector(".lanyard__anchor");
    const hint = document.getElementById("lanyardHint");
    const strapPaths = layer.querySelectorAll(".lanyard__strap path");

    // ---- Konfigurasi fisika (silakan utak-atik) ----
    const SEGMENTS = 10;          // jumlah ruas tali
    const STEP = 1 / 120;         // langkah simulasi tetap (detik)
    const GRAVITY = 7000;         // px/detik² — makin besar ayunan makin cepat & kartu terasa makin berat
    const DAMPING = reduceMotion
      ? 0.988                     // reduced motion: cepat tenang, minim ayunan
      : 0.9972;                   // 1 = tak pernah berhenti; makin kecil makin cepat diam
    const ITERATIONS = 16;        // akurasi kekakuan tali
    const WIND = 220;             // hembusan angin halus agar kartu tetap "mengambang" (0 = diam total)
    const MAX_STEP_SPEED = 40;    // batas kecepatan per langkah (anti meledak saat dilempar)
    const ANCHOR_Y = -30;         // titik gantung sedikit di atas layar → tali muncul dari luar
    const NUDGE = 0.011;          // kekuatan senggolan mouse tanpa klik (0 = nonaktif)

    const N1 = SEGMENTS;          // titik atas kartu (tempat klip)
    const N2 = SEGMENTS + 1;      // titik bawah kartu

    let pts = [];                 // titik: {x, y, px, py, w}  (px/py = posisi sebelumnya, w = 1/massa)
    let rest = [];                // panjang diam tiap ruas
    let W = 0, H = 0;             // ukuran hero
    let anchorX = 0, ropeLen = 0, cardW = 0, cardLen = 0;
    let simT = 0, ry = 0;

    let dragging = false;
    const grab = { id: null, cx: 0, cy: 0, x: 0, y: 0, t: 0, gx: 0 };

    function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
    function point(x, y, w) { return { x: x, y: y, px: x, py: y, w: w }; }

    /* ---------- Susun ulang rantai dalam posisi menggantung ---------- */
    function build(intro) {
      const seg = ropeLen / SEGMENTS;
      const ang = intro ? 0.28 : 0;                 // awal miring → berayun masuk saat dimuat
      const sx = Math.sin(ang), cy = Math.cos(ang);

      pts = []; rest = [];
      for (let i = 0; i <= SEGMENTS; i++) {
        const d = i * seg;
        pts.push(point(anchorX + sx * d, ANCHOR_Y + cy * d, i === 0 ? 0 : (i === N1 ? 0.4 : 1)));
        if (i < SEGMENTS) rest.push(seg);
      }
      const d2 = ropeLen + cardLen;
      pts.push(point(anchorX + sx * d2, ANCHOR_Y + cy * d2, 0.4));
      rest.push(cardLen);
      ry = 0;
    }

    /* ---------- Baca ukuran dari CSS (tanpa angka tertulis di JS) ---------- */
    let firstLayout = true;
    function layout() {
      W = hero.clientWidth;
      H = hero.clientHeight;
      const ax = anchorEl.offsetLeft;
      const ropeEnd = anchorEl.offsetHeight;        // posisi y atas kartu saat diam
      const cw = card.offsetWidth;
      const ch = card.offsetHeight;
      if (!W || !cw) return;

      const newRope = ropeEnd - ANCHOR_Y;
      const changed = !pts.length || Math.abs(ax - anchorX) > 1 || Math.abs(newRope - ropeLen) > 1 ||
                      Math.abs(cw - cardW) > 1 || Math.abs(ch - cardLen) > 1;
      anchorX = ax; ropeLen = newRope; cardW = cw; cardLen = ch;

      if (changed) {
        build(firstLayout && !reduceMotion);
        firstLayout = false;
      }

      // Petunjuk "Drag me" tepat di bawah posisi diam kartu
      if (hint) {
        hint.style.left = anchorX + "px";
        hint.style.top = (ropeEnd + cardLen + 16) + "px";
      }
    }

    /* ---------- Fisika ---------- */
    function solve(i) {
      const a = pts[i], b = pts[i + 1];
      const wsum = a.w + b.w;
      if (!wsum) return;
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1e-6;
      const k = (d - rest[i]) / d / wsum;
      a.x += dx * k * a.w; a.y += dy * k * a.w;
      b.x -= dx * k * b.w; b.y -= dy * k * b.w;
    }

    // Tahan kartu tetap di dalam hero
    function bounds() {
      const minX = cardW / 2 + 2, maxX = W - cardW / 2 - 2;
      for (let i = N1; i <= N2; i++) {
        const p = pts[i];
        if (maxX > minX) p.x = clamp(p.x, minX, maxX);
        if (p.y > H - 4) p.y = H - 4;
      }
    }

    // Titik yang sedang dipegang di kartu dipaksa mengikuti pointer
    function applyGrab() {
      const c1 = pts[N1], c2 = pts[N2];
      let ux = c2.x - c1.x, uy = c2.y - c1.y;
      const len = Math.hypot(ux, uy) || 1;
      ux /= len; uy /= len;                         // sumbu-y kartu = (ux, uy); sumbu-x = (uy, -ux)

      // pointer dikurangi offset samping (agar piksel yang dipegang tetap di bawah kursor)
      let tx = grab.x - uy * grab.gx;
      let ty = grab.y + ux * grab.gx;

      // tali tidak bisa melar: batasi target ke jangkauan maksimal
      const reach = (ropeLen + grab.t * cardLen) * 0.995;
      const dx0 = tx - anchorX, dy0 = ty - ANCHOR_Y;
      const dist = Math.hypot(dx0, dy0);
      if (dist > reach) { tx = anchorX + dx0 * reach / dist; ty = ANCHOR_Y + dy0 * reach / dist; }

      const t = grab.t;
      const gxp = c1.x + (c2.x - c1.x) * t;
      const gyp = c1.y + (c2.y - c1.y) * t;
      const dx = tx - gxp, dy = ty - gyp;
      const den = (1 - t) * (1 - t) + t * t;
      const k1 = (1 - t) / den, k2 = t / den;
      c1.x += dx * k1; c1.y += dy * k1;
      c2.x += dx * k2; c2.y += dy * k2;
    }

    function step() {
      simT += STEP;
      const g = GRAVITY * STEP * STEP;
      const wind = reduceMotion ? 0
        : // frekuensi sengaja jauh di bawah frekuensi ayun alami kartu (±3 rad/dtk) → tidak beresonansi
        (Math.sin(simT * 0.55) + 0.6 * Math.sin(simT * 1.25 + 1.7)) * WIND * STEP * STEP;
      const last = pts.length - 1;

      for (let i = 1; i <= last; i++) {
        const p = pts[i];
        let vx = (p.x - p.px) * DAMPING;
        let vy = (p.y - p.py) * DAMPING;
        const sp = Math.hypot(vx, vy);
        if (sp > MAX_STEP_SPEED) { vx *= MAX_STEP_SPEED / sp; vy *= MAX_STEP_SPEED / sp; }
        p.px = p.x; p.py = p.y;
        p.x += vx + wind * (i / last);
        p.y += vy + g;
      }

      for (let it = 0; it < ITERATIONS; it++) {
        if (dragging) applyGrab();
        if (it % 2 === 0) { for (let i = 0; i < last; i++) solve(i); }
        else { for (let i = last - 1; i >= 0; i--) solve(i); }
        bounds();
      }
      for (let k = 0; k < 4; k++) for (let i = 0; i < last; i++) solve(i);   // rapikan sisa regangan
    }

    /* ---------- Gambar ---------- */
    function render() {
      const c1 = pts[N1], c2 = pts[N2];
      if (!isFinite(c1.x + c1.y + c2.x + c2.y)) { build(false); return; }    // jaring pengaman

      // Tali: kurva halus melewati titik-titik rantai
      let d = "M" + pts[0].x.toFixed(1) + " " + pts[0].y.toFixed(1);
      for (let i = 1; i < N1; i++) {
        const p = pts[i], q = pts[i + 1];
        d += " Q" + p.x.toFixed(1) + " " + p.y.toFixed(1) + " " +
             ((p.x + q.x) / 2).toFixed(1) + " " + ((p.y + q.y) / 2).toFixed(1);
      }
      d += " L" + c1.x.toFixed(1) + " " + c1.y.toFixed(1);
      for (let i = 0; i < strapPaths.length; i++) strapPaths[i].setAttribute("d", d);

      // Kartu: berputar mengikuti sumbu antara dua titiknya
      const theta = Math.atan2(-(c2.x - c1.x), c2.y - c1.y);
      card.style.transform =
        "translate3d(" + (c1.x - cardW / 2).toFixed(2) + "px, " + c1.y.toFixed(2) + "px, 0) " +
        "rotate(" + theta.toFixed(4) + "rad)";

      // Kesan 3D: kartu sedikit "memutar" mengikuti kecepatan sampingnya
      const vx = ((c1.x - c1.px) + (c2.x - c2.px)) / 2 / STEP;
      ry += (clamp(vx * 0.018, -22, 22) - ry) * 0.12;
      face.style.transform = "perspective(900px) rotateY(" + ry.toFixed(2) + "deg)";
      card.style.setProperty("--shine-x", (50 + ry * 2.2 - theta * 30).toFixed(1) + "%");
      card.style.setProperty("--shine-y", (28 + Math.abs(ry) * 0.7).toFixed(1) + "%");
    }

    /* ---------- Loop animasi ---------- */
    let rafId = null, lastTime = 0, acc = 0, quiet = 0;
    let visible = true;

    function updateGrabPosition() {
      const r = hero.getBoundingClientRect();       // dihitung ulang tiap frame (halaman bisa di-scroll)
      grab.x = grab.cx - r.left;
      grab.y = grab.cy - r.top;
    }

    function energy() {
      let e = 0;
      for (let i = 1; i < pts.length; i++) e += Math.abs(pts[i].x - pts[i].px) + Math.abs(pts[i].y - pts[i].py);
      return e;
    }

    function frame(now) {
      rafId = requestAnimationFrame(frame);
      if (!lastTime) lastTime = now;
      acc += Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (dragging) updateGrabPosition();
      let n = 0;
      while (acc >= STEP && n < 6) { step(); acc -= STEP; n++; }
      if (n === 6) acc = 0;
      render();

      // Reduced motion: tanpa angin, jadi loop boleh tidur saat kartu sudah diam
      if (reduceMotion && !dragging && energy() < 0.3) { if (++quiet > 30) stop(); }
      else quiet = 0;
    }

    function start() {
      if (rafId !== null || !visible || document.hidden) return;
      lastTime = 0; acc = 0; quiet = 0;
      rafId = requestAnimationFrame(frame);
    }

    function stop() {
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    }

    /* ---------- Interaksi mouse / sentuh ---------- */
    function hideHint() { if (hint) hint.classList.add("is-hidden"); }

    function release(e) {
      if (!dragging || e.pointerId !== grab.id) return;
      dragging = false;
      grab.id = null;
      card.classList.remove("is-dragging");
    }

    card.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      try { card.setPointerCapture(e.pointerId); } catch (err) {}

      const r = hero.getBoundingClientRect();
      const px = e.clientX - r.left, py = e.clientY - r.top;
      const c1 = pts[N1], c2 = pts[N2];
      let ux = c2.x - c1.x, uy = c2.y - c1.y;
      const len = Math.hypot(ux, uy) || 1;
      ux /= len; uy /= len;

      // titik pegangan dalam koordinat kartu: sepanjang sumbu (gy) dan ke samping (gx)
      const gy = (px - c1.x) * ux + (py - c1.y) * uy;
      grab.gx = (px - c1.x) * uy + (py - c1.y) * -ux;
      grab.t = clamp(gy / len, 0, 1);
      grab.id = e.pointerId;
      grab.cx = e.clientX; grab.cy = e.clientY;
      grab.x = px; grab.y = py;

      dragging = true;
      card.classList.add("is-dragging");
      hideHint();
      start();
    });

    card.addEventListener("pointermove", function (e) {
      if (dragging) {
        if (e.pointerId === grab.id) { grab.cx = e.clientX; grab.cy = e.clientY; }
        return;
      }
      if (e.pointerType !== "mouse") return;
      // Senggolan: mouse yang melintas mendorong kartu sedikit
      const mx = clamp(e.movementX || 0, -40, 40) * NUDGE;
      const my = clamp(e.movementY || 0, -40, 40) * NUDGE;
      const c1 = pts[N1], c2 = pts[N2];
      c2.px -= mx; c2.py -= my;
      c1.px -= mx * 0.4; c1.py -= my * 0.4;
      start();
    });

    card.addEventListener("pointerup", release);
    card.addEventListener("pointercancel", release);
    card.addEventListener("lostpointercapture", release);

    // Jangan mulai "drag gambar/teks" bawaan browser
    card.addEventListener("dragstart", function (e) { e.preventDefault(); });

    /* ---------- Hemat CPU: jeda jika tak terlihat ---------- */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }).observe(hero);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });

    /* ---------- Mulai ---------- */
    layout();
    if (!pts.length) return;                        // tidak ada ukuran (mis. elemen tersembunyi)
    render();
    layer.classList.add("is-ready");
    start();

    if ("ResizeObserver" in window) {
      new ResizeObserver(function () { layout(); if (pts.length) { render(); start(); } }).observe(hero);
    } else {
      window.addEventListener("resize", function () { layout(); if (pts.length) { render(); start(); } });
    }
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