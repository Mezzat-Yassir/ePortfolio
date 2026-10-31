/* Mohamed Yassir Mezzat — ePortfolio */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var desktopMQ = window.matchMedia('(min-width: 1100px)');
  var reducedMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

  var HERO_H = 231.8;      // header height on the first screen (design points)
  var COMPACT_H = 128.7;   // header height once condensed
  var SHRINK = HERO_H - COMPACT_H;
  var MOBILE_BAR = 64;

  var sections = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-item'));
  var subtitleEls = Array.prototype.slice.call(document.querySelectorAll('[data-subtitle]'));
  var menuBtn = document.querySelector('.mbar-menu');
  var scrim = document.querySelector('.scrim');
  var first = document.querySelector('.h-first');
  var last = document.querySelector('.h-last');

  var u = 1;
  var hp = -1;
  var current = null;
  var ticking = false;

  /* ---------- language: English is in the page, French comes from assets/js/i18n-fr.js ---------- */
  var FR = window.EPF_FR || null;
  var LANG_KEY = 'epf-lang';
  var lang = 'en';
  var metaDesc = document.querySelector('meta[name="description"]');
  var textEls = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var attrEls = Array.prototype.slice.call(document.querySelectorAll('[data-i18n-attr]'));
  var langButtons = Array.prototype.slice.call(document.querySelectorAll('[data-set-lang]'));
  var EN = { 'menu.open': 'Open menu', 'menu.close': 'Close menu',
             'meta.description': metaDesc ? metaDesc.getAttribute('content') : '' };

  function attrPairs(el) {
    return el.getAttribute('data-i18n-attr').split(';').map(function (pair) {
      var i = pair.indexOf(':');
      return [pair.slice(0, i).trim(), pair.slice(i + 1).trim()];
    });
  }
  textEls.forEach(function (el) { EN[el.getAttribute('data-i18n')] = el.innerHTML; });
  attrEls.forEach(function (el) { attrPairs(el).forEach(function (p) { EN[p[1]] = el.getAttribute(p[0]); }); });

  function t(key) { return lang === 'fr' && FR && FR[key] != null ? FR[key] : EN[key]; }

  function applyLang(next, remember) {
    lang = next === 'fr' && FR ? 'fr' : 'en';
    root.lang = lang;
    textEls.forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v != null && el.innerHTML !== v) el.innerHTML = v;
    });
    attrEls.forEach(function (el) {
      attrPairs(el).forEach(function (p) { var v = t(p[1]); if (v != null) el.setAttribute(p[0], v); });
    });
    if (metaDesc) metaDesc.setAttribute('content', t('meta.description'));
    langButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === lang)); });
    if (menuBtn) menuBtn.setAttribute('aria-label', t(body.classList.contains('menu-open') ? 'menu.close' : 'menu.open'));
    if (remember) { try { localStorage.setItem(LANG_KEY, lang); } catch (err) { /* private mode */ } }
    root.classList.remove('i18n-pending');
  }

  function startLang() {
    var m = /[?&]lang=(en|fr)\b/.exec(location.search);
    if (m) return { lang: m[1], remember: true };
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (err) { /* private mode */ }
    return { lang: saved === 'fr' ? 'fr' : 'en', remember: false };
  }

  function subOf(section) {
    return section.getAttribute(lang === 'fr' ? 'data-sub-fr' : 'data-sub') || '';
  }

  /* ---------- scale unit: 1 design point = u CSS px (0.74px to 0.9px) ---------- */
  function measureUnit() {
    u = Math.min(Math.max(root.clientWidth / 1700, 0.74), 0.9);
    root.style.setProperty('--u', u + 'px');
  }

  /* Where "Mezzat" lands when the header condenses (depends on the rendered width of the first name). */
  function measureNameShift() {
    if (!first || !last) return;
    var targetX = first.offsetLeft + first.offsetWidth * (40.99 / 42) + 5.9 * u;   // untransformed boxes
    root.style.setProperty('--last-dx', (targetX - last.offsetLeft).toFixed(2) + 'px');
  }

  function headerBottom() {
    if (!desktopMQ.matches) return MOBILE_BAR;
    return (HERO_H - SHRINK * Math.max(hp, 0)) * u;
  }

  /* ---------- header morph (scroll-linked) ---------- */
  function updateHeader() {
    var p = 0;
    if (desktopMQ.matches) {
      p = Math.min(Math.max(window.scrollY / (SHRINK * u), 0), 1);
      p = Math.round(p * 1000) / 1000;
    }
    if (p !== hp) {
      hp = p;
      var q = 1 - p;
      root.style.setProperty('--hp', String(p));
      root.style.setProperty('--mx', (1 - q * q * q * q).toFixed(4));
      root.style.setProperty('--my', (p * p * p * p).toFixed(4));
    }
  }

  /* ---------- which page of the portfolio is in view ---------- */
  function pickSection() {
    var line = headerBottom() + (window.innerHeight - headerBottom()) * 0.35;
    var found = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= line) found = sections[i];
    }
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) found = sections[sections.length - 1];
    return found;
  }

  function setSubtitle(text) {
    subtitleEls.forEach(function (el) {
      if (el.textContent === text) return;
      var inHeader = el.closest('.h-sub');
      if (inHeader && desktopMQ.matches && !reducedMQ.matches) {
        el.classList.add('is-swapping');
        window.setTimeout(function () {
          el.textContent = text;
          el.classList.remove('is-swapping');
        }, 180);
      } else {
        el.textContent = text;
      }
    });
  }

  function activate(section) {
    if (section === current) return;
    current = section;
    var nav = section.getAttribute('data-nav');
    body.setAttribute('data-nav', nav);
    navLinks.forEach(function (a) {
      var on = a.getAttribute('data-nav-link') === nav;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    setSubtitle(subOf(section));
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      updateHeader();
      activate(pickSection());
    });
  }

  /* ---------- navigation ---------- */
  function scrollTarget(id) {
    if (id === 'home') return 0;
    var el = document.getElementById(id);
    if (!el) return null;
    var top = el.getBoundingClientRect().top + window.scrollY;
    var offset = desktopMQ.matches ? COMPACT_H * u : MOBILE_BAR;
    return Math.max(0, Math.round(top - offset));
  }

  function goTo(id, smooth) {
    var y = scrollTarget(id);
    if (y === null) return;
    window.scrollTo({ top: y, behavior: smooth && !reducedMQ.matches ? 'smooth' : 'auto' });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id || (id !== 'home' && !document.getElementById(id))) return;
    if (id === 'content') return;   // skip link keeps its default behaviour
    e.preventDefault();
    closeMenu();
    // a mouse click shouldn't leave focus inside the sidebar (it would keep it slid out)
    if (e.detail > 0 && a.closest('.sidebar') && typeof a.blur === 'function') a.blur();
    goTo(id, true);
    if (history.replaceState) history.replaceState(null, '', id === 'home' ? location.pathname : '#' + id);
  });

  /* ---------- mobile menu ---------- */
  function openMenu() {
    body.classList.add('menu-open');
    if (menuBtn) { menuBtn.setAttribute('aria-expanded', 'true'); menuBtn.setAttribute('aria-label', t('menu.close')); }
  }
  function closeMenu() {
    if (!body.classList.contains('menu-open')) return;
    body.classList.remove('menu-open');
    if (menuBtn) { menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', t('menu.open')); }
  }
  if (menuBtn) menuBtn.addEventListener('click', function () {
    if (body.classList.contains('menu-open')) closeMenu(); else openMenu();
  });
  if (scrim) scrim.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  desktopMQ.addEventListener('change', function () { closeMenu(); refresh(); });

  /* ---------- EN / FR switch ---------- */
  langButtons.forEach(function (b) {
    b.addEventListener('click', function (e) {
      var next = b.getAttribute('data-set-lang');
      // a mouse click shouldn't leave focus inside the sidebar (it would keep it slid out)
      if (e.detail > 0 && b.closest('.sidebar')) b.blur();
      if (next === lang) return;
      applyLang(next, true);
      refresh();
    });
  });

  /* ---------- reveal on scroll ---------- */
  if ('IntersectionObserver' in window && !reducedMQ.matches) {
    root.classList.add('reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- video: triangle starts playback, native controls take over ---------- */
  var videoFrame = document.querySelector('.video-frame');
  var video = videoFrame && videoFrame.querySelector('video');
  var playBtn = videoFrame && videoFrame.querySelector('.play-btn');
  if (video && playBtn) {
    playBtn.addEventListener('click', function () {
      if (!video.hasAttribute('controls')) video.setAttribute('controls', '');
      videoFrame.classList.add('has-played');
      var started = video.play();
      if (started && typeof started.catch === 'function') {
        started.catch(function () { videoFrame.classList.remove('is-playing'); });
      }
      try { video.focus({ preventScroll: true }); } catch (err) { /* older browsers */ }
    });
    video.addEventListener('play', function () { videoFrame.classList.add('is-playing'); });
    video.addEventListener('pause', function () { videoFrame.classList.remove('is-playing'); });
    video.addEventListener('ended', function () { videoFrame.classList.remove('is-playing'); });
  }

  /* ---------- init ---------- */
  function refresh() {
    measureUnit();
    measureNameShift();
    hp = -1;
    updateHeader();
    current = null;
    activate(pickSection());
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { refresh(); }, { passive: true });

  var start = startLang();
  applyLang(start.lang, start.remember);
  refresh();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      refresh();
      var id = location.hash.slice(1);
      if (id && document.getElementById(id)) {
        var target = document.getElementById(id);
        target.classList.add('is-in');
        goTo(id, false);
      }
    });
  }
})();
