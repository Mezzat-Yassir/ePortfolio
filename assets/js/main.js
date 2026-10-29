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
  var pagerEl = document.querySelector('[data-pager]');
  var menuBtn = document.querySelector('.mbar-menu');
  var scrim = document.querySelector('.scrim');
  var first = document.querySelector('.h-first');

  var u = 1;
  var hp = -1;
  var current = null;
  var ticking = false;

  /* ---------- scale unit: 1 design point = u CSS px ---------- */
  function measureUnit() {
    u = Math.min(root.clientWidth / 1440, 1.32);
    root.style.setProperty('--u', u + 'px');
  }

  /* Where "Mezzat" lands when the header condenses (depends on the rendered width of the first name). */
  function measureNameShift() {
    if (!first) return;
    var w = first.offsetWidth;                       // untransformed width
    var targetX = (289.4 - 241) * u + w * (40.99 / 42) + 5.9 * u;
    var startX = (289.1 - 241) * u;
    root.style.setProperty('--last-dx', (targetX - startX).toFixed(2) + 'px');
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

  function setPager(n) {
    if (!pagerEl) return;
    var label = (n < 10 ? '0' : '') + n;
    if (pagerEl.textContent === label) return;
    if (reducedMQ.matches) { pagerEl.textContent = label; return; }
    pagerEl.style.opacity = '0';
    window.setTimeout(function () {
      pagerEl.textContent = label;
      pagerEl.style.opacity = '';
    }, 160);
  }

  function activate(section) {
    if (section === current) return;
    current = section;
    var nav = section.getAttribute('data-nav');
    var page = parseInt(section.getAttribute('data-page'), 10);
    body.setAttribute('data-nav', nav);
    body.setAttribute('data-page', String(page));
    navLinks.forEach(function (a) {
      var on = a.getAttribute('data-nav-link') === nav;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    setSubtitle(section.getAttribute('data-sub') || '');
    setPager(page);
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
    goTo(id, true);
    if (history.replaceState) history.replaceState(null, '', id === 'home' ? location.pathname : '#' + id);
  });

  /* ---------- mobile menu ---------- */
  function openMenu() {
    body.classList.add('menu-open');
    if (menuBtn) { menuBtn.setAttribute('aria-expanded', 'true'); menuBtn.setAttribute('aria-label', 'Close menu'); }
  }
  function closeMenu() {
    if (!body.classList.contains('menu-open')) return;
    body.classList.remove('menu-open');
    if (menuBtn) { menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Open menu'); }
  }
  if (menuBtn) menuBtn.addEventListener('click', function () {
    if (body.classList.contains('menu-open')) closeMenu(); else openMenu();
  });
  if (scrim) scrim.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  desktopMQ.addEventListener('change', function () { closeMenu(); refresh(); });

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
