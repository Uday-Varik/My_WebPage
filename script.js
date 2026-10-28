/* v2 — deliberately quiet. One reveal, one form, no cursor, no canvas,
   no marquee. Contact links are the same destinations as the live site;
   the email is still base64-encoded in source and decoded at runtime. */
var PERSONAL = {
  emailEncoded: 'dWRheS52MzY2OUBnbWFpbC5jb20=',
  linkedin: 'https://linkedin.com/in/udayv59',
  github: 'https://github.com/Uday-Varik',
  resume: 'MyResumes/Uday_Varikuppala_Data_Scientist_Resume.pdf'
};
try { PERSONAL.email = atob(PERSONAL.emailEncoded); } catch (e) { PERSONAL.email = ''; }

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-bind]').forEach(function (el) {
    var key = el.dataset.bind, value = PERSONAL[key];
    if (!value) return;
    el.href = key === 'email' && PERSONAL.email ? 'mailto:' + PERSONAL.email : value;
    if (el.dataset.bindText === 'true' && PERSONAL.email) el.textContent = PERSONAL.email;
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  var form = document.getElementById('contactForm');
  if (form) {
    var msgField = document.getElementById('contactMessage'), counter = document.getElementById('charCounter');
    if (msgField && counter) msgField.addEventListener('input', function () { counter.textContent = this.value.length + ' / 500'; });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('contactName').value.trim();
      var email = document.getElementById('contactEmail').value.trim();
      var msg = document.getElementById('contactMessage').value.trim();
      var ok = true;
      function err(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; if (text) ok = false; }
      err('nameError', name ? '' : 'Please enter your name.');
      err('emailError', !email ? 'Please enter your email address.' : (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Please enter a valid email address.'));
      err('msgError', msg ? '' : 'Please enter a message.');
      if (!ok || !PERSONAL.email) return;
      var subject = encodeURIComponent('Portfolio Contact from ' + name);
      var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + msg);
      window.location.href = 'mailto:' + PERSONAL.email + '?subject=' + subject + '&body=' + body;
      document.getElementById('formSuccess').classList.add('visible');
    });
  }
});
