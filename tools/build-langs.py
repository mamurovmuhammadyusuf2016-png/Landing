#!/usr/bin/env python3
"""
Build the Russian, Arabic and English copies of the landing page from index.html.

The site is plain static HTML — there is no runtime framework and nothing
here ships to the browser. This script exists because each language needs
its own URL to be indexed separately, and hand-maintaining three copies of
the same markup would drift.

Reads:   index.html (the Uzbek original) and js/translations.js
Writes:  ru/index.html, ar/index.html, en/index.html, sitemap.xml

Run after changing index.html or the translations:

    python3 tools/build-langs.py
"""

import hashlib
import json
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://academy-of-arabic.uz/"
SOURCE_LANG = "uz"
LANGS = ["uz", "ru", "ar", "en"]
RTL = {"ar"}

# where each language lives, relative to the domain root
URLS = {"uz": SITE, "ru": SITE + "ru/", "ar": SITE + "ar/", "en": SITE + "en/"}
OUT = {
    "uz": ROOT / "index.html",
    "ru": ROOT / "ru" / "index.html",
    "ar": ROOT / "ar" / "index.html",
    "en": ROOT / "en" / "index.html",
}

OG_LOCALE = {"uz": "uz_UZ", "ru": "ru_RU", "ar": "ar_AR", "en": "en_US"}

# head strings that carry language, keyed by meta name/property
HEAD_TEXT = {
    "ru": {
        "title": "Академия арабского языка в Ташкенте — Academy of Arabic | Фонетика, грамматика, детям",
        "description": "Academy of Arabic — курсы арабского языка в Ташкенте: фонетика, грамматика и занятия для детей. Группы до 20 человек. Бесплатный пробный урок!",
        "keywords": "арабский язык, курсы арабского языка, арабский Ташкент, выучить арабский, академия арабского языка, фонетика, грамматика, арабский для детей",
        "og:title": "Академия арабского языка в Ташкенте — Academy of Arabic",
        "og:description": "Фонетика, грамматика и курс для детей. Группы до 20 человек. Записывайтесь на бесплатный пробный урок!",
        "og:image:alt": "Academy of Arabic — академия арабского языка в Ташкенте",
        "twitter:title": "Академия арабского языка в Ташкенте — Academy of Arabic",
        "twitter:description": "Фонетика, грамматика и курс для детей. Бесплатный пробный урок!",
    },
    "ar": {
        "title": "أكاديمية اللغة العربية في طشقند — Academy of Arabic | الصوتيات والقواعد وللأطفال",
        "description": "Academy of Arabic — دورات اللغة العربية في طشقند: الصوتيات والقواعد ودورة للأطفال. مجموعات حتى ٢٠ طالبًا. درس تجريبي مجاني!",
        "keywords": "اللغة العربية, دورات عربية, تعلم العربية, طشقند, أكاديمية اللغة العربية, الصوتيات, القواعد, العربية للأطفال",
        "og:title": "أكاديمية اللغة العربية في طشقند — Academy of Arabic",
        "og:description": "الصوتيات والقواعد ودورة للأطفال. مجموعات حتى ٢٠ طالبًا. سجّل في درس تجريبي مجاني!",
        "og:image:alt": "Academy of Arabic — أكاديمية اللغة العربية في طشقند",
        "twitter:title": "أكاديمية اللغة العربية في طشقند — Academy of Arabic",
        "twitter:description": "الصوتيات والقواعد ودورة للأطفال. درس تجريبي مجاني!",
    },
    "en": {
        "title": "Arabic language academy in Tashkent — Academy of Arabic | Phonetics, grammar, kids",
        "description": "Academy of Arabic — Arabic language courses in Tashkent: phonetics, grammar and classes for children. Groups of up to 20. Free trial lesson!",
        "keywords": "arabic language, arabic courses, learn arabic, arabic Tashkent, arabic academy, phonetics, grammar, arabic for kids",
        "og:title": "Arabic language academy in Tashkent — Academy of Arabic",
        "og:description": "Phonetics, grammar and a course for children. Groups of up to 20. Book a free trial lesson!",
        "og:image:alt": "Academy of Arabic — Arabic language academy in Tashkent",
        "twitter:title": "Arabic language academy in Tashkent — Academy of Arabic",
        "twitter:description": "Phonetics, grammar and a course for children. Free trial lesson!",
    },
}


