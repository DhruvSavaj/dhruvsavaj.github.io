/* Progressive enhancement only. Everything below is optional polish —
   the page is complete and navigable with JavaScript disabled. */
(function () {
  'use strict';

  // Flag the document so CSS can apply the hidden reveal start state.
  document.documentElement.classList.add('js');

  /* ---------------------------------------------------------- mobile nav */

  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('nav--open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
        closeNav();
        toggle.focus();
      }
    });
  }

  /* -------------------------------------------------- active nav section */

  if ('IntersectionObserver' in window) {
    var links = Array.prototype.slice.call(nav ? nav.querySelectorAll('a[href^="#"]') : []);
    var targets = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    if (targets.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) { a.removeAttribute('aria-current'); });
          var match = links.filter(function (a) {
            return a.getAttribute('href') === '#' + entry.target.id;
          })[0];
          if (match) match.setAttribute('aria-current', 'page');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });

      targets.forEach(function (t) { spy.observe(t); });
    }

    /* ------------------------------------------------------ scroll reveal */

    var revealables = document.querySelectorAll('[data-reveal]');
    var reveal = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    Array.prototype.forEach.call(revealables, function (el) { reveal.observe(el); });
  } else {
    // No IntersectionObserver: show everything immediately.
    Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ------------------------------------------------------------ footer year */

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
