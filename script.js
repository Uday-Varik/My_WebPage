/* Config: link targets. Email stays base64 encoded and is decoded at runtime, as on the live site. It is never written as visible text: links that use it say Gmail. */
var PERSONAL = {
  emailEncoded: 'dWRheS52MzY2OUBnbWFpbC5jb20=',
  linkedin: 'https://linkedin.com/in/udayv59',
  github: 'https://github.com/Uday-Varik',
  resume: 'MyResumes/Uday_Varikuppala_Data_Scientist_Resume.pdf'
};
try { PERSONAL.email = atob(PERSONAL.emailEncoded); } catch (e) { PERSONAL.email = ''; }
var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Links and menu: bind data-bind links, full-screen menu with Escape, scroll lock, focus handling, and Work submenu. */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-bind]').forEach(function (el) {
    var key = el.dataset.bind, value = PERSONAL[key];
    if (key === 'email' && !PERSONAL.email) { el.removeAttribute('href'); return; }
    if (!value) return;
    el.href = key === 'email' ? 'mailto:' + PERSONAL.email : value;
  });
  var overlay = document.getElementById('menuOverlay');
  var openBtn = document.getElementById('menuBtn');
  var closeBtn = document.getElementById('menuClose');
  function setMenu(open) {
    if (!overlay) return;
    overlay.classList.toggle('open', open);
    overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('menu-open', open);
    if (openBtn) openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open && closeBtn) closeBtn.focus();
    if (!open && openBtn) openBtn.focus();
  }
  if (openBtn) openBtn.addEventListener('click', function () { setMenu(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) setMenu(false);
  });
  if (overlay) overlay.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  var subBtn = document.getElementById('menuSubBtn'), sub = document.getElementById('menuSub');
  if (subBtn && sub) subBtn.addEventListener('click', function () {
    var open = subBtn.getAttribute('aria-expanded') === 'true';
    subBtn.setAttribute('aria-expanded', String(!open));
    sub.classList.toggle('open', !open);
  });
});

/* Motion systems only: fade/brighten, scroll-focus, header blur, stage with counted filters, single-open accordion. No other motion systems. */
document.addEventListener('DOMContentLoaded', function () {
  /* Fade/brighten. */
  var bright = document.querySelectorAll('.fade-brighten');
  if (reducedMotion) { bright.forEach(function (el) { el.classList.add('bright'); }); }
  else {
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('bright'); bio.unobserve(e.target); } });
    }, { threshold: 0.2 });
    bright.forEach(function (el) { bio.observe(el); });
  }
  /* Scroll-focus: title nearest the centre brightens, the rest dims. */
  var titles = document.querySelectorAll('.focus-title');
  function focusTitle() {
    var mid = window.innerHeight / 2, best = null, bestDist = Infinity;
    titles.forEach(function (t) {
      var r = t.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestDist) { bestDist = d; best = t; }
    });
    titles.forEach(function (t) { t.classList.toggle('in-focus', t === best); });
  }
  window.addEventListener('scroll', focusTitle, { passive: true });
  focusTitle();
  /* Header blur strengthens on scroll. */
  var nav = document.getElementById('siteNav');
  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });
  /* Stage with counted filters. */
  var cases = Array.prototype.slice.call(document.querySelectorAll('.case'));
  var indexEl = document.getElementById('caseIndex');
  var filter = 'all', visible = cases.slice(), current = 0;
  function show(i) {
    if (!visible.length) return;
    current = (i + visible.length) % visible.length;
    cases.forEach(function (c) { c.classList.toggle('active', c === visible[current]); });
    if (indexEl) indexEl.textContent = '0' + (cases.indexOf(visible[current]) + 1) + ' / 0' + cases.length;
  }
  document.querySelectorAll('.filter-pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      document.querySelectorAll('.filter-pill').forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');
      filter = pill.dataset.filter;
      visible = cases.filter(function (c) { return filter === 'all' || c.dataset.kind === filter; });
      show(0);
    });
  });
  var prev = document.getElementById('prevCase'), next = document.getElementById('nextCase');
  if (prev) prev.addEventListener('click', function () { show(current - 1); });
  if (next) next.addEventListener('click', function () { show(current + 1); });
  document.querySelectorAll('[data-case-link]').forEach(function (link) {
    link.addEventListener('click', function () {
      var idx = parseInt(link.dataset.caseLink, 10) || 0;
      document.querySelectorAll('.filter-pill').forEach(function (p) { p.classList.toggle('active', p.dataset.filter === 'all'); });
      filter = 'all'; visible = cases.slice(); show(idx);
    });
  });
  show(0);
  /* Single-open accordion. */
  var accBtns = document.querySelectorAll('.acc-btn');
  accBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.nextElementSibling, open = btn.getAttribute('aria-expanded') === 'true';
      accBtns.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); if (b.nextElementSibling) b.nextElementSibling.classList.remove('open'); });
      if (!open) { btn.setAttribute('aria-expanded', 'true'); if (panel) panel.classList.add('open'); }
    });
  });
});

