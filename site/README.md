# A Mesterlövész: Újratöltve — weboldal

**[sniper.gay](https://sniper.gay/)** · **[Egyszerű nézet](https://sniper.gay/simple.html)** · **[Kiskína](https://sniper.gay/kiskina.html)** · **[Képek, hangok és fájlok](https://sniper.gay/archive.html)**

Az eredeti menü hangulatát követő statikus weboldal, a kampányból kihagyott Kiskína kutatási archívumával. A főoldal és Kiskína teljes szövegének külön egyszerű nézete is van, nagyobb betűkkel, díszkeret és JavaScript nélkül.

## A játék indítása — ISO és egy indító

1. [Töltsd le a Windows játékoscsomagot](https://github.com/mesterlovesz/remake/releases/download/v0.1.0-player.1/Mesterlovesz-Ujratoltve-Windows.zip), és bontsd ki a ZIP teljes tartalmát.
2. A [weboldal Játékfájlok gombjával](https://sniper.gay/#inditas) töltsd le az Archive.org magyar ISO-ját, és tedd az `Indit.bat` mellé.
3. Dupla kattintás az `Indit.bat`-ra. Első alkalommal előkészíti az adatokat és elindítja a játékot.

Windows 10/11 (64 bit), Vulkan-képes videokártya és 5 GB szabad hely szükséges. Az első indításhoz internet kell a médiafeldolgozó automatikus letöltéséhez (31 MB); utána internet nélkül is indul. Rustot, Pythont vagy az eredeti telepítőt nem kell telepíteni.

**[A teljes játékos útmutató a játék tárolójában](https://github.com/mesterlovesz/remake/blob/main/docs/PLAYER-hu.md)**

A játék forrása és játékoscsomagja [külön tárolóban](https://github.com/mesterlovesz/remake) van. Ezt a webes tárolót a játék indításához nem szükséges letölteni.

## A weboldal szerkesztése

- A publikált fájlok a `site/` mappában vannak.
- Főoldal: `site/index.html`; Kiskína menü: `site/kiskina.html`; olvasható médiaarchívum: `site/archive.html`.
- A teljes egyszerű nézetet a retro forrásoldalakból kell frissíteni: `python web-tools/build-simple.py`.
- Az így készült `site/simple.html` és `site/kiskina-simple.html` minden fejezetet tartalmaz. Stílusuk a `site/simple.css` fájlban van.
- A `.github/workflows/site-pages.yml` a `site/` mappát GitHub Pages-re publikálja.
- A megosztási képek: `site/og-main.jpg` és `site/og-kiskina.jpg`.

Nem hivatalos rajongói projekt. Az eredeti játék és gyári anyagai a jogtulajdonosoké. A teljes eredeti játékot és az ISO-t ez a tároló nem tartalmazza.

Ezt az egész projektet egy LLM írta. Mindent [mannin1337](https://www.mannin.hu/) promptolt, emberi kód nincs a projektben.
