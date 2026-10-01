"""Generate readable static pages from the complete retro page contents."""
from html import escape
from html.parser import HTMLParser
from pathlib import Path
import re


class Contents(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.source = source
        self.offsets = [0]
        for line in source.splitlines(keepends=True):
            self.offsets.append(self.offsets[-1] + len(line))
        self.depth = 0
        self.start = self.end = None
        self.feed(source)

    def source_offset(self):
        row, column = self.getpos()
        return self.offsets[row - 1] + column

    def handle_starttag(self, tag, attrs):
        if tag != 'div':
            return
        if self.start is None and dict(attrs).get('id') == 'pages':
            self.start = self.source_offset() + len(self.get_starttag_text())
            self.depth = 1
        elif self.depth:
            self.depth += 1

    def handle_endtag(self, tag):
        if tag == 'div' and self.depth:
            self.depth -= 1
            if not self.depth:
                self.end = self.source_offset()


ROOT = Path(__file__).resolve().parent.parent / 'site'
for original, output, title, image in [
    ('index.html', 'simple.html', 'A Mesterlövész: Újratöltve', 'og-main.jpg'),
    ('kiskina.html', 'kiskina-simple.html', 'Kiskína: a kihagyott pálya', 'og-kiskina.jpg'),
]:
    source = (ROOT / original).read_text(encoding='utf-8')
    parsed = Contents(source)
    if parsed.start is None or parsed.end is None:
        raise RuntimeError(f'Missing page contents: {original}')
    contents = source[parsed.start:parsed.end]
    chapters = re.findall(r'<section\b[^>]*id="([^"]+)"[^>]*>\s*<h2\b[^>]*>(.*?)</h2>', contents, re.S)
    if not chapters:
        raise RuntimeError(f'Missing chapters: {original}')
    toc = ''.join(f'<a href="#{escape(key)}">{heading}</a>' for key, heading in chapters)
    contents = contents.replace('href="index.html"', 'href="simple.html"').replace('href="kiskina.html"', 'href="kiskina-simple.html"')
    contents = contents.replace('</b><span>', '</b> <span>')
    footer = re.search(r'<p class="foot-copy">(.*?)</p>', source, re.S).group(1)
    canonical = 'https://sniper.gay/' + (original if original != 'index.html' else '')
    result = f'''<!doctype html>
<html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(title)} — egyszerű nézet</title>
<meta name="description" content="{escape(title)}: teljes szöveg egyszerű, nagy betűs, díszítés nélküli nézetben.">
<link rel="canonical" href="{canonical}"><link rel="icon" href="favicon.svg" type="image/svg+xml">
<meta property="og:title" content="{escape(title)}"><meta property="og:type" content="website">
<meta property="og:image" content="https://sniper.gay/{image}"><meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="simple.css"></head><body>
<a class="skip" href="#pages">Ugrás a tartalomra</a>
<header><p class="eyebrow">Egyszerű nézet</p><h1>{escape(title)}</h1>
<p>Minden fejezet egymás alatt olvasható. A betűméret a böngésző nagyításával szabadon növelhető.</p>
<nav aria-label="Oldalak"><a href="simple.html">Főoldal</a><a href="kiskina-simple.html">Kiskína</a>
<a href="archive.html">Képek, hangok és fájlok</a><a href="{original}">Vissza a retro nézethez</a></nav></header>
<div class="layout"><nav class="contents" aria-label="Tartalomjegyzék">{toc}</nav>
<main id="pages">{contents}</main></div><footer>{footer}</footer>
</body></html>'''
    (ROOT / output).write_bytes(result.encode('utf-8'))
    # Every chapter is copied intact. The generated view never hides content with JavaScript.
    assert contents.count('<section ') == len(chapters)
    print(f'{output}: {len(chapters)} full chapters, no scripts')
