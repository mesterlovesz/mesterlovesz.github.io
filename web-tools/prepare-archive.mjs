import { cp, copyFile, mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Csak a webes másolatot írja; a GYARI és a játékprojekt olvasási forrás.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(process.argv[2] || join(root, '../remake'));
const game = resolve(process.argv[3] || join(source, '../GYARI'));
const site = join(root, 'site');
await access(join(source, 'docs/cut-content-media/manifest.json'));
await mkdir(join(site, 'research/files'), { recursive: true });
await cp(join(source, 'docs/cut-content-media'), join(site, 'cut-content-media'), { recursive: true });
for (const file of ['cut-content.md', 'unused-content.md']) {
  await copyFile(join(source, 'docs', file), join(site, 'research', file));
}
const downloads = [
  [join(game, 'worlds/chinatown.dat'), '../../GYARI/worlds/chinatown.dat', 'chinatown.dat'],
  [join(game, 'worlds/chinatown.pth'), '../../GYARI/worlds/chinatown.pth', 'chinatown.pth'],
  ...['scene.json', 'gameplay.json', 'items.json', 'visual.obj', 'collision.obj'].map(ext => [
    join(source, 'output', `chinatown.${ext}`), `../output/chinatown.${ext}`, `chinatown.${ext}`
  ])
];
let html = await readFile(join(source, 'docs/cut-content.html'), 'utf8');
for (const [from, oldHref, file] of downloads) {
  await copyFile(from, join(site, 'research/files', file));
  html = html.replaceAll(`href="${oldHref}"`, `href="research/files/${file}" download`);
}
// A teljes kampány állományait nem másoljuk át a válogatásba.
html = html.replace(/<a href="(?:\.\.\/\.\.\/GYARI\/worlds\/chinatown2\.dat|\.\.\/\.\.\/GYARI\/scripts\/[^\"]+)">([^<]+)<\/a>/g, '<code>$1</code>');
html = html.replaceAll('href="cut-content.md"', 'href="research/cut-content.md"')
  .replaceAll('href="unused-content.md"', 'href="research/unused-content.md"');
html = html.replace('a menüben nincs hozzá pályaválasztó.', 'azóta a remake Bónusz menüjéből is elérhető.');
html = html.replace('<nav class="toc">', '<nav class="toc"><a href="kiskina.html">← Kiskína menü</a><a href="simple.html">Egyszerű főoldal</a><a href="kiskina-simple.html">Kiskína egyszerűen</a><a href="index.html">Retro főoldal</a>');
html = html.replace('<style>', `<meta name="description" content="Kiskína, A Mesterlövész kihagyott pályája: képek, lejátszható beszédhangok, zene és visszafejtett fájlok.">
<link rel="canonical" href="https://sniper.gay/archive.html">
<meta property="og:type" content="article"><meta property="og:site_name" content="A Mesterlövész: Újratöltve"><meta property="og:locale" content="hu_HU">
<meta property="og:title" content="Kiskína — képes és hangos kutatási archívum">
<meta property="og:description" content="Képek, párbeszédek, lejátszható hangok és visszafejtett fájlok A Mesterlövész kihagyott pályájából.">
<meta property="og:url" content="https://sniper.gay/archive.html"><meta property="og:image" content="https://sniper.gay/og-kiskina.jpg">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:alt" content="Kiskína: a kihagyott pálya — kínai utca az eredeti menü fémkeretében">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Kiskína — képes és hangos kutatási archívum"><meta name="twitter:description" content="Képek, hangok és visszafejtett történet A Mesterlövész kihagyott pályájáról."><meta name="twitter:image" content="https://sniper.gay/og-kiskina.jpg">
<link rel="icon" href="favicon.svg" type="image/svg+xml"><style>`);
html = html.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="simple.css?v=20261001-dark"><link rel="stylesheet" href="archive.css">');
html = html.replace(/<p><small>Az oldal és a média a saját telepítés helyi kutatásához készült;[\s\S]*?<\/small><\/p>/, '<footer class="archive-footer"><p>Nem hivatalos rajongói kutatás. A gyári képek, hangok és fájlok a jogtulajdonosoké; a felvételek a remake-ből készültek. A gyári forrásfájlokat nem módosítottuk.</p><p><a href="kiskina.html">Kiskína menü</a> · <a href="https://github.com/mesterlovesz/">GitHub</a></p></footer>');
if (/href="(?:\.\.\/|cut-content\.md|unused-content\.md)/.test(html)) throw new Error('Az archívumban helyi forráshivatkozás maradt.');
await writeFile(join(site, 'archive.html'), html);
console.log('A Kiskína webes archívuma elkészült. A játék forrásfájljai változatlanok.');
