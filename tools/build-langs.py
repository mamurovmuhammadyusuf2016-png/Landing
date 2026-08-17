#!/usr/bin/env python3
"""
Build the Russian and Arabic copies of the landing page from index.html.

The site is plain static HTML — there is no runtime framework and nothing
here ships to the browser. This script exists because each language needs
its own URL to be indexed separately, and hand-maintaining three copies of
the same markup would drift.

Reads:   index.html (the Uzbek original) and js/translations.js
Writes:  ru/index.html, ar/index.html, sitemap.xml

Run after changing index.html or the translations:

    python3 tools/build-langs.py
"""

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
LANGS = ["uz", "ru", "ar"]
RTL = {"ar"}

# where each language lives, relative to the domain root
URLS = {"uz": SITE, "ru": SITE + "ru/", "ar": SITE + "ar/"}
OUT = {
    "uz": ROOT / "index.html",
    "ru": ROOT / "ru" / "index.html",
    "ar": ROOT / "ar" / "index.html",
}

OG_LOCALE = {"uz": "uz_UZ", "ru": "ru_RU", "ar": "ar_AR"}

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

    write_sitemap()
    print("  sitemap.xml")


if __name__ == "__main__":
    main()
