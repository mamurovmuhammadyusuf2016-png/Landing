/* Academy of Arabic — translations (RU / UZ / AR) */
const TRANSLATIONS = {

/* =========================== RUSSIAN =========================== */
ru: {
  nav: {
    tagline: "Учебный центр арабского языка",
    about: "О центре", courses: "Курсы", teachers: "Преподаватели",
    reviews: "Отзывы", faq: "Вопросы", contact: "Контакты", cta: "Записаться"
  },
  hero: {
    badge: "№1 центр арабского языка в Ташкенте",
    title1: "Арабский язык", title2: "с носителями,", title3: "который вы полюбите",
    subtitle: "Общий и коранический арабский, разговорные диалекты и подготовка к экзаменам. Группы до 8 человек, преподаватели-носители и опытные устазы, гибкое расписание в центре Ташкента и онлайн.",
    ctaPrimary: "Бесплатный пробный урок", ctaSecondary: "Смотреть курсы",
    statsStudents: "выпускников", statsTeachers: "преподавателей", statsYears: "лет опыта", statsRating: "рейтинг учеников",
    floatSatisfaction: "довольны обучением", floatGroups: "до 8 чел.", floatGroupsLabel: "в группе"
  },
  about: {
    badgeLabel: "год основания центра",
    tag: "О центре",
    title: "Место, где арабский язык становится понятным и близким",
    lead: "Academy of Arabic — учебный центр в Ташкенте, где взрослые и дети изучают арабский язык системно: от алфавита и таджвида до свободной разговорной речи и подготовки к международным экзаменам.",
    text: "Мы объединили классическую методику арабских университетов с современным подходом к преподаванию языка: маленькие группы, разговорная практика с первого занятия и постоянная обратная связь от преподавателя.",
    point1Title: "Носители языка", point1Desc: "Часть занятий ведут преподаватели — носители арабского языка из арабских стран.",
    point2Title: "Малые группы", point2Desc: "До 8 учеников в группе — внимание каждому и быстрый прогресс.",
    point3Title: "Гибкий формат", point3Desc: "Офлайн-занятия в Ташкенте и онлайн-формат из любой точки мира.",
    point4Title: "Сертификат", point4Desc: "По окончании курса — сертификат центра с указанием уровня владения языком."
  },
  features: {
    tag: "Почему мы", title: "Всё для комфортного и результативного обучения",
    subtitle: "Мы убрали из обучения всё лишнее и оставили то, что действительно ведёт к результату.",
    item1Title: "Опытные устазы", item1Desc: "Преподаватели с профильным образованием и опытом от 5 лет.",
    item2Title: "Разговорная практика", item2Desc: "Уже с первых занятий вы начинаете говорить, а не только зубрить грамматику.",
    item3Title: "Коранический арабский", item3Desc: "Отдельные курсы по таджвиду и чтению Корана для любого уровня подготовки.",
    item4Title: "Прозрачный прогресс", item4Desc: "Регулярные тесты и обратная связь — вы всегда видите свой уровень.",
    item5Title: "Удобное расписание", item5Desc: "Утренние, вечерние и выходные группы — подберём удобное время.",
    item6Title: "Бесплатный пробный урок", item6Desc: "Познакомитесь с преподавателем и форматом занятий перед оплатой курса."
  },
  courses: {
    tag: "Направления", title: "Курсы арабского языка",
    subtitle: "Выберите программу под свою цель — от первых слов до свободного общения и работы с текстами.",
    priceMonth: "/ месяц", priceLesson: "/ занятие", popular: "Популярно", cta: "Записаться",
    item1Level: "A1–C1", item1Title: "Общий арабский язык",
    item1Desc: "Полный курс современного стандартного арабского (фусха): чтение, письмо, грамматика и речь по уровням от начального до продвинутого.",
    item1Duration: "3 занятия / неделю", item1Price: "450 000 сум",
    item2Level: "Все уровни", item2Title: "Коранический арабский и таджвид",
    item2Desc: "Правильное чтение Корана, правила таджвида и понимание коранической лексики — для тех, кто хочет читать и понимать Коран.",
    item2Duration: "2 занятия / неделю", item2Price: "400 000 сум",
    item3Level: "A2–B2", item3Title: "Разговорный арабский",
    item3Desc: "Живой разговорный арабский (диалекты Леванта и Египта) для путешествий, работы и общения с носителями языка.",
    item3Duration: "2 занятия / неделю", item3Price: "420 000 сум",
    item4Level: "7–14 лет", item4Title: "Арабский для детей",
    item4Desc: "Игровой формат обучения: алфавит, первые слова и фразы, основы чтения Корана — с учётом возраста ребёнка.",
    item4Duration: "2 занятия / неделю", item4Price: "350 000 сум",
    item5Level: "B2–C1", item5Title: "Подготовка к экзаменам",
    item5Desc: "Подготовка к сертификационным тестам по арабскому языку и вступительным экзаменам в зарубежные университеты.",
    item5Duration: "3 занятия / неделю", item5Price: "500 000 сум",
    item6Level: "Индивидуально", item6Title: "Индивидуальные онлайн-занятия",
    item6Desc: "Персональная программа под ваш уровень и цели, гибкое расписание, занятия из любой точки мира.",
    item6Duration: "по расписанию", item6Price: "120 000 сум"
  },
  process: {
    tag: "Как начать", title: "Четыре шага до первого занятия",
    step1Title: "Оставьте заявку", step1Desc: "Заполните форму на сайте или напишите нам в Telegram — это займёт минуту.",
    step2Title: "Бесплатный пробный урок", step2Desc: "Познакомитесь с преподавателем, форматом занятий и программой курса.",
    step3Title: "Определение уровня", step3Desc: "Подберём группу или индивидуальную программу под ваш текущий уровень.",
    step4Title: "Начало обучения", step4Desc: "Регулярные занятия, поддержка преподавателя и понятный прогресс."
  },
  teachers: {
    tag: "Команда", title: "Преподаватели, которым доверяют ученики",
    subtitle: "Носители языка и опытные устазы с профильным лингвистическим и исламским образованием.",
    t1Name: "Ахмад Аль-Фахад", t1Role: "Носитель языка, разговорный арабский",
    t1Bio: "Из Иордании. Преподаёт разговорный и литературный арабский, 8 лет опыта работы со студентами из СНГ.",
    t2Name: "Зилола Рахимова", t2Role: "Общий арабский язык, подготовка к экзаменам",
    t2Bio: "Выпускница факультета арабской филологии, 6 лет преподавания, готовит студентов к поступлению за рубеж.",
    t3Name: "Устоз Абдулла Каримов", t3Role: "Таджвид и коранический арабский",
    t3Bio: "Обучался в Египте, преподаёт таджвид и чтение Корана детям и взрослым более 9 лет.",
    t4Name: "Лейла Хасан", t4Role: "Носитель языка, детские группы",
    t4Bio: "Из Сирии. Специализируется на обучении детей 7–14 лет в игровом формате."
  },
  reviews: {
    tag: "Отзывы", title: "Что говорят наши ученики",
    r1Text: "«Пришла совсем без базы, за полгода уже читаю и понимаю простые тексты. Преподаватели очень терпеливые и всегда объясняют, пока не станет понятно».",
    r1Name: "Нигора С.", r1Course: "Общий арабский язык",
    r2Text: "«Записал сына на курс таджвида — за год он начал уверенно читать Коран. Отдельное спасибо устазу за подход к детям».",
    r2Name: "Жасур М.", r2Course: "Коранический арабский",
    r3Text: "«Занятия с носителем языка — это огромная разница. За 3 месяца заговорила увереннее, чем за год самостоятельного изучения».",
    r3Name: "Дилноза А.", r3Course: "Разговорный арабский",
    r4Text: "«Готовился к экзамену на поступление — программа выстроена чётко, преподаватель разбирал все слабые места. Поступил с первого раза».",
    r4Name: "Рустам Т.", r4Course: "Подготовка к экзаменам"
  },
  faq: {
    tag: "Вопросы", title: "Частые вопросы",
    subtitle: "Не нашли ответ на свой вопрос? Напишите нам, мы ответим в течение дня.",
    cta: "Задать вопрос",
    q1: "С какого уровня можно начать обучение?",
    a1: "С нуля — большинство наших учеников начинают без базовых знаний арабского. Мы определим стартовый уровень на пробном занятии и подберём подходящую группу.",
    q2: "Сколько человек в группе?",
    a2: "Не более 8 учеников в группе — это позволяет преподавателю уделять внимание каждому и практиковать речь на каждом занятии.",
    q3: "Можно ли заниматься онлайн?",
    a3: "Да, доступны как офлайн-занятия в нашем центре в Ташкенте, так и онлайн-формат для учеников из других городов и стран.",
    q4: "Пробный урок действительно бесплатный?",
    a4: "Да, первое занятие бесплатное и ни к чему не обязывает — вы сможете оценить формат и преподавателя перед оплатой курса.",
    q5: "Выдаёте ли вы сертификат?",
    a5: "По окончании курса каждый ученик получает сертификат центра с указанием пройденного уровня и количества часов.",
    q6: "Как проходит оплата обучения?",
    a6: "Оплата помесячная, после бесплатного пробного занятия. Доступна оплата за отдельные занятия для индивидуального формата."
  },
  contact: {
    tag: "Контакты", title: "Запишитесь на бесплатный пробный урок",
    subtitle: "Оставьте заявку — мы свяжемся с вами в Telegram или по телефону в течение рабочего дня и подберём удобное время занятия.",
    addressLabel: "Адрес", address: "г. Ташкент, Мирабадский р-н, ул. Тарона, 12",
    phoneLabel: "Телефон", hoursLabel: "Часы работы", hours: "Пн–Сб: 9:00–20:00",
    formTitle: "Заявка на пробный урок",
    formName: "Ваше имя", formNamePh: "Иван Иванов",
    formPhone: "Номер телефона",
    formCourse: "Интересующий курс", formCourseDefault: "Не определился(-ась)",
    formMessage: "Комментарий (необязательно)", formMessagePh: "Удобное время, уровень языка, вопросы...",
    formSubmit: "Отправить заявку в Telegram",
    formPrivacy: "Отправляя форму, вы соглашаетесь на обработку персональных данных.",
    successTitle: "Заявка почти отправлена!",
    successText: "Сейчас откроется Telegram — просто нажмите «Отправить», и мы свяжемся с вами в ближайшее время."
  },
  footer: {
    about: "Учебный центр арабского языка в Ташкенте: общий и коранический арабский, разговорные курсы и подготовка к экзаменам.",
    linksTitle: "Разделы", contactTitle: "Контакты", followTitle: "Мы в соцсетях",
    rights: "Все права защищены."
  }
},

/* =========================== UZBEK (LOTIN) =========================== */
uz: {
  nav: {
    tagline: "Arab tili o'quv markazi",
    about: "Markaz haqida", courses: "Kurslar", teachers: "O'qituvchilar",
    reviews: "Fikrlar", faq: "Savollar", contact: "Aloqa", cta: "Yozilish"
  },
  hero: {
    badge: "Toshkentdagi №1 arab tili markazi",
    title1: "Ona tili sohiblari bilan", title2: "arab tili,", title3: "sevib qoladigan darslar",
    subtitle: "Umumiy va Qur'oniy arab tili, so'zlashuv shevalari va imtihonlarga tayyorgarlik. 8 nafargacha kichik guruhlar, ona tili sohiblari va tajribali ustozlar, Toshkent markazida va onlayn qulay jadval.",
    ctaPrimary: "Bepul sinov darsi", ctaSecondary: "Kurslarni ko'rish",
    statsStudents: "bitiruvchi", statsTeachers: "o'qituvchi", statsYears: "yillik tajriba", statsRating: "o'quvchilar bahosi",
    floatSatisfaction: "ta'limdan mamnun", floatGroups: "8 nafargacha", floatGroupsLabel: "guruhda"
  },
  about: {
    badgeLabel: "markaz tashkil topgan yil",
    tag: "Markaz haqida",
    title: "Arab tili tushunarli va yaqin bo'ladigan joy",
    lead: "Academy of Arabic — Toshkentdagi o'quv markazi bo'lib, kattalar va bolalar arab tilini tizimli o'rganadi: alifbo va tajviddan erkin so'zlashuvgacha hamda xalqaro imtihonlarga tayyorgarlikkacha.",
    text: "Biz arab universitetlarining klassik metodikasini zamonaviy o'qitish yondashuvi bilan birlashtirdik: kichik guruhlar, birinchi darsdanoq amaliy suhbat va o'qituvchidan doimiy fikr-mulohaza.",
    point1Title: "Ona tili sohiblari", point1Desc: "Darslarning bir qismini arab davlatlaridan bo'lgan ona tili sohiblari olib boradi.",
    point2Title: "Kichik guruhlar", point2Desc: "Guruhda 8 nafargacha o'quvchi — har biriga e'tibor va tez natija.",
    point3Title: "Qulay format", point3Desc: "Toshkentda oflayn darslar va dunyoning istalgan nuqtasidan onlayn format.",
    point4Title: "Sertifikat", point4Desc: "Kurs yakunida til darajasi ko'rsatilgan markaz sertifikati beriladi."
  },
  features: {
    tag: "Nega aynan biz", title: "Qulay va samarali ta'lim uchun barcha shart-sharoit",
    subtitle: "Biz ta'limdan barcha ortiqcha narsalarni olib tashladik va faqat natijaga olib keladigan narsalarni qoldirdik.",
    item1Title: "Tajribali ustozlar", item1Desc: "5 yildan ortiq tajribaga ega, ixtisoslashgan ta'limli o'qituvchilar.",
    item2Title: "Amaliy suhbat", item2Desc: "Birinchi darsdanoq faqat grammatikani yodlamaysiz, balki gapira boshlaysiz.",
    item3Title: "Qur'oniy arab tili", item3Desc: "Har qanday tayyorgarlik darajasi uchun tajvid va Qur'on tilovati bo'yicha alohida kurslar.",
    item4Title: "Aniq natija nazorati", item4Desc: "Muntazam testlar va fikr-mulohaza — o'z darajangizni doim ko'rasiz.",
    item5Title: "Qulay jadval", item5Desc: "Ertalabki, kechki va dam olish kuni guruhlari — qulay vaqtni tanlaymiz.",
    item6Title: "Bepul sinov darsi", item6Desc: "Kursga to'lov qilishdan oldin o'qituvchi va dars formati bilan tanishasiz."
  },
  courses: {
    tag: "Yo'nalishlar", title: "Arab tili kurslari",
    subtitle: "Maqsadingizga mos dasturni tanlang — birinchi so'zlardan erkin muloqot va matnlar bilan ishlashgacha.",
    priceMonth: "/ oyiga", priceLesson: "/ dars", popular: "Ommabop", cta: "Yozilish",
    item1Level: "A1–C1", item1Title: "Umumiy arab tili",
    item1Desc: "Zamonaviy standart arab tili (fusho) bo'yicha to'liq kurs: boshlang'ichdan yuqori darajagacha o'qish, yozish, grammatika va nutq.",
    item1Duration: "haftada 3 dars", item1Price: "450 000 so'm",
    item2Level: "Barcha darajalar", item2Title: "Qur'oniy arab tili va tajvid",
    item2Desc: "Qur'onni to'g'ri tilovat qilish, tajvid qoidalari va Qur'on lug'atini tushunish — Qur'onni o'qib, tushunmoqchi bo'lganlar uchun.",
    item2Duration: "haftada 2 dars", item2Price: "400 000 so'm",
    item3Level: "A2–B2", item3Title: "So'zlashuv arab tili",
    item3Desc: "Sayohat, ish va ona tili sohiblari bilan muloqot uchun jonli so'zlashuv arab tili (Levant va Misr shevalari).",
    item3Duration: "haftada 2 dars", item3Price: "420 000 so'm",
    item4Level: "7–14 yosh", item4Title: "Bolalar uchun arab tili",
    item4Desc: "O'yin shaklidagi ta'lim: alifbo, birinchi so'z va iboralar, bola yoshini hisobga olgan holda Qur'on o'qish asoslari.",
    item4Duration: "haftada 2 dars", item4Price: "350 000 so'm",
    item5Level: "B2–C1", item5Title: "Imtihonlarga tayyorgarlik",
    item5Desc: "Arab tili bo'yicha sertifikatlashtirish testlari va xorijiy universitetlarga kirish imtihonlariga tayyorgarlik.",
    item5Duration: "haftada 3 dars", item5Price: "500 000 so'm",
    item6Level: "Individual", item6Title: "Individual onlayn darslar",
    item6Desc: "Darajangiz va maqsadingizga mos shaxsiy dastur, qulay jadval, dunyoning istalgan nuqtasidan darslar.",
    item6Duration: "jadval asosida", item6Price: "120 000 so'm"
  },
  process: {
    tag: "Qanday boshlash", title: "Birinchi darsgacha to'rt qadam",
    step1Title: "Ariza qoldiring", step1Desc: "Saytdagi formani to'ldiring yoki Telegramda yozing — bu bir daqiqa vaqt oladi.",
    step2Title: "Bepul sinov darsi", step2Desc: "O'qituvchi, dars formati va kurs dasturi bilan tanishasiz.",
    step3Title: "Daraja aniqlash", step3Desc: "Hozirgi darajangizga mos guruh yoki individual dastur tanlanadi.",
    step4Title: "Ta'limni boshlash", step4Desc: "Muntazam darslar, o'qituvchi qo'llab-quvvatlashi va aniq natija."
  },
  teachers: {
    tag: "Jamoa", title: "O'quvchilar ishonadigan o'qituvchilar",
    subtitle: "Ona tili sohiblari va ixtisoslashgan lingvistik hamda islomiy ta'limga ega tajribali ustozlar.",
    t1Name: "Ahmad Al-Fahad", t1Role: "Ona tili sohibi, so'zlashuv arab tili",
    t1Bio: "Iordaniyadan. So'zlashuv va adabiy arab tilini o'rgatadi, MDH talabalari bilan 8 yillik tajriba.",
    t2Name: "Zilola Rahimova", t2Role: "Umumiy arab tili, imtihonlarga tayyorgarlik",
    t2Bio: "Arab filologiyasi fakulteti bitiruvchisi, 6 yillik tajriba, talabalarni xorijga o'qishga kirish uchun tayyorlaydi.",
    t3Name: "Ustoz Abdulla Karimov", t3Role: "Tajvid va Qur'oniy arab tili",
    t3Bio: "Misrda tahsil olgan, bolalar va kattalarga 9 yildan ortiq tajvid va Qur'on tilovatini o'rgatadi.",
    t4Name: "Layla Hasan", t4Role: "Ona tili sohibi, bolalar guruhlari",
    t4Bio: "Suriyadan. 7–14 yoshli bolalarni o'yin shaklida o'qitishga ixtisoslashgan."
  },
  reviews: {
    tag: "Fikrlar", title: "O'quvchilarimiz nima deydi",
    r1Text: "«Hech qanday bazasiz keldim, yarim yilda oddiy matnlarni o'qib, tushuna oladigan bo'ldim. O'qituvchilar juda sabrli va tushunguncha tushuntiraveradi».",
    r1Name: "Nigora S.", r1Course: "Umumiy arab tili",
    r2Text: "«O'g'limni tajvid kursiga yozdirdim — bir yilda Qur'onni ishonch bilan o'qiy boshladi. Bolalarga yondashuvi uchun ustozga alohida rahmat».",
    r2Name: "Jasur M.", r2Course: "Qur'oniy arab tili",
    r3Text: "«Ona tili sohibi bilan darslar — bu katta farq. 3 oyda mustaqil o'rgangan bir yildan ko'ra ishonchliroq gapira boshladim».",
    r3Name: "Dilnoza A.", r3Course: "So'zlashuv arab tili",
    r4Text: "«Kirish imtihoniga tayyorlanayotgandim — dastur aniq tuzilgan, o'qituvchi barcha zaif tomonlarni ko'rib chiqdi. Birinchi urinishda kirdim».",
    r4Name: "Rustam T.", r4Course: "Imtihonlarga tayyorgarlik"
  },
  faq: {
    tag: "Savollar", title: "Ko'p beriladigan savollar",
    subtitle: "Savolingizga javob topa olmadingizmi? Bizga yozing, bir kun ichida javob beramiz.",
    cta: "Savol berish",
    q1: "Qaysi darajadan o'rganishni boshlash mumkin?",
    a1: "Noldan — o'quvchilarimizning aksariyati arab tili bo'yicha bazaviy bilimsiz boshlaydi. Sinov darsida boshlang'ich darajangizni aniqlaymiz va mos guruh tanlaymiz.",
    q2: "Guruhda nechta kishi bo'ladi?",
    a2: "Guruhda 8 nafardan ko'p bo'lmaydi — bu o'qituvchiga har biriga e'tibor berish va har darsda nutqni mashq qilish imkonini beradi.",
    q3: "Onlayn shug'ullanish mumkinmi?",
    a3: "Ha, markazimizda Toshkentda oflayn darslar ham, boshqa shahar va davlatlardagi o'quvchilar uchun onlayn format ham mavjud.",
    q4: "Sinov darsi haqiqatan ham bepulmi?",
    a4: "Ha, birinchi dars bepul va hech narsaga majburlamaydi — kursga to'lov qilishdan oldin format va o'qituvchini baholab ko'rasiz.",
    q5: "Sertifikat berasizmi?",
    a5: "Kurs yakunida har bir o'quvchi o'tilgan daraja va soatlar soni ko'rsatilgan markaz sertifikatini oladi.",
    q6: "To'lov qanday amalga oshiriladi?",
    a6: "To'lov bepul sinov darsidan so'ng, oylik asosda amalga oshiriladi. Individual format uchun alohida darslar bo'yicha to'lov ham mavjud."
  },
  contact: {
    tag: "Aloqa", title: "Bepul sinov darsiga yoziling",
    subtitle: "Ariza qoldiring — biz siz bilan ish kuni davomida Telegram yoki telefon orqali bog'lanamiz va qulay dars vaqtini kelishamiz.",
    addressLabel: "Manzil", address: "Toshkent sh., Mirobod tumani, Tarona ko'chasi, 12-uy",
    phoneLabel: "Telefon", hoursLabel: "Ish vaqti", hours: "Dush–Shan: 9:00–20:00",
    formTitle: "Sinov darsiga ariza",
    formName: "Ismingiz", formNamePh: "Ism Familiya",
    formPhone: "Telefon raqami",
    formCourse: "Qiziqtirgan kurs", formCourseDefault: "Hali aniqlamaganman",
    formMessage: "Izoh (ixtiyoriy)", formMessagePh: "Qulay vaqt, til darajasi, savollar...",
    formSubmit: "Telegram orqali ariza yuborish",
    formPrivacy: "Formani yuborish orqali shaxsiy ma'lumotlaringizni qayta ishlashga rozilik bildirasiz.",
    successTitle: "Ariza deyarli yuborildi!",
    successText: "Hozir Telegram ochiladi — shunchaki «Yuborish» tugmasini bosing, biz tez orada siz bilan bog'lanamiz."
  },
  footer: {
    about: "Toshkentdagi arab tili o'quv markazi: umumiy va Qur'oniy arab tili, so'zlashuv kurslari va imtihonlarga tayyorgarlik.",
    linksTitle: "Bo'limlar", contactTitle: "Aloqa", followTitle: "Ijtimoiy tarmoqlarda",
    rights: "Barcha huquqlar himoyalangan."
  }
},

/* =========================== ARABIC =========================== */
ar: {
  nav: {
    tagline: "مركز تعليم اللغة العربية",
    about: "عن المركز", courses: "الدورات", teachers: "المعلمون",
    reviews: "الآراء", faq: "الأسئلة", contact: "تواصل معنا", cta: "التسجيل"
  },
  hero: {
    badge: "المركز رقم ١ لتعليم العربية في طشقند",
    title1: "لغة عربية", title2: "مع متحدثين أصليين،", title3: "ستقع في حبها",
    subtitle: "عربية فصحى وقرآنية، لهجات محكية وتحضير للاختبارات. مجموعات لا تتجاوز ٨ طلاب، معلمون أصليون وأساتذة ذوو خبرة، وجدول مرن في مركز طشقند وعبر الإنترنت.",
    ctaPrimary: "درس تجريبي مجاني", ctaSecondary: "عرض الدورات",
    statsStudents: "خريج", statsTeachers: "معلم", statsYears: "سنوات خبرة", statsRating: "تقييم الطلاب",
    floatSatisfaction: "راضون عن التعليم", floatGroups: "حتى ٨ طلاب", floatGroupsLabel: "في المجموعة"
  },
  about: {
    badgeLabel: "سنة تأسيس المركز",
    tag: "عن المركز",
    title: "المكان الذي تصبح فيه اللغة العربية مفهومة وقريبة إليك",
    lead: "Academy of Arabic مركز تعليمي في طشقند يتعلم فيه الكبار والصغار اللغة العربية بشكل منهجي: من الحروف الأبجدية والتجويد إلى الحديث الحر والتحضير للاختبارات الدولية.",
    text: "جمعنا بين المنهج الكلاسيكي للجامعات العربية وأسلوب حديث في تدريس اللغة: مجموعات صغيرة، ممارسة المحادثة من الدرس الأول، وتغذية راجعة مستمرة من المعلم.",
    point1Title: "متحدثون أصليون", point1Desc: "يقدّم جزءًا من الدروس معلمون ناطقون أصليون بالعربية من دول عربية.",
    point2Title: "مجموعات صغيرة", point2Desc: "حتى ٨ طلاب في المجموعة — اهتمام بكل طالب وتقدّم سريع.",
    point3Title: "صيغة مرنة", point3Desc: "دروس حضورية في طشقند وصيغة عبر الإنترنت من أي مكان في العالم.",
    point4Title: "شهادة", point4Desc: "شهادة من المركز عند إتمام الدورة تُبيّن المستوى المكتسب في اللغة."
  },
  features: {
    tag: "لماذا نحن", title: "كل ما تحتاجه لتعليم مريح وفعّال",
    subtitle: "أزلنا من التعليم كل ما هو غير ضروري وأبقينا على ما يقود فعلاً إلى نتيجة.",
    item1Title: "أساتذة ذوو خبرة", item1Desc: "معلمون بتخصص أكاديمي وخبرة تفوق ٥ سنوات.",
    item2Title: "ممارسة المحادثة", item2Desc: "تبدأ بالتحدث منذ الدروس الأولى، وليس فقط حفظ القواعد.",
    item3Title: "العربية القرآنية", item3Desc: "دورات مستقلة في التجويد وتلاوة القرآن لأي مستوى من الاستعداد.",
    item4Title: "تقدّم واضح", item4Desc: "اختبارات منتظمة وتغذية راجعة — ترى مستواك دائمًا.",
    item5Title: "جدول مريح", item5Desc: "مجموعات صباحية ومسائية وفي عطلة نهاية الأسبوع — نختار لك الوقت المناسب.",
    item6Title: "درس تجريبي مجاني", item6Desc: "تتعرف على المعلم وصيغة الدروس قبل الدفع مقابل الدورة."
  },
  courses: {
    tag: "المسارات", title: "دورات اللغة العربية",
    subtitle: "اختر البرنامج المناسب لهدفك — من الكلمات الأولى إلى التواصل الحر والعمل مع النصوص.",
    priceMonth: "/ شهريًا", priceLesson: "/ درس", popular: "الأكثر طلبًا", cta: "التسجيل",
    item1Level: "A1–C1", item1Title: "اللغة العربية العامة",
    item1Desc: "دورة كاملة في العربية الفصحى المعاصرة: قراءة وكتابة وقواعد ومحادثة بمستويات من المبتدئ إلى المتقدم.",
    item1Duration: "٣ دروس / أسبوعيًا", item1Price: "450,000 سوم",
    item2Level: "كل المستويات", item2Title: "العربية القرآنية والتجويد",
    item2Desc: "تلاوة صحيحة للقرآن الكريم، أحكام التجويد وفهم المفردات القرآنية — لمن يريد قراءة القرآن وفهمه.",
    item2Duration: "٢ دروس / أسبوعيًا", item2Price: "400,000 سوم",
    item3Level: "A2–B2", item3Title: "العربية المحكية",
    item3Desc: "عربية محكية حيّة (لهجات شامية ومصرية) للسفر والعمل والتواصل مع الناطقين الأصليين.",
    item3Duration: "٢ دروس / أسبوعيًا", item3Price: "420,000 سوم",
    item4Level: "٧–١٤ سنة", item4Title: "العربية للأطفال",
    item4Desc: "تعليم بأسلوب اللعب: الحروف الأبجدية، الكلمات والعبارات الأولى، وأساسيات تلاوة القرآن حسب عمر الطفل.",
    item4Duration: "٢ دروس / أسبوعيًا", item4Price: "350,000 سوم",
    item5Level: "B2–C1", item5Title: "التحضير للاختبارات",
    item5Desc: "التحضير لاختبارات إتقان اللغة العربية المعتمدة واختبارات القبول في الجامعات الأجنبية.",
    item5Duration: "٣ دروس / أسبوعيًا", item5Price: "500,000 سوم",
    item6Level: "فردي", item6Title: "دروس فردية عبر الإنترنت",
    item6Desc: "برنامج شخصي يناسب مستواك وأهدافك، جدول مرن، ودروس من أي مكان في العالم.",
    item6Duration: "حسب الجدول", item6Price: "120,000 سوم"
  },
  process: {
    tag: "كيف تبدأ", title: "أربع خطوات حتى الدرس الأول",
    step1Title: "اترك طلبًا", step1Desc: "املأ النموذج على الموقع أو راسلنا عبر Telegram — الأمر يستغرق دقيقة واحدة.",
    step2Title: "درس تجريبي مجاني", step2Desc: "تتعرف على المعلم وصيغة الدروس وبرنامج الدورة.",
    step3Title: "تحديد المستوى", step3Desc: "نختار لك مجموعة أو برنامجًا فرديًا يناسب مستواك الحالي.",
    step4Title: "بدء التعلّم", step4Desc: "دروس منتظمة، دعم من المعلم، وتقدّم واضح."
  },
  teachers: {
    tag: "الفريق", title: "معلمون يثق بهم الطلاب",
    subtitle: "متحدثون أصليون وأساتذة ذوو خبرة وتخصص لغوي وشرعي.",
    t1Name: "أحمد الفهد", t1Role: "متحدث أصلي، العربية المحكية",
    t1Bio: "من الأردن. يدرّس العربية المحكية والفصحى، وله ٨ سنوات خبرة مع طلاب من دول رابطة الدول المستقلة.",
    t2Name: "زيلولا رحيموفا", t2Role: "العربية العامة، التحضير للاختبارات",
    t2Bio: "خريجة كلية اللغة العربية وآدابها، ٦ سنوات خبرة في التدريس، تُحضّر الطلاب للقبول في الجامعات الأجنبية.",
    t3Name: "الأستاذ عبدالله كريموف", t3Role: "التجويد والعربية القرآنية",
    t3Bio: "تلقى تعليمه في مصر، ويُدرّس التجويد وتلاوة القرآن للأطفال والكبار منذ أكثر من ٩ سنوات.",
    t4Name: "ليلى حسن", t4Role: "متحدثة أصلية، مجموعات الأطفال",
    t4Bio: "من سوريا. متخصصة في تعليم الأطفال من ٧ إلى ١٤ سنة بأسلوب اللعب."
  },
  reviews: {
    tag: "الآراء", title: "ماذا يقول طلابنا",
    r1Text: "«جئت بلا أي أساس، وخلال نصف عام أصبحت أقرأ وأفهم نصوصًا بسيطة. المعلمون صبورون جدًا ويشرحون حتى يتضح الأمر تمامًا».",
    r1Name: "نيغورا س.", r1Course: "اللغة العربية العامة",
    r2Text: "«سجّلت ابني في دورة التجويد — وخلال سنة بدأ يقرأ القرآن بثقة. شكر خاص للأستاذ على أسلوبه مع الأطفال».",
    r2Name: "جسور م.", r2Course: "العربية القرآنية",
    r3Text: "«الدروس مع متحدث أصلي فرق كبير جدًا. خلال ٣ أشهر أصبحت أتحدث بثقة أكبر من سنة كاملة من التعلّم الذاتي».",
    r3Name: "دلنوزا أ.", r3Course: "العربية المحكية",
    r4Text: "«كنت أستعد لاختبار القبول — البرنامج منظم بوضوح، وراجع المعلم كل نقاط ضعفي. قُبلت من أول محاولة».",
    r4Name: "رستم ت.", r4Course: "التحضير للاختبارات"
  },
  faq: {
    tag: "الأسئلة", title: "الأسئلة الشائعة",
    subtitle: "لم تجد إجابة لسؤالك؟ راسلنا وسنرد خلال يوم واحد.",
    cta: "اطرح سؤالًا",
    q1: "من أي مستوى يمكن بدء التعلّم؟",
    a1: "من الصفر — معظم طلابنا يبدؤون دون أي معرفة أساسية بالعربية. سنحدد مستواك في الدرس التجريبي ونختار لك المجموعة المناسبة.",
    q2: "كم عدد الطلاب في المجموعة؟",
    a2: "لا يزيد عن ٨ طلاب في المجموعة — ما يتيح للمعلم الاهتمام بكل طالب وممارسة المحادثة في كل درس.",
    q3: "هل يمكن الدراسة عبر الإنترنت؟",
    a3: "نعم، تتوفر دروس حضورية في مركزنا بطشقند وكذلك صيغة عبر الإنترنت للطلاب من مدن ودول أخرى.",
    q4: "هل الدرس التجريبي مجاني حقًا؟",
    a4: "نعم، الدرس الأول مجاني ولا يُلزمك بشيء — يمكنك تقييم الصيغة والمعلم قبل الدفع مقابل الدورة.",
    q5: "هل تمنحون شهادة؟",
    a5: "عند إتمام الدورة يحصل كل طالب على شهادة من المركز تُبيّن المستوى وعدد الساعات المُنجزة.",
    q6: "كيف يتم دفع رسوم التعليم؟",
    a6: "الدفع شهري بعد الدرس التجريبي المجاني. كما يتوفر الدفع لكل درس على حدة في الصيغة الفردية."
  },
  contact: {
    tag: "تواصل معنا", title: "سجّل للحصول على درس تجريبي مجاني",
    subtitle: "اترك طلبًا وسنتواصل معك عبر Telegram أو الهاتف خلال يوم العمل لتحديد الوقت المناسب للدرس.",
    addressLabel: "العنوان", address: "طشقند، حي ميرابات، شارع تارونا، ١٢",
    phoneLabel: "الهاتف", hoursLabel: "ساعات العمل", hours: "الإثنين–السبت: ٩:٠٠–٢٠:٠٠",
    formTitle: "طلب درس تجريبي",
    formName: "اسمك", formNamePh: "الاسم الكامل",
    formPhone: "رقم الهاتف",
    formCourse: "الدورة التي تهمك", formCourseDefault: "لم أحدد بعد",
    formMessage: "ملاحظة (اختياري)", formMessagePh: "الوقت المناسب، مستوى اللغة، أسئلة...",
    formSubmit: "إرسال الطلب عبر Telegram",
    formPrivacy: "بإرسال النموذج فإنك توافق على معالجة بياناتك الشخصية.",
    successTitle: "الطلب على وشك الإرسال!",
    successText: "سيُفتح الآن Telegram — فقط اضغط «إرسال» وسنتواصل معك في أقرب وقت."
  },
  footer: {
    about: "مركز تعليم اللغة العربية في طشقند: عربية عامة وقرآنية، دورات محادثة وتحضير للاختبارات.",
    linksTitle: "الأقسام", contactTitle: "تواصل معنا", followTitle: "تابعنا",
    rights: "جميع الحقوق محفوظة."
  }
}

};