def load_translations() -> dict:
    """Evaluate translations.js and hand it back as plain data."""
    js = (
        "const fs=require('fs');"
        "const T=eval('(function(){'+fs.readFileSync('js/translations.js','utf8')+';return TRANSLATIONS;})()');"
        "console.log(JSON.stringify(T));"
    )
    out = subprocess.run(
        ["node", "-e", js], cwd=ROOT, capture_output=True, text=True, check=True
    )
    return json.loads(out.stdout)


def asset_version(rel: str) -> str:
    """Short content hash, so a changed file always gets a new URL."""
    data = (ROOT / rel).read_bytes()
    return hashlib.md5(data).hexdigest()[:10]


def version_assets(soup):
    """Stamp css/js links with their content hash.

    Pages and assets are cached independently for ten minutes, so a visitor
    can hold new markup against a stale script. Deriving the query from the
    file itself means it can never be forgotten the way a hand-typed date
    was — the URL changes exactly when the file does.
    """
    targets = [
        ("link", "href", "/css/fonts.css", "css/fonts.css"),
        ("link", "href", "/css/style.css", "css/style.css"),
        ("script", "src", "/js/translations.js", "js/translations.js"),
        ("script", "src", "/js/main.js", "js/main.js"),
    ]
    for tag_name, attr, url, rel in targets:
        for tag in soup.find_all(tag_name):
            value = tag.get(attr) or ""
            if value.split("?")[0] == url:
                tag[attr] = f"{url}?v={asset_version(rel)}"


# Which three cuts the browser should fetch before it is told to. The
# headline and the body copy of each language live in a different subset
# file, so preloading the Latin cuts on the Russian or Arabic page would
# warm the wrong ones.
PRELOAD_FONTS = {
    "uz": ["playfair-display-latin-wght-normal.woff2",
           "mulish-latin-wght-normal.woff2",
           "unbounded-latin-wght-normal.woff2"],
    "en": ["playfair-display-latin-wght-normal.woff2",
           "mulish-latin-wght-normal.woff2",
           "unbounded-latin-wght-normal.woff2"],
    "ru": ["playfair-display-cyrillic-wght-normal.woff2",
           "mulish-cyrillic-wght-normal.woff2",
           "unbounded-cyrillic-wght-normal.woff2"],
    "ar": ["amiri-arabic-700-normal.woff2",
           "tajawal-arabic-400-normal.woff2",
           "cairo-arabic-wght-normal.woff2"],
}


def set_font_preloads(soup, lang):
    wanted = PRELOAD_FONTS[lang]
    tags = [t for t in soup.find_all("link", attrs={"rel": "preload"})
            if t.get("as") == "font"]
    if len(tags) != len(wanted):
        sys.exit(f"index.html has {len(tags)} font preloads, expected {len(wanted)}")
    for tag, name in zip(tags, wanted):
        path = ROOT / "assets" / "fonts" / name
        if not path.is_file():
            sys.exit(f"preload target missing: assets/fonts/{name}")
        tag["href"] = f"/assets/fonts/{name}"


def by_path(d: dict, path: str):
    cur = d
    for key in path.split("."):
        if not isinstance(cur, dict) or key not in cur:
            return None
        cur = cur[key]
    return cur


def set_meta(soup, lang, key, value):
    if value is None:
        return
    if key == "title":
        soup.title.string = value
        return
    tag = soup.find("meta", attrs={"property": key}) or soup.find(
        "meta", attrs={"name": key}
    )
    if tag:
        tag["content"] = value


def localise_body(soup, dic):
    """Replace every marked string with this language's text."""
    for el in soup.select("[data-i18n]"):
        v = by_path(dic, el["data-i18n"])
        if v is not None:
            el.string = v
    for el in soup.select("[data-i18n-words]"):
        v = by_path(dic, el["data-i18n-words"])
        if v is not None:
            el.string = v
    for el in soup.select("[data-i18n-placeholder]"):
        v = by_path(dic, el["data-i18n-placeholder"])
        if v is not None:
            el["placeholder"] = v
    for el in soup.select("[data-i18n-alt]"):
        v = by_path(dic, el["data-i18n-alt"])
        if v is not None:
            el["alt"] = v
    for el in soup.select("[data-i18n-title]"):
        v = by_path(dic, el["data-i18n-title"])
        if v is not None:
            el["title"] = v
            el["aria-label"] = v


