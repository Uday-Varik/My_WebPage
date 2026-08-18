/* ══════════════════════════════════════════════════════
   Uday Varikuppala Portfolio — script.js
   GSAP animations, custom cursor, magnetic buttons,
   scroll reveals, counter, contact form
   ══════════════════════════════════════════════════════ */

/* ─── PERSONAL DETAILS ─────────────────────────────────
   Single source of truth for contact links. Nothing below
   is hardcoded in index.html — every data-bind target gets
   its href (and, where flagged, its visible text) from here. */
const PERSONAL = {
  email:    'uday.v3669@gmail.com',
  linkedin: 'https://linkedin.com/in/udayv59',
  github:   'https://github.com/Uday-Varik',
  resume:   'MyResumes/Uday_Varikuppala_Data_Scientist_Resume.pdf'
};

function bindPersonalDetails() {
  document.querySelectorAll('[data-bind]').forEach(function (el) {
    var key = el.dataset.bind;
    var value = PERSONAL[key];
    if (!value) return;
    el.href = key === 'email' ? 'mailto:' + value : value;
    if (el.dataset.bindText === 'true') el.textContent = value;
  });
}

document.addEventListener('DOMContentLoaded', function () {

  bindPersonalDetails();

  const gsapOK = typeof gsap !== 'undefined';
  const stOK   = gsapOK && typeof ScrollTrigger !== 'undefined';
  if (stOK) gsap.registerPlugin(ScrollTrigger);

  /* ─── LENIS SMOOTH SCROLL ────────────────────────── */
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    var lenis = new Lenis({
      duration: 1.2,
      easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 0.8
    });
    /* Handle anchor clicks so Lenis controls the scroll (scroll-behavior: smooth was removed from CSS) */
    document.querySelectorAll('a[href^="#"]').forEach(function(el) {
      el.addEventListener('click', function(e) {
        var href = el.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
      });
    });
    if (stOK) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function(time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
    }
  }
  initLenis();

  /* ─── THREE.JS NEURAL NETWORK HERO CANVAS ─────── */
  function initHeroCanvas() {
    if (typeof THREE === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    var isMobile  = window.innerWidth < 768;
    var COUNT     = isMobile ? 40 : 80;
    var THRESH_SQ = isMobile ? 64 : 100;  /* 8² or 10² — avoids sqrt per-check */
    var MAX_EDGES = isMobile ? 80 : 160;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.z = 40;

    var nodeGeo    = new THREE.SphereGeometry(0.12, 6, 6);
    var nodeColors = [0x00d4ff, 0x7c3aed, 0x00e5ff, 0x9333ea];
    var positions  = [];
    var velocities = [];
    var meshes     = [];

    for (var i = 0; i < COUNT; i++) {
      var px = (Math.random() - 0.5) * 70;
      var py = (Math.random() - 0.5) * 44;
      var pz = (Math.random() - 0.5) * 28;
      positions.push([px, py, pz]);
      velocities.push([
        (Math.random() - 0.5) * 0.016,
        (Math.random() - 0.5) * 0.012,
        (Math.random() - 0.5) * 0.007
      ]);
      var col  = nodeColors[Math.floor(Math.random() * nodeColors.length)];
      var mat  = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.75 });
      var mesh = new THREE.Mesh(nodeGeo, mat);
      mesh.position.set(px, py, pz);
      scene.add(mesh);
      meshes.push(mesh);
    }

    /* Edge line segments */
    var linePos = new Float32Array(MAX_EDGES * 6);
    var lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    lineGeo.setDrawRange(0, 0);
    var lineMat = new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.10 });
    scene.add(new THREE.LineSegments(lineGeo, lineMat));

    var mx = 0, my = 0;
    if (!isMobile) {
      window.addEventListener('mousemove', function(e) {
        mx = (e.clientX / window.innerWidth  - 0.5) * 50;
        my = -(e.clientY / window.innerHeight - 0.5) * 32;
      }, { passive: true });
    }

    var rafId;
    function tick() {
      rafId = requestAnimationFrame(tick);
      var edgeCount = 0;

      for (var ii = 0; ii < COUNT; ii++) {
        positions[ii][0] += velocities[ii][0];
        positions[ii][1] += velocities[ii][1];
        positions[ii][2] += velocities[ii][2];

        if (Math.abs(positions[ii][0]) > 36) velocities[ii][0] *= -1;
        if (Math.abs(positions[ii][1]) > 23) velocities[ii][1] *= -1;
        if (Math.abs(positions[ii][2]) > 15) velocities[ii][2] *= -1;

        meshes[ii].position.set(positions[ii][0], positions[ii][1], positions[ii][2]);

        for (var jj = ii + 1; jj < COUNT && edgeCount < MAX_EDGES; jj++) {
          var ddx = positions[ii][0] - positions[jj][0];
          var ddy = positions[ii][1] - positions[jj][1];
          var ddz = positions[ii][2] - positions[jj][2];
          if (ddx*ddx + ddy*ddy + ddz*ddz < THRESH_SQ) {
            var b = edgeCount * 6;
            linePos[b]   = positions[ii][0]; linePos[b+1] = positions[ii][1]; linePos[b+2] = positions[ii][2];
            linePos[b+3] = positions[jj][0]; linePos[b+4] = positions[jj][1]; linePos[b+5] = positions[jj][2];
            edgeCount++;
          }
        }
      }

      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, edgeCount * 2);

      if (!isMobile) {
        camera.position.x += (mx * 0.06 - camera.position.x) * 0.02;
        camera.position.y += (my * 0.04 - camera.position.y) * 0.02;
      }
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }

    tick();

    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });

    document.addEventListener('visibilitychange', function() {
      if (document.hidden) cancelAnimationFrame(rafId);
      else tick();
    });
  }
  initHeroCanvas();

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

  /* ─── HERO 3D MOUSE PARALLAX + STATS IDLE FLOAT ─── */
  if (gsapOK) {
    const heroEl    = document.querySelector('.hero');
    const statsCard = document.querySelector('.stats-card');

    /* Idle 3D rock — runs when mouse is away from hero */
    let statsIdleTl = null;
    if (statsCard) {
      statsIdleTl = gsap.timeline({ repeat: -1, yoyo: true })
        .to(statsCard, {
          rotateY: 6, rotateX: -4,
          transformPerspective: 1000,
          duration: 4.0, ease: 'sine.inOut'
        })
        .to(statsCard, {
          rotateY: -4, rotateX: 3,
          duration: 5.0, ease: 'sine.inOut'
        });
    }

    if (heroEl && canHover) {
      heroEl.addEventListener('mousemove', function (e) {
        if (statsIdleTl) statsIdleTl.pause();
        const dx = (e.clientX / window.innerWidth  - 0.5) * 2;
        const dy = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to('.hero-title', { x: dx * 10, y: dy * 6, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
        gsap.to('.hero-tag, .hero-role, .hero-desc, .hero-actions, .hero-links',
                { x: dx * 5, y: dy * 3, duration: 1.1, ease: 'power2.out', overwrite: 'auto' });
        gsap.to(statsCard, {
          rotateY: dx * 12, rotateX: dy * -7,
          transformPerspective: 1000,
          x: dx * 8, y: dy * 4,
          duration: 0.7, ease: 'power2.out', overwrite: 'auto'
        });
      });
      heroEl.addEventListener('mouseleave', function () {
        gsap.to('.hero-title, .hero-tag, .hero-role, .hero-desc, .hero-actions, .hero-links',
                { x: 0, y: 0, duration: 1.2, ease: 'power3.out' });
        gsap.to(statsCard, {
          rotateY: 0, rotateX: 0, x: 0, y: 0,
          duration: 1.0, ease: 'elastic.out(1, 0.4)',
          onComplete: function () { if (statsIdleTl) statsIdleTl.play(); }
        });
      });
    }
  }

  /* ─── 3D CARD TILT ───────────────────────────────── */
  if (gsapOK && canHover) {
    function addTilt(sel, deg) {
      document.querySelectorAll(sel).forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          card.style.willChange = 'transform';
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
          gsap.to(card, {
            rotateY: 0, rotateX: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)',
            onComplete: function() { card.style.willChange = 'auto'; }
          });
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

  /* Fade scroll hint once the user scrolls */
  window.addEventListener('scroll', function fadeHint() {
    if (window.scrollY > 80) {
      if (gsapOK) gsap.to('.hero-scroll-hint', { autoAlpha: 0, duration: 0.4 });
      window.removeEventListener('scroll', fadeHint);
    }
  }, { passive: true });

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

    /* Section titles — clip reveal + 3D tilt-in */
    document.querySelectorAll('.reveal-title').forEach(function (el) {
      gsap.fromTo(el,
        { clipPath: 'inset(0 0 100% 0)', y: 40, autoAlpha: 0, rotateX: 12, transformPerspective: 900 },
        {
          clipPath: 'inset(0 0 0% 0)', y: 0, autoAlpha: 1, rotateX: 0,
          duration: 1.1, ease: 'power4.out',
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

    /* Skill cards — subtle Z-depth shift on scroll (closer as you pass) */
    document.querySelectorAll('.skill-card').forEach(function (card, i) {
      gsap.fromTo(card,
        { z: -40, transformPerspective: 1000 },
        {
          z: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            end: 'top 30%',
            scrub: 1.5
          }
        }
      );
    });

  }

  /* ─── COUNTER ANIMATION ──────────────────────────── */
  var cntObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var el  = entry.target;
      var max = parseInt(el.dataset.count, 10);
      var sfx = el.dataset.suffix || '';
      if (isNaN(max)) return;
      cntObs.unobserve(el);
      var startTs = null;
      var dur = 900;
      function step(ts) {
        if (!startTs) startTs = ts;
        var p     = Math.min((ts - startTs) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * max) + sfx;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = max + sfx;
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(function(el) {
    cntObs.observe(el);
  });

  /* ─── CONTACT FORM ───────────────────────────────── */
  var form      = document.getElementById('contactForm');
  var success   = document.getElementById('formSuccess');
  var submitBtn = document.getElementById('submitBtn');
  var msgField  = document.getElementById('contactMessage');
  var charCount = document.getElementById('charCounter');

  if (msgField && charCount) {
    msgField.addEventListener('input', function () {
      var n = this.value.length;
      charCount.textContent = n + ' / 500';
      charCount.style.color = n > 450 ? 'rgba(248,113,113,0.9)' : '';
    });
  }

  function setFieldError(inputId, errorId, msg) {
    var inp = document.getElementById(inputId);
    var err = document.getElementById(errorId);
    if (inp) inp.classList.toggle('is-error', !!msg);
    if (err) err.textContent = msg;
  }

  function clearFormErrors() {
    ['contactName', 'contactEmail', 'contactMessage'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.classList.remove('is-error');
    });
    ['nameError', 'emailError', 'msgError'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.textContent = '';
    });
    var se = document.getElementById('formSubmitError');
    if (se) se.textContent = '';
  }

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      clearFormErrors();

      var name    = document.getElementById('contactName').value.trim();
      var email   = document.getElementById('contactEmail').value.trim();
      var message = document.getElementById('contactMessage').value.trim();
      var valid   = true;

      if (!name) {
        setFieldError('contactName', 'nameError', 'Please enter your name.');
        valid = false;
      }
      if (!email) {
        setFieldError('contactEmail', 'emailError', 'Please enter your email address.');
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFieldError('contactEmail', 'emailError', 'Please enter a valid email address.');
        valid = false;
      }
      if (!message) {
        setFieldError('contactMessage', 'msgError', 'Please enter a message.');
        valid = false;
      }
      if (!valid) return;

      submitBtn.disabled    = true;
      submitBtn.textContent = 'Sending…';

      try {
        var res  = await fetch('https://api.web3forms.com/submit', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: '8a06ef9f-a39e-4ca3-afa3-b772c4351249',
            subject: 'Portfolio Contact from ' + name,
            name: name, email: email, message: message
          })
        });
        var data = await res.json();
        if (data.success) {
          form.style.display = 'none';
          if (charCount) charCount.textContent = '0 / 500';
          success.classList.add('visible');
        } else {
          throw new Error(data.message || 'Failed');
        }
      } catch (err) {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Message';
        var se = document.getElementById('formSubmitError');
        if (se) se.textContent = 'Something went wrong. Please email uday.v3669@gmail.com directly.';
      }
    });
  }

});
