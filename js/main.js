(function () {
  "use strict";

  /* Replace with the real values once available */
  const CONFIG = {
    telegramUsername: "academy_arabic",
    defaultLang: "ru",
    rtlLangs: ["ar"]
  };

  const root = document.documentElement;

  /* ---------------------------------------------------------
     i18n
  --------------------------------------------------------- */
  function getByPath(obj, path) {
    return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
  }

  function wordify(el, text) {
    el.innerHTML = "";
    const words = text.split(" ");
    words.forEach((word, i) => {
      const wrap = document.createElement("span");
      wrap.className = "word-wrap";
      const inner = document.createElement("span");
      inner.className = "word-inner";
      inner.style.animationDelay = `${i * 0.09}s`;
      inner.textContent = word;
      wrap.appendChild(inner);
      el.appendChild(wrap);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
  }

  function applyTranslations(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS[CONFIG.defaultLang];

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = getByPath(dict, el.getAttribute("data-i18n"));
      if (value !== null) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-words]").forEach((el) => {
      const value = getByPath(dict, el.getAttribute("data-i18n-words"));
      if (value !== null) wordify(el, value);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const value = getByPath(dict, el.getAttribute("data-i18n-placeholder"));
      if (value !== null) el.setAttribute("placeholder", value);
    });

    root.lang = lang;
    root.dir = CONFIG.rtlLangs.includes(lang) ? "rtl" : "ltr";

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    try { localStorage.setItem("aoa_lang", lang); } catch (e) { /* storage unavailable */ }
  }

  function initLangSwitch() {
    const saved = (() => {
      try { return localStorage.getItem("aoa_lang"); } catch (e) { return null; }
    })();
    const initial = saved && TRANSLATIONS[saved] ? saved : CONFIG.defaultLang;
    applyTranslations(initial);

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => applyTranslations(btn.getAttribute("data-lang")));
    });
  }

  /* ---------------------------------------------------------
     Logo — one-time tile assembly intro, then idle glow (CSS)
  --------------------------------------------------------- */
  function buildLogoTiles(el) {
    if (!el || el.dataset.tiled) return;
    el.dataset.tiled = "true";

    const cols = 4;
    const rows = 5;
    const order = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) order.push([r, c]);
    }
    order.sort(() => Math.random() - 0.5);

    const frag = document.createDocumentFragment();
    order.forEach(([r, c], i) => {
      const tile = document.createElement("span");
      tile.className = "logo-tile";
      tile.style.width = `${100 / cols}%`;
      tile.style.height = `${100 / rows}%`;
      tile.style.left = `${(100 / cols) * c}%`;
      tile.style.top = `${(100 / rows) * r}%`;
      tile.style.backgroundImage = "url('assets/logo-icon.png')";
      tile.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
      tile.style.backgroundPosition = `${(c / (cols - 1)) * 100}% ${(r / (rows - 1)) * 100}%`;
      tile.style.animationDelay = `${i * 0.035}s`;
      frag.appendChild(tile);
    });
    el.appendChild(frag);

    const cleanupDelay = order.length * 35 + 650;
    setTimeout(() => {
      el.querySelectorAll(".logo-tile").forEach((t) => t.remove());
    }, cleanupDelay);
  }

  function initLogoAssembly() {
    document.querySelectorAll("[data-logo-icon]").forEach(buildLogoTiles);
  }

  /* ---------------------------------------------------------
     Hero wordmark — letters fly in after the arch assembles
  --------------------------------------------------------- */
  function letterify(el, baseDelay) {
    const text = el.textContent;
    el.innerHTML = "";
    el.setAttribute("aria-label", text);
    [...text].forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = "letter";
      span.textContent = ch === " " ? " " : ch;
      span.style.animationDelay = `${baseDelay + i * 0.045}s`;
      el.appendChild(span);
    });
  }

  function initHeroWordmark() {
    const nodes = document.querySelectorAll("[data-wordmark]");
    let delay = 1.3;
    nodes.forEach((el) => {
      letterify(el, delay);
      delay += el.textContent.length * 0.045 + 0.1;
    });
  }

  /* ---------------------------------------------------------
     About gallery — real center photos, crossfade every 3s
  --------------------------------------------------------- */
  function initAboutGallery() {
    const container = document.querySelector("[data-gallery]");
    if (!container) return;
    const slides = container.querySelectorAll(".about-gallery-slide");
    if (slides.length < 2) return;

    let index = [...slides].findIndex((s) => s.classList.contains("is-active"));
    if (index < 0) index = 0;

    setInterval(() => {
      slides[index].classList.remove("is-active");
      index = (index + 1) % slides.length;
      slides[index].classList.add("is-active");
    }, 3000);
  }

  /* ---------------------------------------------------------
     Ambient background — floating Arabic words + drifting
     light beams and dust, layered into every section
  --------------------------------------------------------- */
  const AMBIENT_WORDS = ["العربية", "تعلم", "لغة", "قرآن", "كتاب", "علم", "حرف", "كلمة", "قلم", "أهلاً"];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function buildAmbientLayer(target, opts) {
    const isDark = target.classList.contains("section-dark") || target.classList.contains("section-cta");
    const wrap = document.createElement("div");
    wrap.className = "ambient-bg" + (isDark ? " dark" : "");
    wrap.setAttribute("aria-hidden", "true");

    if (opts.lattice) {
      const lattice = document.createElement("div");
      lattice.className = "lattice-overlay";
      wrap.appendChild(lattice);
    }

    for (let i = 0; i < (opts.letters || 0); i++) {
      const el = document.createElement("span");
      el.className = "floating-letter";
      el.textContent = AMBIENT_WORDS[Math.floor(Math.random() * AMBIENT_WORDS.length)];
      el.style.left = `${rand(3, 82)}%`;
      el.style.top = `${rand(6, 78)}%`;
      el.style.fontSize = `${rand(2.2, 5)}rem`;
      el.style.animationDuration = `${rand(16, 30)}s`;
      el.style.animationDelay = `${rand(-12, 0)}s`;
      wrap.appendChild(el);
    }

    for (let i = 0; i < (opts.motes || 0); i++) {
      const el = document.createElement("span");
      el.className = "dust-mote";
      const size = rand(2, 5);
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${rand(2, 96)}%`;
      el.style.bottom = `${rand(-10, 10)}%`;
      el.style.setProperty("--drift", `${rand(-40, 40)}px`);
      el.style.animationDuration = `${rand(9, 20)}s`;
      el.style.animationDelay = `${rand(-14, 0)}s`;
      wrap.appendChild(el);
    }

    for (let i = 0; i < (opts.beams || 0); i++) {
      const el = document.createElement("div");
      el.className = "light-beam";
      el.style.left = `${rand(-10, 40)}%`;
      el.style.animationDuration = `${rand(14, 22)}s`;
      el.style.animationDelay = `${rand(-10, 0)}s`;
      wrap.appendChild(el);
    }

    return wrap;
  }

  function initAmbientBackground() {
    document.querySelectorAll(".section").forEach((section) => {
      const wrap = buildAmbientLayer(section, { letters: 3, motes: 7, beams: 1, lattice: true });
      section.insertBefore(wrap, section.firstChild);
    });

    const hero = document.querySelector(".hero");
    if (hero) {
      const wrap = buildAmbientLayer(hero, { motes: 6 });
      const heroInner = hero.querySelector(".hero-inner");
      hero.insertBefore(wrap, heroInner);
    }

    const footer = document.querySelector(".site-footer");
    if (footer) {
      const wrap = buildAmbientLayer(footer, { letters: 2, motes: 5, beams: 1, lattice: true });
      wrap.classList.add("dark");
      footer.insertBefore(wrap, footer.firstChild);
    }
  }

  /* ---------------------------------------------------------
     Hero background — animated flowing paths
     (inspired by "Background Paths" layout, restyled in the
     center's own emerald/gold palette)
  --------------------------------------------------------- */
  function initHeroPaths() {
    const container = document.getElementById("heroBgPattern");
    if (!container || container.querySelector(".hero-paths")) return;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "hero-paths");
    svg.setAttribute("viewBox", "0 0 1000 600");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");

    const colors = ["#0E3B2E", "#B98A2E", "#1d5c46"];
    const perGroup = 9;

    [1, -1].forEach((group) => {
      for (let i = 0; i < perGroup; i++) {
        const t = i / (perGroup - 1);
        const yBase = 40 + t * 520;
        const amp = 36 + t * 100;

        const x1 = -50, y1 = yBase;
        const cx1 = 260, cy1 = yBase + group * amp;
        const cx2 = 700, cy2 = yBase - group * amp;
        const x2 = 1050, y2 = yBase + group * amp * 0.35;
        const d = `M${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", d);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", colors[i % colors.length]);
        path.setAttribute("stroke-width", (0.6 + t * 1.6).toFixed(2));
        path.setAttribute("stroke-linecap", "round");
        path.style.opacity = (0.05 + t * 0.16).toFixed(2);
        path.style.strokeDasharray = "220 260";
        const duration = 16 + ((i * 5 + (group > 0 ? 0 : 7)) % 22);
        path.style.animation = `dashFlow ${duration}s linear infinite ${group > 0 ? "normal" : "reverse"}`;
        svg.appendChild(path);
      }
    });

    container.appendChild(svg);
  }

  /* ---------------------------------------------------------
     Header scroll state
  --------------------------------------------------------- */
  function initHeaderScroll() {
    const header = document.getElementById("siteHeader");
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------
     Mobile navigation
  --------------------------------------------------------- */
  function initMobileNav() {
    const burger = document.getElementById("burgerBtn");
    const nav = document.getElementById("mainNav");
    const overlay = document.getElementById("mobileOverlay");

    function close() {
      burger.classList.remove("open");
      nav.classList.remove("open");
      overlay.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
    function toggle() {
      const isOpen = nav.classList.toggle("open");
      burger.classList.toggle("open", isOpen);
      overlay.classList.toggle("open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
    }

    burger.addEventListener("click", toggle);
    overlay.addEventListener("click", close);
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }

  /* ---------------------------------------------------------
     Scroll reveal
  --------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");

    items.forEach((el) => {
      const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
      const idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = `${Math.min(idx * 0.08, 0.4)}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------------
     Animated counters
  --------------------------------------------------------- */
  function initCounters() {
    const counters = document.querySelectorAll(".stat-num[data-count]");
    const animate = (el) => {
      const target = parseInt(el.getAttribute("data-count"), 10);
      const duration = 1400;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------------
     FAQ accordion
  --------------------------------------------------------- */
  function initFaq() {
    document.querySelectorAll(".faq-item").forEach((item) => {
      const question = item.querySelector(".faq-question");
      question.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        item.parentElement.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));
        if (!isOpen) item.classList.add("open");
      });
    });
  }

  /* ---------------------------------------------------------
     Course cards -> preselect course in booking form
  --------------------------------------------------------- */
  function initCourseCta() {
    document.querySelectorAll(".course-cta").forEach((btn) => {
      btn.addEventListener("click", () => {
        const course = btn.getAttribute("data-course");
        const select = document.getElementById("fieldCourse");
        if (!course || !select) return;
        [...select.options].forEach((opt) => {
          if (opt.textContent.trim() === course) select.value = opt.value || opt.textContent;
        });
      });
    });
  }

  /* ---------------------------------------------------------
     Booking form -> Telegram deep link
  --------------------------------------------------------- */
  function initBookingForm() {
    const form = document.getElementById("bookingForm");
    const success = document.getElementById("formSuccess");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector("#fieldName").value.trim();
      const phone = form.querySelector("#fieldPhone").value.trim();
      const course = form.querySelector("#fieldCourse").value.trim();
      const message = form.querySelector("#fieldMessage").value.trim();

      if (!name || !phone) {
        form.reportValidity();
        return;
      }

      const lines = [
        "Заявка с сайта Academy of Arabic:",
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        course ? `Курс: ${course}` : null,
        message ? `Комментарий: ${message}` : null
      ].filter(Boolean);

      const text = encodeURIComponent(lines.join("\n"));
      const url = `https://t.me/${CONFIG.telegramUsername}?text=${text}`;

      form.hidden = true;
      success.hidden = false;

      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------------------------------------------------------
     Floating scroll-to-top button
  --------------------------------------------------------- */
  function initScrollTop() {
    const btn = document.getElementById("scrollTopBtn");
    const onScroll = () => btn.classList.toggle("visible", window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  function initYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLogoAssembly();
    initHeroWordmark();
    initAboutGallery();
    initAmbientBackground();
    initHeroPaths();
    initLangSwitch();
    initHeaderScroll();
    initMobileNav();
    initReveal();
    initCounters();
    initFaq();
    initCourseCta();
    initBookingForm();
    initScrollTop();
    initYear();
  });
})();