def localise_jsonld(soup, lang, dic):
    """Point the graph at this URL and swap the FAQ into this language."""
    tag = soup.find("script", attrs={"type": "application/ld+json"})
    data = json.loads(tag.string)
    faq = dic["faq"]
    for node in data["@graph"]:
        types = node.get("@type")
        types = types if isinstance(types, list) else [types]
        if "WebSite" in types:
            node["inLanguage"] = lang
            node["url"] = URLS[lang]
        if "FAQPage" in types:
            node["@id"] = URLS[lang] + "#faq"
            node["mainEntity"] = [
                {
                    "@type": "Question",
                    "name": faq[f"q{i}"],
                    "acceptedAnswer": {"@type": "Answer", "text": faq[f"a{i}"]},
                }
                for i in range(1, 10)
                if f"q{i}" in faq
            ]
    tag.string = json.dumps(data, ensure_ascii=False, indent=2)


def add_alternates(soup, lang):
    """canonical + hreflang, so the three pages are read as one set."""
    for tag in soup.find_all("link", rel=lambda r: r and (
        "canonical" in r or "alternate" in r
    )):
        tag.decompose()

    head = soup.head
    canonical = soup.new_tag("link", rel="canonical", href=URLS[lang])
    head.append(canonical)
    for code in LANGS:
        alt = soup.new_tag("link", rel="alternate", href=URLS[code])
        alt["hreflang"] = code
        head.append(alt)
    default = soup.new_tag("link", rel="alternate", href=URLS[SOURCE_LANG])
    default["hreflang"] = "x-default"
    head.append(default)


def build(lang: str, source_html: str, translations: dict) -> str:
    soup = BeautifulSoup(source_html, "html.parser")
    dic = translations[lang]

    soup.html["lang"] = lang
    soup.html["dir"] = "rtl" if lang in RTL else "ltr"

    for key, value in HEAD_TEXT.get(lang, {}).items():
        set_meta(soup, lang, key, value)
    set_meta(soup, lang, "og:url", URLS[lang])

    og_locale = soup.find("meta", attrs={"property": "og:locale"})
    if og_locale:
        og_locale["content"] = OG_LOCALE[lang]
    for tag in soup.find_all("meta", attrs={"property": "og:locale:alternate"}):
        tag.decompose()
    for code in LANGS:
        if code == lang:
            continue
        t = soup.new_tag("meta")
        t["property"] = "og:locale:alternate"
        t["content"] = OG_LOCALE[code]
        soup.head.append(t)

    add_alternates(soup, lang)
    set_font_preloads(soup, lang)
    version_assets(soup)
    localise_body(soup, dic)
    localise_jsonld(soup, lang, dic)

    return str(soup)


def write_sitemap():
    today = date.today().isoformat()
    entries = []
    for lang in LANGS:
        alts = "\n".join(
            f'      <xhtml:link rel="alternate" hreflang="{c}" href="{URLS[c]}"/>'
            for c in LANGS
        )
        entries.append(
            f"""  <url>
    <loc>{URLS[lang]}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>{'1.0' if lang == SOURCE_LANG else '0.9'}</priority>
{alts}
      <xhtml:link rel="alternate" hreflang="x-default" href="{URLS[SOURCE_LANG]}"/>
  </url>"""
        )
    entries.append(
        f"""  <url>
    <loc>{SITE}privacy.html</loc>
    <lastmod>{today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.2</priority>
  </url>"""
    )
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        + "\n".join(entries)
        + "\n</urlset>\n"
    )
    (ROOT / "sitemap.xml").write_text(xml, encoding="utf-8")


def stamp_privacy():
    """The privacy page is hand-maintained; keep its stylesheet URL in step."""
    path = ROOT / "privacy.html"
    if not path.exists():
        return
    html = path.read_text(encoding="utf-8")
    new = html
    for sheet in ("style", "fonts"):
        new = re.sub(rf'(href=")(?:\.\./)?/?css/{sheet}\.css(?:\?v=[^"]*)?(")',
                     rf'\1css/{sheet}.css?v={asset_version(f"css/{sheet}.css")}\2', new)
    if new != html:
        path.write_text(new, encoding="utf-8")
        print("  privacy.html")


def main():
    source = (ROOT / "index.html").read_text(encoding="utf-8")
    translations = load_translations()

    missing = [l for l in LANGS if l not in translations]
    if missing:
        sys.exit(f"translations.js is missing: {', '.join(missing)}")

    # index.html is both the structural source and the Uzbek output: edit the
    # markup here and the wording in translations.js, then re-run. Baking the
    # text in means a crawler sees each language without running any script.
    for lang, path in OUT.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(build(lang, source, translations), encoding="utf-8")
        print(f"  {path.relative_to(ROOT)}")

    stamp_privacy()
    write_sitemap()
    print("  sitemap.xml")


if __name__ == "__main__":
    main()
