# A Mesterlövész: Újratöltve — weboldal

Statikus HTML, CSS és JavaScript, külső futásidejű függőség nélkül. Végleges cím: https://sniper.gay/.

## Tartalom

- `index.html`: projektbemutató és rövid indítási útmutató.
- `kiskina.html`: a kampányból kihagyott pálya kutatási összefoglalója.
- `archive.html`: képek, térkép, beszédhangok átirattal, zene és letölthető fájlok.
- `cut-content-media/`: a helyi kutatási archívum médiaválogatása; a hangok nem indulnak automatikusan.
- `research/`: kutatási dokumentumok és Kiskína pályafájljai, kinyert adatai, háromszöghálói.
- `og-main.jpg`, `og-kiskina.jpg`: 1200×630-as megosztási képek Discordhoz, Telegramhoz és más Open Graph kliensekhez.
- `stella-head.png`: átlátszó Stella-fej a kijelölt menüsor mellett. A tényleges egérmutató külön marad.

A játék forrását és a `GYARI` könyvtárat a webes változtatások nem írják át. A képes archívum és a játékból származó média a webes publikálás része a tulajdonos kifejezett kérésére.

## Linkek és előnézetek

Minden webes GitHub-gomb pontosan `https://github.com/mesterlovesz/`. JavaScript nélkül is működnek a fiókra mutató hivatkozások. A játék forrása a `mesterlovesz/remake`, a weboldal és médiaarchívuma a `mesterlovesz/mesterlovesz.github.io` tárolóban van.

Az ISO gomb közvetlenül az Internet Archive `A_mesterlovesz.iso` fájljára mutat. Az ISO-t fel kell csatolni és a játékot telepíteni; önmagában a letöltés nem elég.

Mindhárom oldalban abszolút kanonikus cím, Open Graph és `summary_large_image` Twitter-metaadat szerepel. A megosztási szolgáltatások saját gyorsítótára miatt egy módosítás után a már elküldött előnézet késhet. A képeknek nyilvános HTTPS-címen kell elérhetőknek lenniük.

## Helyi előnézet

A tároló gyökerében:

```powershell
python -B -m http.server 8797 --bind 127.0.0.1 --directory site
```

Megnyitás: http://127.0.0.1:8797/. A menü egérrel, nyilakkal és Enterrel is működik; a mozgáscsökkentési rendszerbeállítást figyelembe veszi.

## Kiskína-archívum frissítése

A játék saját `tools.capture_kiskina` és `tools.build_cut_content_archive` eszközei állítják elő a helyi kutatási anyagot. A webes másolat frissítéséhez:

```powershell
node web-tools/prepare-archive.mjs "TELJES_UT_A_JATEKPROJEKTHEZ" "TELJES_UT_A_GYARIHOZ"
```

Az eszköz csak a `site/` mappába ír. A média saját jegyzéke és SHA-256 ellenőrzőösszege a `cut-content-media/manifest.json`. A teljes kampány szkriptjeit és A Templom DAT-ját nem másolja a letöltési válogatásba; ezek a saját telepítésben vannak.

## GitHub Pages — végleges Git tárhely

Előkészítve: `.github/workflows/site-pages.yml`, `site/CNAME`, `site/.nojekyll`.

1. A `mesterlovesz` fiókban létrehozott nyilvános tárolóba fel kell tölteni a `site/` mappát és a workflow-t.
2. A tároló **Settings → Pages → Source** mezőjében **GitHub Actions**.
3. A workflow a `main` ágon a webes változásokból automatikusan publikálja a statikus mappát. Nincs játékfordítás, nincs ISO-csomagolás.
4. **Custom domain**: `sniper.gay`, majd **Enforce HTTPS** a tanúsítvány elkészülése után.
5. A domain Cloudflare DNS-e a GitHub Pages hivatalos beállítása szerint kapcsolandó be. A meglévő rekordokat és a GitHub domainellenőrzését a tényleges tároló beállításakor kell ellenőrizni.

A webes tároló: `mesterlovesz/mesterlovesz.github.io`. A játék `remake` tárolójába a webes fájlok nem kerülnek bele.

Hivatalos útmutatók: [Pages workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [egyéni domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Cloudflare előzetes közzététel

A `wrangler.jsonc` statikus fájlkiszolgálást állít be. A `workers.dev` cím előzetes nyilvános változatként használható a GitHub-feltöltés előtt:

```powershell
npx --yes wrangler@4.145.0 deploy
```

A `sniper.gay` csak akkor kapcsolható be, ha a megfelelő Cloudflare-fiókban látszik és a DNS is kész. Az előzetes Cloudflare-közzététel nem helyettesíti a végleges GitHub Pages bekötését.

## Generált vizuális anyagok

A beépített imagegen eszközzel készült, a végleges fájlok a `site/` mappában vannak:

- `og-main.jpg`: az eredeti vörösre festett, kopott ezüst fémkeretes menüt követő 1200×630-as megosztási kép; pontos feliratok: „A Mesterlövész”, „ÚJRATÖLTVE”, „Rust remake · eredeti küldetések · Kiskína”, „sniper.gay”.
- `og-kiskina.jpg`: ugyanez az eredeti menükeret, a gyári Kiskína-töltőkép kínai utcájával; feliratok: „KISKÍNA”, „A kihagyott pálya”, „Képek · hangok · visszafejtett történet”, „A Mesterlövész: Újratöltve”, „sniper.gay”.
- `stella-head.png`: a tulajdonos Stella-képéből csak a háttér eltávolítása, az eredeti arc, haj, arányok és játékszerű textúra megőrzésével. Átlátszó PNG, 66×90; megjelenítés 28×30-as keretben.

A megosztási képek illusztrációk; az archívum felvételei és gyári képei külön meg vannak jelölve.
