/* A Mesterlövész: Újratöltve - menüvezérlés. Nincs külső függőség; JS nélkül is használható (a lapok egymás alatt, a menü horgonylinkek). */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1) GitHub-linkek a config.js-ből
  var cfg = window.SITE || {}, gh = cfg.GITHUB_URL || "", repo = (cfg.REPOSITORY_URL || "").replace(/\/+$/, "");
  if (gh) [].forEach.call(doc.querySelectorAll("a[data-gh]"), function (a) {
    a.href = repo ? repo + (a.getAttribute("data-gh") || "").replace("{b}", cfg.BRANCH || "main") : gh;
  });

  if (cfg.ISO_URL) [].forEach.call(doc.querySelectorAll("a[data-iso]"), function (a) { a.href = cfg.ISO_URL; });

  // 2) díszítő számjegyek (gépírós hex és bináris oszlopok)
  var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function bin(n) { var s = ""; for (var i = 0; i < n; i++) s += rnd() < .5 ? "0" : "1"; return s; }
  function hex(n) { var s = "", d = "0123456789ABCDEF"; for (var i = 0; i < n; i++) s += d[(rnd() * 16) | 0] + d[(rnd() * 16) | 0] + " "; return s; }
  var el;
  if ((el = doc.getElementById("hexH"))) { var h = hex(70); el.textContent = h + h; }
  if ((el = doc.getElementById("bitsR"))) { var b = []; for (var i = 0; i < 70; i++) b.push(bin(9) + " " + bin(9)); var t = b.join("\n"); el.textContent = t + "\n" + t; }
  if ((el = doc.getElementById("bitsH"))) { var r = []; for (i = 0; i < 6; i++) r.push(bin(30)); el.textContent = r.join("\n"); }

  // 3) menü
  var menu = doc.getElementById("menu"); if (!menu) return;
  var rows = [].slice.call(menu.querySelectorAll("a.row"));
  var panes = [].slice.call(doc.querySelectorAll(".pane"));
  var cursor = doc.getElementById("mcursor"), pages = doc.getElementById("pages");
  var narrow = function () { return window.matchMedia("(max-width:1000px),(max-height:640px)").matches; };
  var cur = null;

  function paneOf(row) { var h = row.getAttribute("href"); return h && h.charAt(0) === "#" ? doc.getElementById(h.slice(1)) : null; }
  function placeCursor(row) {
    if (!cursor || !row) return;
    cursor.style.top = menu.offsetTop + row.offsetTop + (row.offsetHeight - cursor.offsetHeight) / 2 + "px";
    cursor.style.left = menu.offsetLeft + row.offsetLeft + 2 + "px";
  }
  function setRoving(row) { rows.forEach(function (r) { r.tabIndex = r === row ? 0 : -1; }); }

  function show(id, focusPane) {
    var next = doc.getElementById(id); if (!next || next === cur) return;
    var row = rows.filter(function (r) { return paneOf(r) === next; })[0];
    rows.forEach(function (r) { if (r === row) r.setAttribute("aria-current", "true"); else r.removeAttribute("aria-current"); });
    var prev = cur; cur = next;
    function enter() {
      panes.forEach(function (p) { p.classList.remove("on", "in", "out"); });
      next.classList.add("on"); if (!reduce) { void next.offsetWidth; next.classList.add("in"); }
      next.scrollTop = 0;
    }
    if (prev && !reduce) { prev.classList.add("out"); setTimeout(enter, 120); } else enter();
    placeCursor(row);
    if (narrow() && focusPane && pages) pages.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  if (!menu.parentNode.querySelector(".mcursor")) cursor = null;
  var first = rows.filter(paneOf)[0];
  var startId = (location.hash || "").slice(1);
  if (!doc.getElementById(startId) || !panes.some(function (p) { return p.id === startId; })) startId = paneOf(first).id;
  show(startId, false);
  setRoving(rows.filter(function (r) { return r.getAttribute("aria-current") === "true"; })[0] || first);
  window.addEventListener("resize", function () { placeCursor(rows.filter(function (r) { return r.getAttribute("aria-current") === "true"; })[0]); });
  window.addEventListener("load", function () { placeCursor(rows.filter(function (r) { return r.getAttribute("aria-current") === "true"; })[0]); });

  rows.forEach(function (row) {
    row.addEventListener("click", function (e) {
      var p = paneOf(row); if (!p) return;                   // külső hivatkozás: normál navigáció
      e.preventDefault(); show(p.id, true);
      if (history.replaceState) history.replaceState(null, "", "#" + p.id); else location.hash = p.id;
      setRoving(row);
    });
    function hover() { placeCursor(row); }
    function rest() { placeCursor(rows.filter(function (r) { return r.getAttribute("aria-current") === "true"; })[0] || row); }
    row.addEventListener("mouseenter", hover); row.addEventListener("focus", function () { setRoving(row); hover(); });
    row.addEventListener("mouseleave", rest); row.addEventListener("blur", rest);
  });
  [].forEach.call(doc.querySelectorAll("[data-go]"), function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); var id = a.getAttribute("data-go"); show(id, true); history.replaceState && history.replaceState(null, "", "#" + id); });
  });
  window.addEventListener("hashchange", function () { var id = location.hash.slice(1); if (panes.some(function (p) { return p.id === id; })) show(id, false); });

  // 4) billentyűzet: nyilak, Home/End, 1-9, Esc = Vissza
  doc.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var a = doc.activeElement, inMenu = a && rows.indexOf(a) >= 0, free = inMenu || a === doc.body;
    var i = rows.indexOf(a), k = e.key, to = null;
    if (k === "Escape") { var back = menu.querySelector("a.back"); if (back) { location.href = back.href; } return; }
    if (!free) return;
    if (k === "ArrowDown") to = rows[(i + 1 + rows.length) % rows.length];
    else if (k === "ArrowUp") to = rows[(i <= 0 ? rows.length : i) - 1];
    else if (k === "Home") to = rows[0]; else if (k === "End") to = rows[rows.length - 1];
    else if (/^[1-9]$/.test(k) && rows[+k - 1]) to = rows[+k - 1];
    if (to) { e.preventDefault(); to.focus(); if (/^[1-9]$/.test(k)) to.click(); }
  });

  // 5) finom parallaxis az egérrel
  if (!reduce && window.matchMedia("(pointer:fine)").matches) {
    var raf = 0, px = 0, py = 0;
    doc.addEventListener("pointermove", function (e) {
      px = e.clientX / window.innerWidth - .5; py = e.clientY / window.innerHeight - .5;
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; root.style.setProperty("--px", px.toFixed(3)); root.style.setProperty("--py", py.toFixed(3)); });
    }, { passive: true });
  }
})();
