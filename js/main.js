(function () {
  "use strict";

  const CONFIG = {
    telegramUsername: "academy_arabic",
    defaultLang: "uz",
    rtlLangs: ["ar"],

    /* Enquiries are posted straight into the centre's Telegram bot.
       A static site has no server, so this token is served with the page
       and is readable by anyone — a deliberate trade-off. What it allows:
       posting as the bot. What it does not allow: reading enquiries that
       were already delivered, since those travel from the bot outward.
       If it is ever abused, revoke it in @BotFather and replace it here.
       Clearing botChatId falls back to the pre-filled-chat link. */
    botToken: "8857344901:AAF2kmegXYBDBcLGQK9vcOjjIyyvJtf7h68",
    botChatId: "1290205717"
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

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const value = getByPath(dict, el.getAttribute("data-i18n-title"));
      if (value !== null) {
        el.setAttribute("title", value);
        el.setAttribute("aria-label", value);
      }
    });

    root.lang = lang;
    root.dir = CONFIG.rtlLangs.includes(lang) ? "rtl" : "ltr";

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const isCurrent = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("active", isCurrent);
      if (isCurrent) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
  }

  /* each language is its own URL, so the page's own lang attribute decides
     what is shown — a remembered choice must not override the address the
     visitor (or a search engine) actually asked for. The switcher is a set
     of plain links; re-applying the dictionary here only restores the
     word-by-word hero markup over text that is already correct. */
  function initLangSwitch() {
    const initial = TRANSLATIONS[root.lang] ? root.lang : CONFIG.defaultLang;
    applyTranslations(initial);

    const button = document.getElementById("langCurrent");
    const menu = document.getElementById("langMenu");
    if (!button || !menu) return;

    /* the closed control shows only the flag of the page you are on */
    const flag = button.querySelector(".flag");
    if (flag) flag.className = "flag flag-" + initial;

    const close = () => {
      menu.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    };

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = menu.classList.toggle("open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });

    menu.addEventListener("click", (e) => e.stopPropagation());
    document.addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
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
      /* root-absolute: this script also runs from /ru/ and /ar/ */
      tile.style.backgroundImage = "url('/assets/logo-icon.png')";
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
     Ambient background — floating Arabic words + drifting
     light beams and dust, layered into every section
  --------------------------------------------------------- */
  const AMBIENT_WORDS = [
    "العربية", "تعلم", "لغة", "قرآن", "كتاب", "علم", "حرف", "كلمة", "قلم", "أهلاً",
    "مرحبا", "درس", "معلم", "طالب", "نحو", "صرف", "قراءة", "كتابة", "مدرسة", "طشقند",
    "سلام", "شكرا", "جميل", "صوت", "لسان", "بيت", "نور", "سماء", "قصة", "حوار"
  ];

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
      el.style.left = `${rand(-4, 92)}%`;
      el.style.top = `${rand(2, 86)}%`;
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
      const wrap = buildAmbientLayer(section, { letters: 9, motes: 10, beams: 1, lattice: true });
      section.insertBefore(wrap, section.firstChild);
    });

    const hero = document.querySelector(".hero");
    if (hero) {
      const wrap = buildAmbientLayer(hero, { letters: 7, motes: 9 });
      const heroInner = hero.querySelector(".hero-inner");
      hero.insertBefore(wrap, heroInner);
    }

    const footer = document.querySelector(".site-footer");
    if (footer) {
      const wrap = buildAmbientLayer(footer, { letters: 6, motes: 8, beams: 1, lattice: true });
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
    const progress = document.getElementById("scrollProgress");
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 12);
      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = `${max > 0 ? Math.min((window.scrollY / max) * 100, 100) : 0}%`;
      }
    };
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
    const items = document.querySelectorAll(".reveal, .reveal-scale, .reveal-blur");

    items.forEach((el) => {
      const siblings = Array.from(el.parentElement.children).filter(
        (c) => c.classList.contains("reveal") || c.classList.contains("reveal-scale") || c.classList.contains("reveal-blur")
      );
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
     Cursor-tracking spotlight glow on cards (desktop pointers)
  --------------------------------------------------------- */
  function initCardGlow() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const cards = document.querySelectorAll(".feature-card, .course-card, .review-card, .process-step");
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      });
    });
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
    const select = document.getElementById("fieldCourse");
    if (!select) return;
    document.querySelectorAll(".course-cta").forEach((btn) => {
      btn.addEventListener("click", () => {
        /* match on the translation key, not the visible name — the name is
           different in each language and gets reworded */
        const key = btn.getAttribute("data-course-key");
        if (!key) return;
        const option = select.querySelector(`option[data-i18n="${key}"]`);
        if (option) select.selectedIndex = option.index;
      });
    });
  }



  /* ---------------------------------------------------------
     Confetti — fires once when an enquiry actually reaches the bot
  --------------------------------------------------------- */
  function celebrate() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = document.createElement("div");
    layer.className = "confetti";
    layer.setAttribute("aria-hidden", "true");
    const colours = ["#0E3B2E", "#B98A2E", "#E7CD7A", "#17614a", "#F4EEDD"];
    for (let i = 0; i < 90; i++) {
      const bit = document.createElement("i");
      bit.style.left = `${rand(0, 100)}%`;
      bit.style.background = colours[Math.floor(Math.random() * colours.length)];
      bit.style.setProperty("--dx", `${rand(-160, 160)}px`);
      bit.style.setProperty("--spin", `${rand(360, 1080)}deg`);
      bit.style.animationDuration = `${rand(2.4, 4.2)}s`;
      bit.style.animationDelay = `${rand(0, .5)}s`;
      bit.style.width = `${rand(6, 11)}px`;
      bit.style.height = `${rand(10, 18)}px`;
      layer.appendChild(bit);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 5200);
  }

  /* ---------------------------------------------------------
     Booking form -> the centre's Telegram bot, with the
     pre-filled-chat link kept as the fallback when the request
     cannot go through (offline, blocked, bot token revoked).
  --------------------------------------------------------- */
  function initBookingForm() {
    const form = document.getElementById("bookingForm");
    const success = document.getElementById("formSuccess");
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');

    function setPanel(titleKey, textKey) {
      const dict = TRANSLATIONS[root.lang] || TRANSLATIONS[CONFIG.defaultLang];
      const title = document.getElementById("successTitle");
      const body = document.getElementById("successText");
      const t = getByPath(dict, titleKey);
      const b = getByPath(dict, textKey);
      if (title && t) title.textContent = t;
      if (body && b) body.textContent = b;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = form.querySelector("#fieldName").value.trim();
      const dialCode = form.querySelector("#fieldDialCode").value.trim();
      const phone = form.querySelector("#fieldPhone").value.trim();
      const telegramField = form.querySelector("#fieldTelegram");
      const course = form.querySelector("#fieldCourse").value.trim();
      const message = form.querySelector("#fieldMessage").value.trim();
      const consent = form.querySelector("#fieldConsent");

      /* @ is how people write a handle but not part of it */
      const telegram = telegramField.value.trim().replace(/^@+/, "");

      if (!name || !phone || !telegram || !consent.checked) {
        form.reportValidity();
        return;
      }

      const body = [
        "🔔 Заявка с сайта Academy of Arabic",
        "",
        `Имя: ${name}`,
        `Телефон: ${dialCode} ${phone}`,
        `Telegram: @${telegram}`,
        course ? `Курс: ${course}` : null,
        message ? `Комментарий: ${message}` : null,
        `Язык сайта: ${root.lang}`
      ].filter(Boolean).join("\n");

      const deepLink = `https://t.me/${CONFIG.telegramUsername}?text=${encodeURIComponent(body)}`;
      const link = document.getElementById("successTgLink");
      if (link) link.href = deepLink;

      if (CONFIG.botToken && CONFIG.botChatId) {
        if (submitBtn) submitBtn.disabled = true;
        /* a request that never settles would leave the button dead and the
           visitor with no feedback, so give up after a few seconds and let
           them finish through Telegram instead */
        const abort = new AbortController();
        const giveUp = setTimeout(() => abort.abort(), 8000);
        try {
          const res = await fetch(`https://api.telegram.org/bot${CONFIG.botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CONFIG.botChatId, text: body }),
            signal: abort.signal
          });
          const data = await res.json();
          if (data && data.ok) {
            form.hidden = true;
            success.hidden = false;
            setPanel("contact.sentTitle", "contact.sentText");
            /* delivered — nothing is left for them to do */
            if (link) link.hidden = true;
            const alt = success.querySelector(".form-success-alt");
            if (alt) alt.hidden = true;
            form.reset();
            celebrate();
            return;
          }
        } catch (err) {
          /* offline, blocked or too slow — fall through to the link */
        } finally {
          clearTimeout(giveUp);
          if (submitBtn) submitBtn.disabled = false;
        }
      }

      /* it did not reach the bot — the panel asks for the one tap that
         sends it. window.open with noopener always returns null, so the
         wording never claims to know whether the popup actually opened;
         the link sits right there either way. */
      form.hidden = true;
      success.hidden = false;
      if (link) link.hidden = false;
      const altBack = success.querySelector(".form-success-alt");
      if (altBack) altBack.hidden = false;
      setPanel("contact.successTitle", "contact.successText");
      window.open(deepLink, "_blank", "noopener");
    });
  }

  /* ---------------------------------------------------------
     Booking dialog — the form opens where the visitor already is
     instead of throwing them down to the contact section. The form
     itself is moved in and back out, so there is only ever one copy
     of it and its ids stay unique.
  --------------------------------------------------------- */
  function initBookingModal() {
    const dialog = document.getElementById("bookingDialog");
    const slot = document.getElementById("bookingDialogSlot");
    const closeBtn = document.getElementById("bookingDialogClose");
    const wrap = document.querySelector(".contact-form-wrap");
    if (!dialog || !slot || !wrap || typeof dialog.showModal !== "function") return;

    const anchor = document.createComment("booking-form");
    let open = false;

    function openDialog() {
      if (open) return;
      wrap.parentNode.insertBefore(anchor, wrap);
      slot.appendChild(wrap);
      dialog.showModal();
      open = true;
      const first = wrap.querySelector("input:not([type=hidden])");
      if (first) first.focus({ preventScroll: true });
    }

    function restore() {
      if (!open) return;
      anchor.parentNode.insertBefore(wrap, anchor);
      anchor.remove();
      open = false;

      // a completed submission should not greet the next visit
      const form = document.getElementById("bookingForm");
      const success = document.getElementById("formSuccess");
      if (form && success && !success.hidden) {
        success.hidden = true;
        form.hidden = false;
        form.reset();
      }
    }

    document.querySelectorAll("[data-open-booking]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openDialog();
      });
    });

    closeBtn.addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", restore);
    dialog.addEventListener("cancel", () => dialog.close());
    // clicking the backdrop closes it
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
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
  /* Follow the cursor with the transform-origin so the zoom lands where
     the pointer is, rather than always on the middle of the picture. */
  function initHoverZoom() {
    document.querySelectorAll("[data-zoom]").forEach((box) => {
      const img = box.querySelector("img");
      if (!img) return;

      box.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;
        const r = box.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        img.style.transformOrigin = x + "% " + y + "%";
      });

      box.addEventListener("pointerleave", () => {
        img.style.transformOrigin = "50% 50%";
      });
    });
  }

  function initYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLogoAssembly();
    initAmbientBackground();
    initHeroPaths();
    initLangSwitch();
    initHeaderScroll();
    initMobileNav();
    initReveal();
    initCounters();
    initCardGlow();
    initFaq();
    initCourseCta();
    initBookingForm();
    initBookingModal();
    initScrollTop();
    initHoverZoom();
    initYear();
  });
})();
