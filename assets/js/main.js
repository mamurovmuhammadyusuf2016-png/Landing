/* ============================================================
   Academy of Arabic — interactions & i18n
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hide'), 350);
  });
  setTimeout(() => preloader && preloader.classList.add('hide'), 1800);

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const toTopBtn = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 30);
    toTopBtn.classList.toggle('show', y > 500);
  }, { passive: true });
  toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Counter animation ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let cur = 0;
      const step = Math.max(1, Math.round(target / 40));
      const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = target; return; }
        el.textContent = cur;
        requestAnimationFrame(tick);
      };
      tick();
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countIO.observe(el));

  /* ---------- Course tabs ---------- */
  const tabs = document.querySelectorAll('.course-tab');
  const panels = document.querySelectorAll('.course-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`.course-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  /* ---------- Reviews slider ---------- */
  const track = document.getElementById('reviewTrack');
  const dotsWrap = document.getElementById('reviewDots');
  const cards = track ? track.children.length : 0;
  let perView = window.innerWidth <= 640 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
  let pages = Math.max(1, cards - perView + 1);
  let current = 0;

  function buildDots() {
    dotsWrap.innerHTML = '';
    pages = Math.max(1, cards - perView + 1);
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('button');
      if (i === 0) d.classList.add('active');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }
  function goTo(i) {
    current = ((i % pages) + pages) % pages;
    const cardWidth = track.children[0].getBoundingClientRect().width + 24;
    track.style.transform = `translateX(${current * -cardWidth}px)`;
    [...dotsWrap.children].forEach((d, idx) => d.classList.toggle('active', idx === current));
  }
  buildDots();
  let sliderTimer = setInterval(() => goTo(current + 1), 5500);
  window.addEventListener('resize', () => {
    perView = window.innerWidth <= 640 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    buildDots();
    goTo(0);
  });

  /* ---------- Toast ---------- */
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
  }

  /* ---------- Trial form -> Telegram / WhatsApp handoff ---------- */
  const TELEGRAM_USERNAME = 'academyofarabic_tashkent';
  const WHATSAPP_NUMBER = '998712000000';

  const trialForm = document.getElementById('trialForm');
  trialForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(trialForm);
    const name = (data.get('name') || '').trim();
    const phone = (data.get('phone') || '').trim();
    const course = data.get('course');
    const comment = (data.get('comment') || '').trim();

    const courseLabels = { kids: 'Ребёнок (грамматика и чтение)', adult: 'Взрослый (разговорный арабский)', notsure: 'Не определились' };
    const lines = [
      'Заявка на пробный урок — Academy of Arabic',
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      `Курс: ${courseLabels[course] || course}`,
    ];
    if (comment) lines.push(`Комментарий: ${comment}`);
    const message = lines.join('\n');

    const tgUrl = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;
    window.open(tgUrl, '_blank', 'noopener');

    showToast(t('toast.success', 'Спасибо! Открываем Telegram — подтвердите заявку в чате.'));
    trialForm.reset();
  });

  /* ================= I18N ================= */
  const translations = {
    ru: {}, // defaults already in markup
    uz: {
      'nav.about': 'Markaz haqida', 'nav.courses': 'Kurslar', 'nav.teachers': "O'qituvchilar",
      'nav.reviews': 'Fikrlar', 'nav.faq': 'Savollar', 'nav.contact': 'Aloqa', 'nav.cta': 'Sinov darsi',
      'hero.eyebrow': 'Toshkentdagi arab tili o‘quv markazi',
      'hero.title': '<span class="hl">Arab tili</span> olamini Academy of Arabic bilan kashf eting',
      'hero.sub': 'Bolalar va kattalar uchun kurslar: grammatika, o‘qish va jonli muloqot. Tajribali o‘qituvchilar, kichik guruhlar va birinchi oydanoq natija.',
      'hero.cta1': 'Sinov darsiga yozilish', 'hero.cta2': 'Kurslarni ko‘rish',
      'hero.stat1': 'o‘quvchi', 'hero.stat2': 'o‘qituvchi', 'hero.stat3': 'yillik tajriba', 'hero.stat4': 'mamnun oila',
      'hero.badgeTitle': 'Bepul', 'hero.badgeSub': 'sinov darsi',
      'trust.line': 'Online va oflayn format · 8 kishigacha kichik guruhlar · Kurs yakunida sertifikat',
      'about.tag': 'Markaz haqida', 'about.title': 'Academy of Arabic — til tushunarli bo‘ladigan joy',
      'about.p1': 'Biz arab tilini tizimli, jonli va madaniyatga hurmat bilan o‘rgatadigan markaz yaratdik. Metodikamiz klassik grammatika bilan og‘zaki amaliyotni birlashtiradi — o‘quvchilar shunchaki qoidalarni yodlamaydi, balki tushunib, gapira boshlaydi.',
      'about.p2': 'Biz Toshkentda joylashganmiz va bir necha yildan beri bolalar va kattalarga arab tilida ishonch bilan o‘qish, yozish va muloqot qilishga yordam beramiz.',
      'about.point1': 'Bolalar va kattalar uchun mualliflik dasturi', 'about.point2': 'Yo‘nalishli ta’limga ega o‘qituvchilar',
      'about.point3': 'Ota-onalar uchun muntazam qayta aloqa', 'about.point4': 'Qulay sinflar va online format tanlovi',
      'about.years': 'yildan beri Toshkentda arab tilidan dars beramiz',
      'why.tag': 'Nega aynan biz', 'why.title': 'Haqiqatan ishlaydigan ta’lim',
      'why.card1title': 'Mualliflik metodikasi', 'why.card1text': 'Dastur darajalar bo‘yicha qurilgan — alifbodan erkin o‘qish va nutqqacha, ortiqcha nazariyasiz.',
      'why.card2title': 'Tajribali o‘qituvchilar', 'why.card2text': 'Har qanday darajadagi bolalar va kattalar bilan ishlash tajribasiga ega yo‘nalishli pedagoglar.',
      'why.card3title': 'Kichik guruhlar', 'why.card3text': 'Guruhda 8 kishigacha — har bir o‘quvchiga yetarli e’tibor va nutq amaliyoti.',
      'why.card4title': 'Ko‘rinadigan natija', 'why.card4text': 'Muntazam testlar, qayta aloqa va har bosqich yakunida sertifikat.',
      'why.card5title': 'Online va oflayn', 'why.card5text': 'Toshkentdagi sinfda yoki dunyoning istalgan nuqtasidan qo‘shiling.',
      'why.card6title': 'Har bir o‘quvchiga g‘amxo‘rlik', 'why.card6text': 'Qo‘llab-quvvatlash muhiti — bolalarga qulay, kattalarga xato qilishdan qo‘rqmaslik imkonini beradi.',
      'courses.tag': 'Ta’lim dasturlari', 'courses.title': 'Bolalar va kattalar uchun kurslar',
      'courses.sub': 'Yoshingiz, darajangiz va maqsadingizga mos dasturni tanlaymiz — birinchi harflardan ishonchli nutqqacha.',
      'courses.tabKids': 'Bolalar uchun', 'courses.tabAdults': 'Kattalar uchun', 'courses.popular': 'Mashhur', 'courses.cta': 'Yozilish',
      'courses.note': '* Aniq narx va jadvalni administratordan so‘rang — darajangizga mos dastur taklif qilamiz.',
      'courses.kids1.level': '6–9 yosh', 'courses.kids1.title': 'Birinchi qadamlar: alifbo va o‘qish',
      'courses.kids1.text': 'O‘yin shaklida arab harflari, tovushlari va birinchi so‘zlar bilan tanishuv.',
      'courses.kids1.f1': 'Arab alifbosi va harflarni yozish', 'courses.kids1.f2': 'Oddiy so‘z va matnlarni o‘qish',
      'courses.kids1.f3': 'Haftada 2 dars, 60 daqiqadan', 'courses.kids1.price': '350 000 so‘mdan/oy',
      'courses.kids2.level': '10–14 yosh', 'courses.kids2.title': 'Grammatika va o‘qish',
      'courses.kids2.text': 'Arab tili grammatikasini tizimli o‘rganish va ishonchli o‘qishni rivojlantirish.',
      'courses.kids2.f1': 'Grammatika asoslari (morfologiya, kelishiklar)', 'courses.kids2.f2': 'Yoshga mos matnlarni o‘qish va qayta hikoya qilish',
      'courses.kids2.f3': 'Haftada 2–3 dars, 75 daqiqadan', 'courses.kids2.price': '420 000 so‘mdan/oy',
      'courses.kids3.level': '12–17 yosh', 'courses.kids3.title': 'Ilg‘or o‘qish va yozuv',
      'courses.kids3.text': 'Allaqachon o‘qiy oladiganlar uchun — grammatika, yozuv va lug‘at boyligini chuqurlashtiramiz.',
      'courses.kids3.f1': 'Kengaytirilgan grammatika va sintaksis', 'courses.kids3.f2': 'Yozma ishlar va insholar',
      'courses.kids3.f3': 'Haftada 2 dars, 75 daqiqadan', 'courses.kids3.price': '420 000 so‘mdan/oy',
      'courses.adult1.level': 'Boshlang‘ich', 'courses.adult1.title': 'Noldan arab tili',
      'courses.adult1.text': 'Kundalik muloqot uchun alifbo, asosiy grammatika va birinchi so‘zlashuv iboralari.',
      'courses.adult1.f1': 'Alifbo, o‘qish, asosiy lug‘at', 'courses.adult1.f2': 'Birinchi darsdan so‘zlashuv modullari',
      'courses.adult1.f3': 'Haftada 2 dars, 90 daqiqadan', 'courses.adult1.price': '480 000 so‘mdan/oy',
      'courses.adult2.level': 'O‘rta', 'courses.adult2.title': 'So‘zlashuv arab tili',
      'courses.adult2.text': 'Kundalik, ishbilarmonlik va turmush mavzularida ishonchli muloqot, jonli nutq amaliyoti.',
      'courses.adult2.f1': 'Dialoglar, rolli o‘yinlar, vaziyatlarni tahlil qilish', 'courses.adult2.f2': 'Lug‘at boyligini kengaytirish',
      'courses.adult2.f3': 'Haftada 2–3 dars, 90 daqiqadan', 'courses.adult2.price': '550 000 so‘mdan/oy',
      'courses.adult3.level': 'Ilg‘or', 'courses.adult3.title': 'Ishbilarmonlik va erkin arab tili',
      'courses.adult3.text': 'Erkin gaplashishni istaganlar uchun: murakkab mavzular, ishbilarmonlik yozishmalari, nutq madaniyati.',
      'courses.adult3.f1': 'Ilg‘or grammatika va uslubiyat', 'courses.adult3.f2': 'Ishbilarmonlik lug‘ati va yozishmalar',
      'courses.adult3.f3': 'Haftada 2 dars, 90 daqiqadan', 'courses.adult3.price': '600 000 so‘mdan/oy',
      'process.tag': 'Qanday boshlash', 'process.title': 'Birinchi darsgacha 4 oddiy qadam',
      'process.s1title': 'Ariza qoldiring', 'process.s1text': 'Formani to‘ldiring yoki Telegram’da yozing — bir daqiqadan kam vaqt ketadi.',
      'process.s2title': 'Darajangizni aniqlaymiz', 'process.s2text': 'O‘qituvchi bilan qisqa suhbat mos guruhni tanlashga yordam beradi.',
      'process.s3title': 'Sinov darsi', 'process.s3text': 'O‘qituvchi va dars formati bilan tanishasiz — bepul va majburiyatsiz.',
      'process.s4title': 'O‘qishni boshlash', 'process.s4text': 'Guruhga qo‘shilasiz yoki jadval bo‘yicha individual darslarni boshlaysiz.',
      'teachers.tag': 'Bizning jamoa', 'teachers.title': 'Ishonch bildiriladigan o‘qituvchilar',
      'teachers.t1name': 'Ustoz Said', 'teachers.t1role': 'Grammatika, kattalar uchun o‘qituvchi',
      'teachers.t1text': '8 yildan ortiq kattalarga arab tilidan dars beradi, so‘zlashuv amaliyotiga ixtisoslashgan.',
      'teachers.t2name': 'Madina Ahmedova', 'teachers.t2role': 'Bolalar uchun pedagog',
      'teachers.t2text': 'Bolalarga o‘yin, o‘qish va ijodiy topshiriqlar orqali arab tilini sevishga yordam beradi.',
      'teachers.t3name': 'Jasur Tursunov', 'teachers.t3role': 'Dastur kuratori',
      'teachers.t3text': 'Har bir o‘quvchining rivojini kuzatib boradi va individual ta’lim yo‘nalishini tanlaydi.',
      'reviews.tag': 'Fikrlar', 'reviews.title': 'O‘quvchi va ota-onalarimiz nima deydi',
      'reviews.r1text': '«O‘g‘lim yarim yildan beri o‘qiyapti — grammatika ancha tushunarli bo‘ldi, arab matnini ishonch va zavq bilan o‘qiydi.»',
      'reviews.r1name': 'Nilufar, o‘quvchi onasi', 'reviews.r1sub': '«Grammatika va o‘qish» kursi, 10 yosh',
      'reviews.r2text': '«Faqat nazariya emas, so‘zlashuvga yo‘naltirilgan kurs qidirgan edim. Aynan shu yerda topdim — endi oddiy iboralar bilan gapiraman.»',
      'reviews.r2name': 'Rustam, o‘quvchi', 'reviews.r2sub': '«So‘zlashuv arab tili» kursi',
      'reviews.r3text': '«Yoqimli muhit, o‘qituvchilar sabrli. Qizim har darsni sabrsizlik bilan kutadi va kichik matnlarni o‘zi o‘qiydi.»',
      'reviews.r3name': 'Dilnoza, o‘quvchi onasi', 'reviews.r3sub': '«Birinchi qadamlar» kursi, 8 yosh',
      'reviews.r4text': '«Qiziqish uchun sinov darsiga yozilgan edim — to‘liq kursda qoldim. Tushunarli dastur va darslarda jonli muloqot.»',
      'reviews.r4name': 'Aziz, o‘quvchi', 'reviews.r4sub': '«Noldan arab tili» kursi',
      'faq.tag': 'Savol-javob', 'faq.title': 'Tez-tez so‘raladigan savollarga javoblar',
      'faq.sub': 'Savolingizga javob topmadingizmi? Yozing — Telegram yoki telefon orqali javob beramiz.', 'faq.cta': 'Savol berish',
      'faq.q1': 'Ta’limni necha yoshdan boshlash mumkin?', 'faq.a1': 'Biz 6 yoshdan bolalarni va yosh chegarasisiz kattalarni qabul qilamiz. Dasturni qisqa suhbatdan so‘ng individual tanlaymiz.',
      'faq.q2': 'Arab tilidan bazaviy bilim kerakmi?', 'faq.a2': 'Yo‘q, bizda noldan boshlash guruhlari bor. Agar bazaviy bilim bo‘lsa, sinov darsida darajani aniqlab, mos guruhni tanlaymiz.',
      'faq.q3': 'Online darslar bormi?', 'faq.a3': 'Ha, istalgan shahardan online o‘qishingiz yoki Toshkentdagi markazimizga kelishingiz mumkin.',
      'faq.q4': 'Guruhda nechta kishi bor?', 'faq.a4': 'Guruhlar kichik — 8 kishigacha, shuning uchun o‘qituvchida har bir o‘quvchiga vaqt yetadi.',
      'faq.q5': 'Sinov darsi qanday o‘tadi?', 'faq.a5': 'Sinov darsi bepul, 30–40 daqiqa davom etadi. Hech qanday majburiyatsiz o‘qituvchi va dars formati bilan tanishasiz.',
      'trial.tag': 'Bepul sinov darsi', 'trial.title': 'Arab tiliga birinchi qadamni tashlang',
      'trial.sub': 'Ariza qoldiring — kun davomida bog‘lanamiz, guruh tanlaymiz va bepul sinov darsiga yozamiz.',
      'trial.point1': '✓ Oldindan to‘lovsiz va majburiyatsiz', 'trial.point2': '✓ Daraja va maqsadga mos dastur tanlash', 'trial.point3': '✓ Ish kuni davomida javob',
      'trial.nameLabel': 'Ismingiz', 'trial.namePh': 'Ism', 'trial.phoneLabel': 'Telefon', 'trial.courseLabel': 'Kimni yozamiz?',
      'trial.optKids': 'Bolani (grammatika va o‘qish)', 'trial.optAdult': 'Kattani (so‘zlashuv arab tili)', 'trial.optNotsure': 'Hali aniqlanmagan',
      'trial.commentLabel': 'Izoh (ixtiyoriy)', 'trial.commentPh': 'Qulay vaqt, savollar...', 'trial.submit': 'Ariza yuborish',
      'trial.note': '«Yuborish» tugmasini bosish orqali shaxsiy ma’lumotlarni qayta ishlashga rozilik bildirasiz.',
      'contact.tag': 'Aloqa', 'contact.title': 'Biz Toshkentda joylashganmiz',
      'contact.addressTitle': 'Manzil', 'contact.address': 'Toshkent sh., Mirobod tumani, Sebzor ko‘chasi, 12',
      'contact.phoneTitle': 'Telefon', 'contact.tgTitle': 'Telegram', 'contact.igTitle': 'Instagram',
      'contact.hoursTitle': 'Ish vaqti', 'contact.hours': 'Dush–Shan: 9:00–20:00, Yak: dam olish kuni',
      'footer.text': 'Toshkentdagi arab tili o‘quv markazi — bolalar va kattalar uchun kurslar, grammatika va jonli muloqot.',
      'footer.nav': 'Navigatsiya', 'footer.contact': 'Aloqa', 'footer.rights': 'Barcha huquqlar himoyalangan.',
      'toast.success': 'Rahmat! Telegram ochilmoqda — chatda arizani tasdiqlang.',
    },
    ar: {
      'nav.about': 'عن الأكاديمية', 'nav.courses': 'الدورات', 'nav.teachers': 'المعلمون',
      'nav.reviews': 'آراء الطلاب', 'nav.faq': 'الأسئلة الشائعة', 'nav.contact': 'تواصل معنا', 'nav.cta': 'حصة تجريبية',
      'hero.eyebrow': 'مركز تعليم اللغة العربية في طشقند',
      'hero.title': 'اكتشف عالم <span class="hl">اللغة العربية</span> مع أكاديمية العربية',
      'hero.sub': 'دورات للأطفال والكبار: قواعد، قراءة ومحادثة حية. معلمون ذوو خبرة، مجموعات صغيرة ونتائج ملموسة من الشهر الأول.',
      'hero.cta1': 'احجز حصة تجريبية', 'hero.cta2': 'استعرض الدورات',
      'hero.stat1': 'طالب وطالبة', 'hero.stat2': 'معلم ومعلمة', 'hero.stat3': 'سنوات خبرة', 'hero.stat4': 'أسرة راضية',
      'hero.badgeTitle': 'حصة', 'hero.badgeSub': 'تجريبية مجانية',
      'trust.line': 'تعليم حضوري وعن بُعد · مجموعات صغيرة حتى 8 طلاب · شهادة عند إتمام الدورة',
      'about.tag': 'عن الأكاديمية', 'about.title': 'أكاديمية العربية — حيث تصبح اللغة واضحة وسهلة',
      'about.p1': 'أنشأنا مركزًا يُدرَّس فيه اللغة العربية بأسلوب منهجي وحيوي يحترم الثقافة العربية. تجمع منهجيتنا بين القواعد الكلاسيكية والممارسة الشفوية، فلا يكتفي الطلاب بحفظ القواعد بل يبدؤون بالفهم والتحدث فعليًا.',
      'about.p2': 'نحن في طشقند، ونساعد منذ سنوات الأطفال والكبار على القراءة والكتابة والتحدث بثقة باللغة العربية في أجواء مريحة.',
      'about.point1': 'برنامج خاص للأطفال والكبار', 'about.point2': 'معلمون بتخصص أكاديمي في اللغة العربية',
      'about.point3': 'تقارير منتظمة لأولياء الأمور', 'about.point4': 'قاعات مريحة وخيار التعلم عن بُعد',
      'about.years': 'سنوات من تدريس اللغة العربية في طشقند',
      'why.tag': 'لماذا نحن', 'why.title': 'تعليم يحقق نتائج حقيقية',
      'why.card1title': 'منهجية خاصة بنا', 'why.card1text': 'برنامج مبني على مستويات — من الحروف الأولى إلى القراءة والتحدث بطلاقة، دون حشو نظري.',
      'why.card2title': 'معلمون ذوو خبرة', 'why.card2text': 'معلمون متخصصون بخبرة في تدريس الأطفال والكبار من جميع المستويات.',
      'why.card3title': 'مجموعات صغيرة', 'why.card3text': 'حتى 8 طلاب في المجموعة، لضمان الاهتمام الكافي والممارسة الشفوية لكل طالب.',
      'why.card4title': 'تقدّم ملموس', 'why.card4text': 'اختبارات منتظمة، تقييم مستمر وشهادة عند إتمام كل مستوى.',
      'why.card5title': 'حضوري وعن بُعد', 'why.card5text': 'تعلّم في قاعاتنا بطشقند أو انضم إلى الحصة من أي مكان في العالم.',
      'why.card6title': 'اهتمام بكل طالب', 'why.card6text': 'أجواء داعمة — راحة للأطفال، وحرية من الخطأ للكبار.',
      'courses.tag': 'البرامج التعليمية', 'courses.title': 'دورات للأطفال والكبار',
      'courses.sub': 'نختار البرنامج المناسب لعمرك ومستواك وهدفك — من الحروف الأولى إلى التحدث بثقة.',
      'courses.tabKids': 'للأطفال', 'courses.tabAdults': 'للكبار', 'courses.popular': 'الأكثر طلبًا', 'courses.cta': 'التسجيل',
      'courses.note': '* يُرجى تأكيد السعر والجدول الدقيق مع الإدارة — سنقترح البرنامج المناسب لمستواك.',
      'courses.kids1.level': '6–9 سنوات', 'courses.kids1.title': 'الخطوات الأولى: الحروف والقراءة',
      'courses.kids1.text': 'تعرّف على الحروف العربية وأصواتها والكلمات الأولى بأسلوب تفاعلي وممتع.',
      'courses.kids1.f1': 'الحروف العربية وكتابتها', 'courses.kids1.f2': 'قراءة كلمات ونصوص بسيطة',
      'courses.kids1.f3': 'حصتان أسبوعيًا لمدة 60 دقيقة', 'courses.kids1.price': 'من 350,000 سوم/شهر',
      'courses.kids2.level': '10–14 سنة', 'courses.kids2.title': 'القواعد والقراءة',
      'courses.kids2.text': 'دراسة منهجية لقواعد اللغة العربية وتطوير مهارة القراءة بثقة.',
      'courses.kids2.f1': 'أساسيات القواعد (الصرف والإعراب)', 'courses.kids2.f2': 'قراءة النصوص المناسبة للعمر وإعادة سردها',
      'courses.kids2.f3': '2–3 حصص أسبوعيًا لمدة 75 دقيقة', 'courses.kids2.price': 'من 420,000 سوم/شهر',
      'courses.kids3.level': '12–17 سنة', 'courses.kids3.title': 'القراءة والكتابة المتقدمة',
      'courses.kids3.text': 'لمن يقرأ بالفعل — نعمّق القواعد والكتابة والثروة اللغوية.',
      'courses.kids3.f1': 'قواعد ونحو متقدم', 'courses.kids3.f2': 'تدريبات كتابية وإنشاء',
      'courses.kids3.f3': 'حصتان أسبوعيًا لمدة 75 دقيقة', 'courses.kids3.price': 'من 420,000 سوم/شهر',
      'courses.adult1.level': 'مبتدئ', 'courses.adult1.title': 'العربية من الصفر',
      'courses.adult1.text': 'الحروف، القواعد الأساسية وأولى العبارات المحادثية للاستخدام اليومي.',
      'courses.adult1.f1': 'الحروف والقراءة والمفردات الأساسية', 'courses.adult1.f2': 'وحدات محادثة من أول حصة',
      'courses.adult1.f3': 'حصتان أسبوعيًا لمدة 90 دقيقة', 'courses.adult1.price': 'من 480,000 سوم/شهر',
      'courses.adult2.level': 'متوسط', 'courses.adult2.title': 'العربية المحادثة',
      'courses.adult2.text': 'محادثة واثقة في مواضيع الحياة اليومية والعمل، مع ممارسة شفوية حيّة.',
      'courses.adult2.f1': 'حوارات وتمثيل أدوار ومواقف عملية', 'courses.adult2.f2': 'توسيع الثروة اللغوية',
      'courses.adult2.f3': '2–3 حصص أسبوعيًا لمدة 90 دقيقة', 'courses.adult2.price': 'من 550,000 سوم/شهر',
      'courses.adult3.level': 'متقدم', 'courses.adult3.title': 'العربية للأعمال والتحدث الحر',
      'courses.adult3.text': 'لمن يريد التحدث بطلاقة: مواضيع معقدة، مراسلات عمل، وثقافة الكلام.',
      'courses.adult3.f1': 'قواعد وأسلوب متقدم', 'courses.adult3.f2': 'مفردات ومراسلات عمل',
      'courses.adult3.f3': 'حصتان أسبوعيًا لمدة 90 دقيقة', 'courses.adult3.price': 'من 600,000 سوم/شهر',
      'process.tag': 'كيف تبدأ', 'process.title': '4 خطوات بسيطة قبل أول حصة',
      'process.s1title': 'اترك طلبك', 'process.s1text': 'املأ النموذج أو راسلنا عبر تيليغرام — الأمر يستغرق أقل من دقيقة.',
      'process.s2title': 'نحدد مستواك', 'process.s2text': 'محادثة قصيرة مع المعلم تساعد في اختيار المجموعة المناسبة.',
      'process.s3title': 'حصة تجريبية', 'process.s3text': 'تتعرف على المعلم وأسلوب الحصص — مجانًا وبلا التزام.',
      'process.s4title': 'بدء التعلّم', 'process.s4text': 'تنضم إلى المجموعة أو تبدأ حصصًا فردية وفق الجدول.',
      'teachers.tag': 'فريقنا', 'teachers.title': 'معلمون موثوقون',
      'teachers.t1name': 'الأستاذ سعيد', 'teachers.t1role': 'قواعد اللغة، معلم الكبار',
      'teachers.t1text': 'يدرّس اللغة العربية للكبار منذ أكثر من 8 سنوات، متخصص في الممارسة المحادثية.',
      'teachers.t2name': 'مدينة أحمدوفا', 'teachers.t2role': 'معلمة الأطفال',
      'teachers.t2text': 'تساعد الأطفال على حب اللغة العربية من خلال اللعب والقراءة والأنشطة الإبداعية.',
      'teachers.t3name': 'جاسور تورسونوف', 'teachers.t3role': 'مشرف البرنامج',
      'teachers.t3text': 'يتابع تقدّم كل طالب ويختار المسار التعليمي المناسب له.',
      'reviews.tag': 'آراء الطلاب', 'reviews.title': 'ماذا يقول طلابنا وأولياء الأمور',
      'reviews.r1text': '«ابني يدرس منذ نصف عام — أصبحت القواعد أوضح بكثير، وأصبح يقرأ النص العربي بثقة ومتعة.»',
      'reviews.r1name': 'نيلوفار، والدة طالب', 'reviews.r1sub': 'دورة «القواعد والقراءة»، 10 سنوات',
      'reviews.r2text': '«بحثت طويلًا عن دورة تركّز على المحادثة وليس النظرية فقط. وجدت ذلك هنا بالضبط — أصبحت أتحدث بجمل بسيطة.»',
      'reviews.r2name': 'رستم، طالب', 'reviews.r2sub': 'دورة «العربية المحادثة»',
      'reviews.r3text': '«أجواء لطيفة، والمعلمون صبورون جدًا. ابنتي تنتظر كل حصة وأصبحت تقرأ نصوصًا قصيرة بنفسها.»',
      'reviews.r3name': 'دلنوزا، والدة طالبة', 'reviews.r3sub': 'دورة «الخطوات الأولى»، 8 سنوات',
      'reviews.r4text': '«سجلت في الحصة التجريبية بدافع الفضول، وبقيت للدورة كاملة. برنامج واضح وتواصل حي في الحصص.»',
      'reviews.r4name': 'عزيز، طالب', 'reviews.r4sub': 'دورة «العربية من الصفر»',
      'faq.tag': 'الأسئلة الشائعة', 'faq.title': 'إجابات عن أكثر الأسئلة تكرارًا',
      'faq.sub': 'لم تجد إجابة سؤالك؟ راسلنا وسنرد عبر تيليغرام أو الهاتف.', 'faq.cta': 'اطرح سؤالك',
      'faq.q1': 'من أي عمر يمكن البدء بالتعلّم؟', 'faq.a1': 'نستقبل الأطفال من سن 6 سنوات والكبار دون حد للعمر. نحدد البرنامج بشكل فردي بعد محادثة قصيرة.',
      'faq.q2': 'هل يلزم وجود معرفة أساسية باللغة العربية؟', 'faq.a2': 'لا، لدينا مجموعات للمبتدئين من الصفر. إذا كانت لديك معرفة أساسية، سنحدد مستواك في الحصة التجريبية ونختار المجموعة المناسبة.',
      'faq.q3': 'هل توجد حصص عن بُعد؟', 'faq.a3': 'نعم، يمكنك الدراسة عن بُعد من أي مدينة، أو الحضور إلى مركزنا في طشقند.',
      'faq.q4': 'كم عدد الطلاب في المجموعة؟', 'faq.a4': 'المجموعات صغيرة — حتى 8 طلاب، ما يتيح للمعلم وقتًا كافيًا لكل طالب.',
      'faq.q5': 'كيف تسير الحصة التجريبية؟', 'faq.a5': 'الحصة التجريبية مجانية وتستغرق 30–40 دقيقة. ستتعرف على المعلم وأسلوب الحصص دون أي التزام.',
      'trial.tag': 'حصة تجريبية مجانية', 'trial.title': 'اخطُ خطوتك الأولى نحو اللغة العربية',
      'trial.sub': 'اترك طلبك — سنتواصل معك خلال اليوم، ونختار المجموعة المناسبة ونحجز لك حصة تجريبية مجانية.',
      'trial.point1': '✓ بدون دفع مسبق أو التزام', 'trial.point2': '✓ اختيار برنامج يناسب مستواك وهدفك', 'trial.point3': '✓ الرد خلال يوم العمل',
      'trial.nameLabel': 'الاسم', 'trial.namePh': 'اسمك', 'trial.phoneLabel': 'رقم الهاتف', 'trial.courseLabel': 'لمن التسجيل؟',
      'trial.optKids': 'طفل (قواعد وقراءة)', 'trial.optAdult': 'شخص بالغ (محادثة)', 'trial.optNotsure': 'لم أحدد بعد',
      'trial.commentLabel': 'ملاحظات (اختياري)', 'trial.commentPh': 'وقت مناسب، أسئلة...', 'trial.submit': 'إرسال الطلب',
      'trial.note': 'بالضغط على «إرسال» فإنك توافق على معالجة بياناتك الشخصية.',
      'contact.tag': 'تواصل معنا', 'contact.title': 'نحن موجودون في طشقند',
      'contact.addressTitle': 'العنوان', 'contact.address': 'طشقند، حي ميراباد، شارع سبزار، 12',
      'contact.phoneTitle': 'الهاتف', 'contact.tgTitle': 'تيليغرام', 'contact.igTitle': 'إنستغرام',
      'contact.hoursTitle': 'ساعات العمل', 'contact.hours': 'الاثنين–السبت: 9:00–20:00، الأحد: عطلة',
      'footer.text': 'مركز تعليم اللغة العربية في طشقند — دورات للأطفال والكبار، قواعد ومحادثة حية.',
      'footer.nav': 'روابط', 'footer.contact': 'تواصل معنا', 'footer.rights': 'جميع الحقوق محفوظة.',
      'toast.success': 'شكرًا لك! يتم فتح تيليغرام — أكّد طلبك في المحادثة.',
    }
  };

  // capture RU defaults straight from the DOM so switching back to RU is lossless
  document.querySelectorAll('[data-i18n]').forEach(el => {
    translations.ru[el.dataset.i18n] = el.innerHTML;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    translations.ru[el.dataset.i18nPh] = el.getAttribute('placeholder');
  });

  let currentLang = localStorage.getItem('aoa_lang') || 'ru';

  function t(key, fallback) {
    return (translations[currentLang] && translations[currentLang][key]) || fallback || key;
  }

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const dict = translations[lang] || {};
      if (dict[key] !== undefined) el.innerHTML = dict[key];
      else if (translations.ru[key] !== undefined) el.innerHTML = translations.ru[key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.dataset.i18nPh;
      const dict = translations[lang] || {};
      el.setAttribute('placeholder', dict[key] !== undefined ? dict[key] : translations.ru[key]);
    });

    document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    localStorage.setItem('aoa_lang', lang);
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });

  if (currentLang !== 'ru') applyLang(currentLang);

});