/* Demos: every control works, instantly, with synthetic values only. No animation, no real data. */
document.addEventListener('DOMContentLoaded', function () {
  var dist = document.getElementById('distRange'), weather = document.getElementById('weatherRange'), load = document.getElementById('loadRange');
  function updateDelay() {
    if (!dist) return;
    var d = parseInt(dist.value, 10), w = parseInt(weather.value, 10), l = parseInt(load.value, 10);
    document.getElementById('distOut').textContent = d;
    document.getElementById('weatherOut').textContent = ['Low', 'Medium', 'High'][w];
    document.getElementById('loadOut').textContent = ['Low', 'Normal', 'High'][l];
    var distPoints = (d / 1000) * 40, weatherPoints = (w / 2) * 35, loadPoints = (l / 2) * 25;
    var score = Math.round(Math.min(100, distPoints + weatherPoints + loadPoints));
    var risk = score < 40 ? 'Low' : score < 70 ? 'Medium' : 'High';
    document.getElementById('delayResult').textContent = 'Estimated delay risk: ' + risk + ' (illustrative)';
    var scoreEl = document.getElementById('delayScore');
    if (scoreEl) scoreEl.textContent = score;
    var confEl = document.getElementById('delayConfidence');
    if (confEl) confEl.textContent = risk === 'High' ? 'Low' : risk === 'Medium' ? 'Medium' : 'High';
    var barD = document.getElementById('barDistance'), barW = document.getElementById('barWeather'), barL = document.getElementById('barLoad');
    if (barD) barD.style.width = Math.round((d / 1000) * 100) + 'px';
    if (barW) barW.style.width = Math.round((w / 2) * 100) + 'px';
    if (barL) barL.style.width = Math.round((l / 2) * 100) + 'px';
    var guard = document.getElementById('delayGuardrail');
    if (guard) guard.hidden = risk !== 'High';
  }
  [dist, weather, load].forEach(function (el) { if (el) el.addEventListener('input', updateDelay); });
  updateDelay();
  var delayReset = document.getElementById('delayReset');
  if (delayReset) delayReset.addEventListener('click', function () {
    dist.value = 250; weather.value = 0; load.value = 1;
    updateDelay();
  });
  var routeBtn = document.getElementById('routeBtn');
  if (routeBtn) routeBtn.addEventListener('click', function () {
    var checked = document.querySelector('input[name="complaintType"]:checked');
    var v = checked ? checked.value : '';
    var routes = { delivery: 'Delivery operations team', billing: 'Billing support team', damage: 'Claims and damage team' };
    document.getElementById('routeResult').textContent = v ? 'Routed to: ' + routes[v] + ' (illustrative)' : 'Pick a complaint type first.';
  });
  var ahead = document.getElementById('aheadRange'), rain = document.getElementById('rainRange');
  function updateNoshow() {
    if (!ahead) return;
    var a = parseInt(ahead.value, 10), r = parseInt(rain.value, 10);
    document.getElementById('aheadOut').textContent = a;
    document.getElementById('rainOut').textContent = r ? 'Yes' : 'No';
    var chance = a > 14 || r ? 'High' : a > 7 ? 'Medium' : 'Low';
    document.getElementById('noshowResult').textContent = 'Estimated no-show chance: ' + chance + ' (illustrative)';
    var chanceEl = document.getElementById('noshowChance');
    if (chanceEl) chanceEl.textContent = chance;
    var shapA = document.getElementById('shapAhead'), shapR = document.getElementById('shapRain');
    if (shapA) shapA.style.width = Math.min(100, a * 3 + 20) + 'px';
    if (shapR) shapR.style.width = r ? '80px' : '15px';
  }
  [ahead, rain].forEach(function (el) { if (el) el.addEventListener('input', updateNoshow); });
  updateNoshow();
  var drift = document.getElementById('driftRange'), threshold = document.getElementById('thresholdRange');
  var driftStatus = document.getElementById('driftStatus');
  function clearDriftStatus() {
    if (driftStatus) driftStatus.hidden = true;
    document.querySelectorAll('#driftStatus li').forEach(function (li) { li.classList.remove('on'); });
  }
  function updateDriftLabels() {
    if (!drift) return;
    document.getElementById('driftOut').textContent = drift.value;
    document.getElementById('thresholdOut').textContent = threshold.value;
    var scoreEl = document.getElementById('driftScore');
    if (scoreEl) scoreEl.textContent = drift.value + '%';
    document.getElementById('driftResult').textContent = 'Set drift and threshold, then check.';
    clearDriftStatus();
  }
  [drift, threshold].forEach(function (el) { if (el) el.addEventListener('input', updateDriftLabels); });
  updateDriftLabels();
  var driftBtn = document.getElementById('driftBtn');
  if (driftBtn) driftBtn.addEventListener('click', function () {
    var d = parseInt(drift.value, 10), t = parseInt(threshold.value, 10);
    var exceeded = d >= t;
    if (driftStatus) driftStatus.hidden = !exceeded;
    document.querySelectorAll('#driftStatus li').forEach(function (li) { li.classList.toggle('on', exceeded); });
    document.getElementById('driftResult').textContent = exceeded
      ? 'Drift ' + d + '% is at or above the ' + t + '% threshold. (illustrative)'
      : 'Drift ' + d + '% is below the ' + t + '% threshold. No retraining. Monitoring continues. (illustrative)';
  });
  var driftReset = document.getElementById('driftReset');
  if (driftReset) driftReset.addEventListener('click', function () {
    drift.value = 4; threshold.value = 8;
    document.getElementById('driftResult').textContent = 'Set drift and threshold, then check.';
    updateDriftLabels();
  });
});

