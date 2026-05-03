/* ══════════════════════════════════════════════════════
   Uday Varikuppala Portfolio — script.js
   GSAP animations, custom cursor, magnetic buttons,
   scroll reveals, counter, contact form
   ══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  const gsapOK = typeof gsap !== 'undefined';
  const stOK   = gsapOK && typeof ScrollTrigger !== 'undefined';
  if (stOK) gsap.registerPlugin(ScrollTrigger);

  /* ─── CUSTOM CURSOR ──────────────────────────────── */
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (canHover && dot && ring && gsapOK) {
    const xDot  = gsap.quickTo(dot,  'x', { duration: 0.06, ease: 'none' });
    const yDot  = gsap.quickTo(dot,  'y', { duration: 0.06, ease: 'none' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.42, ease: 'power3.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.42, ease: 'power3.out' });

    window.addEventListener('mousemove', function (e) {
      xDot(e.clientX); yDot(e.clientY);
      xRing(e.clientX); yRing(e.clientY);
    });

    document.querySelectorAll('a, button, .btn, .mag, .feature-card, .skill-card, .project-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('hovered'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('hovered'); });
    });
  }

  /* ─── MAGNETIC BUTTONS ───────────────────────────── */
  if (gsapOK) {
    document.querySelectorAll('.mag').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.30;
        const y = (e.clientY - r.top  - r.height / 2) * 0.30;
        gsap.to(el, { x, y, duration: 0.3, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  /* ─── HERO 3D MOUSE PARALLAX ─────────────────────── */
  if (gsapOK && canHover) {
    const heroEl = document.querySelector('.hero');
    if (heroEl) {
      heroEl.addEventListener('mousemove', function (e) {
        const dx = (e.clientX / window.innerWidth  - 0.5) * 2;
        const dy = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to('.hero-title', { x: dx * 10, y: dy * 6, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
        gsap.to('.hero-tag, .hero-role, .hero-desc, .hero-actions, .hero-links',
                { x: dx * 5, y: dy * 3, duration: 1.1, ease: 'power2.out', overwrite: 'auto' });
        gsap.to('.stats-card', {
          rotateY: dx * 12, rotateX: dy * -7,
          transformPerspective: 1000,
          x: dx * 8, y: dy * 4,
          duration: 0.7, ease: 'power2.out', overwrite: 'auto'
        });
      });
      heroEl.addEventListener('mouseleave', function () {
        gsap.to('.hero-title, .hero-tag, .hero-role, .hero-desc, .hero-actions, .hero-links',
                { x: 0, y: 0, duration: 1.2, ease: 'power3.out' });
        gsap.to('.stats-card',
                { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 1.0, ease: 'elastic.out(1, 0.4)' });
      });
    }
  }

  /* ─── 3D CARD TILT ───────────────────────────────── */
  if (gsapOK && canHover) {
    function addTilt(sel, deg) {
      document.querySelectorAll(sel).forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          const r  = card.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
          const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
          gsap.to(card, {
            rotateY: dx * deg, rotateX: -dy * deg,
            transformPerspective: 900, y: -6,
            duration: 0.25, ease: 'power2.out', overwrite: 'auto'
          });
        });
        card.addEventListener('mouseleave', function () {
          gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
        });
      });
    }
    addTilt('.skill-card',   8);
    addTilt('.project-card', 10);
    addTilt('.feature-card', 7);
    addTilt('.edu-card',     7);
    addTilt('.exp-card',     5);
  }

  /* ─── NAV ────────────────────────────────────────── */
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', function () {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  /* Scroll shadow + active link */
  const allSections = Array.from(document.querySelectorAll('section[id]'));
  const allLinks    = Array.from(document.querySelectorAll('.nav-link'));

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    const cur = allSections.reduce(function (acc, sec) {
      return window.scrollY >= sec.offsetTop - 120 ? sec.id : acc;
    }, '');
    allLinks.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── HERO ENTRANCE (runs on page load) ─────────── */
  if (gsapOK) {
    /*
      We set the initial states HERE (not in CSS) so the
      page is always readable if GSAP fails to load.
    */
    gsap.set('.hero-tag',      { autoAlpha: 0, y: 16 });
    gsap.set('.hero-line-1',   { y: '105%' });
    gsap.set('.hero-line-2',   { y: '105%' });
    gsap.set('.hero-role',     { autoAlpha: 0, y: 14 });
    gsap.set('.hero-desc',     { autoAlpha: 0, y: 14 });
    gsap.set('.hero-actions',  { autoAlpha: 0, y: 14 });
    gsap.set('.hero-links',    { autoAlpha: 0 });
    gsap.set('.stats-card',    { autoAlpha: 0, x: 28 });
    gsap.set('.hero-scroll-hint', { autoAlpha: 0 });

    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .to('.hero-tag',    { autoAlpha: 1, y: 0, duration: 0.6 }, 0.15)
      .to('.hero-line-1', { y: '0%', duration: 1.0 },             0.30)
      .to('.hero-line-2', { y: '0%', duration: 1.0 },             0.42)
      .to('.hero-role',   { autoAlpha: 1, y: 0, duration: 0.6 }, 0.75)
      .to('.hero-desc',   { autoAlpha: 1, y: 0, duration: 0.7 }, 0.88)
      .to('.hero-actions',{ autoAlpha: 1, y: 0, duration: 0.6 }, 1.00)
      .to('.hero-links',  { autoAlpha: 1, duration: 0.5 },        1.10)
      .to('.stats-card',  { autoAlpha: 1, x: 0, duration: 0.9 }, 0.50)
      .to('.hero-scroll-hint', { autoAlpha: 1, duration: 0.6 },  1.30);
  }

  /* ─── SCROLL REVEALS ─────────────────────────────── */
  if (stOK) {

    /* Section titles — clip reveal from bottom */
    document.querySelectorAll('.reveal-title').forEach(function (el) {
      gsap.fromTo(el,
        { clipPath: 'inset(0 0 100% 0)', y: 40, autoAlpha: 0 },
        {
          clipPath: 'inset(0 0 0% 0)', y: 0, autoAlpha: 1,
          duration: 1.0, ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true }
        }
      );
    });

    /* Section labels */
    document.querySelectorAll('.section-label').forEach(function (el) {
      gsap.fromTo(el,
        { autoAlpha: 0, x: -20 },
        {
          autoAlpha: 1, x: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true }
        }
      );
    });

    /* Cards — stagger per row with 3D flip-in */
    document.querySelectorAll('.reveal-card').forEach(function (el, i) {
      gsap.fromTo(el,
        { autoAlpha: 0, y: 50, rotateX: 18, transformPerspective: 1000 },
        {
          autoAlpha: 1, y: 0, rotateX: 0,
          duration: 0.75, ease: 'power2.out',
          delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        }
      );
    });

    /* About text paragraphs */
    document.querySelectorAll('.about-copy p').forEach(function (el, i) {
      gsap.fromTo(el,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out',
          delay: i * 0.10,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true }
        }
      );
    });

    /* KPIs */
    document.querySelectorAll('.kpi').forEach(function (el, i) {
      gsap.fromTo(el,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out',
          delay: i * 0.10,
          scrollTrigger: { trigger: el, start: 'top 92%', once: true }
        }
      );
    });

    /* Marquee section fade */
    gsap.fromTo('.marquee-wrap',
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.8,
        scrollTrigger: { trigger: '.marquee-wrap', start: 'top 95%', once: true } }
    );

  }

  /* ─── COUNTER ANIMATION ──────────────────────────── */
  const cntObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const max = parseInt(el.dataset.count, 10);
      const sfx = el.dataset.suffix || '';
      if (isNaN(max)) return;

      let n = 0;
      const step = max / 50;
      const id = setInterval(function () {
        n += step;
        if (n >= max) { el.textContent = max + sfx; clearInterval(id); }
        else            el.textContent = Math.floor(n) + sfx;
      }, 22);
      cntObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(function (el) {
    cntObs.observe(el);
  });

  /* ─── CONTACT FORM ───────────────────────────────── */
  const form       = document.getElementById('contactForm');
  const success    = document.getElementById('formSuccess');
  const submitBtn  = document.getElementById('submitBtn');
  const msgField   = document.getElementById('contactMessage');
  const charCount  = document.getElementById('charCounter');

  if (msgField && charCount) {
    msgField.addEventListener('input', function () {
      const n = this.value.length;
      charCount.textContent = n + ' / 500';
      charCount.style.color = n > 450 ? 'rgba(248,113,113,0.9)' : '';
    });
  }

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const name    = document.getElementById('contactName').value.trim();
      const email   = document.getElementById('contactEmail').value.trim();
      const message = document.getElementById('contactMessage').value.trim();
      if (!name || !email || !message) return;

      submitBtn.disabled    = true;
      submitBtn.textContent = 'Sending…';

      try {
        const res  = await fetch('https://api.web3forms.com/submit', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: '8a06ef9f-a39e-4ca3-afa3-b772c4351249',
            subject: 'Portfolio Contact from ' + name,
            name, email, message
          })
        });
        const data = await res.json();
        if (data.success) {
          form.reset();
          if (charCount) charCount.textContent = '0 / 500';
          success.classList.add('visible');
          submitBtn.disabled    = false;
          submitBtn.textContent = 'Send Message';
        } else {
          throw new Error(data.message || 'Failed');
        }
      } catch {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Message';
        alert('Something went wrong. Please email uday.v3669@gmail.com directly.');
      }
    });
  }

});
