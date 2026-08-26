#!/usr/bin/env python3
"""
Build the standalone topic pages from index.html.

A single page can only rank for one cluster of queries. The children's
programme and the online course each answer a different search — "bolalar
uchun arab tili Toshkent", "online arab tili kursi" — so each gets its own
URL, its own title and description, and its own Course markup.

They are Uzbek only, because Uzbek is the only language open to search
(see UZ_ONLY_IN_SEARCH in build-langs.py).

Run after build-langs.py, which writes the index.html these are cut from:

    python3 tools/build-langs.py && python3 tools/build-pages.py

Writes: kids/index.html, online/index.html
"""

import re
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://academy-of-arabic.uz/"

PAGES = [
    {
        "slug": "kids",
        "section": "kids",
        "url": SITE + "kids/",
        "title": "Bolalar uchun arab tili Toshkentda — Academy of Arabic",
        "description": (
            "Toshkentda 3–12 yoshli bolalar uchun arab tili: haftasiga 2, 3 yoki 5 kun, "
            "3 soatlik va 1,5 soatlik dastur, 2 nafar ustoz, 6 ta kitob. Birinchi dars bepul."
        ),
        "crumb": "Kids",
        "course_name": "Bolalar uchun arab tili (Kids)",
        "level": "Beginner",
    },
    {
        "slug": "online",
        "section": "online",
        "url": SITE + "online/",
        "title": "Online arab tili kursi — Academy of Arabic",
        "description": (
            "Arab tili fonetikasi online: 28 ta video dars, haftasiga 2 marta jonli "
            "mashgʻulot, ustoz nazorati. Guruh yoki individual. Birinchi dars bepul."
        ),
        "crumb": "Online",
        "course_name": "Online arab tili fonetika kursi",
        "level": "Beginner",
    },
]


def json_ld(page):
    """Course plus the trail back to the home page."""
    return f"""{{
  "@context": "https://schema.org",
  "@graph": [
    {{
      "@type": "Course",
      "name": "{page['course_name']}",
      "description": "{page['description']}",
      "url": "{page['url']}",
      "provider": {{ "@id": "{SITE}#org" }},
      "inLanguage": ["uz", "ru"],
      "educationalLevel": "{page['level']}",
      "hasCourseInstance": {{
        "@type": "CourseInstance",
        "courseMode": {'"Online"' if page['slug'] == 'online' else '["Onsite", "Online"]'},
        "location": {{ "@id": "{SITE}#org" }}
      }}
    }},
    {{
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{ "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": "{SITE}" }},
        {{ "@type": "ListItem", "position": 2, "name": "{page['crumb']}" }}
      ]
    }}
  ]
}}"""


def build(page, source_html):
    soup = BeautifulSoup(source_html, "html.parser")

    section = soup.find("section", id=page["section"])
    if section is None:
        raise SystemExit(f"section #{page['section']} not found in index.html")

    # The one-page site keeps its sections inside <main>; lift this page's
    # section out, then put it back as the only thing in there.
    section.extract()
    main = soup.find("main")
    if main is None:
        raise SystemExit("index.html has no <main> to hang the section on")
    main.clear()
    main["id"] = page["slug"]
    main.append(section)

    # sections that live outside <main> (the FAQ) belong to the home page
    for stray in soup.body.find_all("section", recursive=False):
        stray.decompose()

    # the section heading is this page's subject, so it is the h1 here
    h2 = section.find("h2")
    if h2 is not None:
        h2.name = "h1"

    # a trail back, above the section
    crumb = soup.new_tag("nav")
    crumb["class"] = "page-crumb"
    crumb["aria-label"] = "Breadcrumb"
    a = soup.new_tag("a", href="/")
    a.string = "Bosh sahifa"
    crumb.append(a)
    sep = soup.new_tag("span")
    sep["aria-hidden"] = "true"
    sep.string = "/"
    crumb.append(sep)
    cur = soup.new_tag("span")
    cur["aria-current"] = "page"
    cur.string = page["crumb"]
    crumb.append(cur)
    # inside the section's own container, so it lines up with the content
    holder = section.find(class_="container") or section
    holder.insert(0, crumb)

    # anchors that pointed at sections of the one-page site now leave this page
    for a in soup.find_all("a", href=True):
        if a["href"].startswith("#"):
            a["href"] = "/" + a["href"]

    head = soup.head
    for sel in [("title", {}), ("script", {"type": "application/ld+json"})]:
        for tag in head.find_all(sel[0], attrs=sel[1]):
            tag.decompose()
    for tag in head.find_all("link", rel=lambda r: r and "canonical" in r):
        tag.decompose()
    for name in ("description", "keywords"):
        for tag in head.find_all("meta", attrs={"name": name}):
            tag.decompose()
    for prop in ("og:title", "og:description", "og:url"):
        for tag in head.find_all("meta", attrs={"property": prop}):
            tag.decompose()
    for name in ("twitter:title", "twitter:description"):
        for tag in head.find_all("meta", attrs={"name": name}):
            tag.decompose()

    title = soup.new_tag("title"); title.string = page["title"]
    head.insert(0, title)

    def meta(**kw):
        t = soup.new_tag("meta")
        for k, v in kw.items():
            t[k.replace("_", ":")] = v
        head.append(t)

    meta(name="description", content=page["description"])
    meta(property="og:title", content=page["title"])
    meta(property="og:description", content=page["description"])
    meta(property="og:url", content=page["url"])
    meta(name="twitter:title", content=page["title"])
    meta(name="twitter:description", content=page["description"])

    canonical = soup.new_tag("link", rel="canonical", href=page["url"])
    head.append(canonical)

    ld = soup.new_tag("script", type="application/ld+json")
    ld.string = json_ld(page)
    head.append(ld)

    html = str(soup)
    # the page sits one level down, so root-relative asset paths still hold
    return html


def main():
    source = (ROOT / "index.html").read_text(encoding="utf-8")
    for page in PAGES:
        out = ROOT / page["slug"] / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(build(page, source), encoding="utf-8")
        print(f"  {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