/* Contact form: validate, focus the first invalid field, then open a pre-filled mail message with the purpose in the subject. No message is sent by the page itself. */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contactForm');
  if (!form) return;
  var msgField = document.getElementById('contactMessage'), counter = document.getElementById('charCounter');
  if (msgField && counter) msgField.addEventListener('input', function () { counter.textContent = this.value.length + ' / 500'; });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('contactName').value.trim();
    var email = document.getElementById('contactEmail').value.trim();
    var msg = document.getElementById('contactMessage').value.trim();
    var purposeEl = document.getElementById('contactPurpose');
    var purpose = purposeEl ? purposeEl.value : 'Collaboration';
    var ok = true;
    function err(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; if (text) ok = false; }
    err('nameError', name ? '' : 'Please enter your name.');
    err('emailError', !email ? 'Please enter your email address.' : (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Please enter a valid email address.'));
    err('msgError', msg ? '' : 'Please enter a message.');
    if (!ok) {
      var first = !name ? 'contactName' : !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'contactEmail' : 'contactMessage';
      var firstEl = document.getElementById(first);
      if (firstEl) firstEl.focus();
      return;
    }
    if (!PERSONAL.email) {
      var submitErr = document.getElementById('formSubmitError');
      if (submitErr) submitErr.textContent = 'Mail is not available right now. Use the Gmail link below instead.';
      return;
    }
    var subject = encodeURIComponent('Portfolio Contact: ' + purpose + ' from ' + name);
    var body = encodeURIComponent('Purpose: ' + purpose + '\nName: ' + name + '\nEmail: ' + email + '\n\n' + msg);
    window.location.href = 'mailto:' + PERSONAL.email + '?subject=' + subject + '&body=' + body;
    document.getElementById('formSuccess').classList.add('visible');
  });
});

/* Follow one object: 5 steps inside the delay case only. Click, Previous/Next, and arrow keys when focus is inside the walkthrough. Highlights the matching diagram node. */
document.addEventListener('DOMContentLoaded', function () {
  var wrap = document.getElementById('deliveryWalkthrough');
  if (!wrap) return;
  var steps = [
    { title: 'Data arrives', text: 'Demand data and live events arrive.' },
    { title: 'Forecast and score', text: 'XGBoost, LightGBM, and Prophet forecast, then Lambda and SageMaker produce a delay score.' },
    { title: 'Factors shown', text: 'Distance, weather, and hub load are shown.' },
    { title: 'Human decision', text: 'Dispatch reviews the score and decides on a reroute.' },
    { title: 'Guardrail', text: 'Version and drift are checked, and a person makes the final call.' }
  ];
  var current = 0;
  var label = document.getElementById('walkStepLabel');
  var titleEl = document.getElementById('walkStepTitle');
  var textEl = document.getElementById('walkStepText');
  var buttons = Array.prototype.slice.call(wrap.querySelectorAll('[data-walk]'));
  var diagram = document.getElementById('delayDiagram');
  function show(i) {
    current = (i + steps.length) % steps.length;
    label.textContent = 'Step ' + (current + 1) + ' of 5';
    titleEl.textContent = steps[current].title;
    textEl.textContent = steps[current].text;
    buttons.forEach(function (b, idx) { b.setAttribute('aria-current', idx === current ? 'true' : 'false'); });
    if (diagram) diagram.querySelectorAll('span[data-step]').forEach(function (node) {
      var list = node.dataset.step.split(' ');
      node.classList.toggle('diagram-active', list.indexOf(String(current + 1)) !== -1);
    });
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () { show(parseInt(b.dataset.walk, 10) || 0); });
  });
  var prev = document.getElementById('walkPrev'), next = document.getElementById('walkNext');
  if (prev) prev.addEventListener('click', function () { show(current - 1); });
  if (next) next.addEventListener('click', function () { show(current + 1); });
  wrap.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
  });
  show(0);
});

