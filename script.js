// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        const isDark = document.body.classList.contains('dark-mode');
        if (window.scrollY > 50) {
            navbar.style.background = isDark ? 'rgba(15, 23, 42, 0.99)' : 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = '';
        }
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    // Observe skill categories
    document.querySelectorAll('.skill-category').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    // Observe project cards
    document.querySelectorAll('.project-card').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    // Add stagger delay to project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Contact form: character counter
    const messageField = document.getElementById('contactMessage');
    const charCounter = document.getElementById('charCounter');
    if (messageField && charCounter) {
        messageField.addEventListener('input', function() {
            const len = this.value.length;
            charCounter.textContent = `${len}/500`;
            charCounter.style.color = len > 450 ? 'rgba(225,29,72,0.7)' : 'rgba(255,255,255,0.4)';
        });
    }

    // Contact form: submit via Web3Forms
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            if (!name || !email || !message) return;

            const submitBtn = contactForm.querySelector('.btn-send');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';

            try {
                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                        access_key: '8a06ef9f-a39e-4ca3-afa3-b772c4351249',
                        subject: 'Portfolio Contact from ' + name,
                        name,
                        email,
                        message
                    })
                });
                const data = await res.json();
                if (data.success) {
                    const successMsg = document.getElementById('formSuccess');
                    contactForm.style.display = 'none';
                    successMsg.classList.add('visible');
                } else {
                    throw new Error(data.message || 'Submission failed');
                }
            } catch (err) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i class="fas fa-envelope"></i>';
                alert('Sorry, something went wrong. Please try again or email uday.v3669@gmail.com directly.');
            }
        });
    }

    // Dark / Light mode toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    function applyTheme(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'dark');

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = !document.body.classList.contains('dark-mode');
            applyTheme(isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
    
    // Typing effect for hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        setTimeout(typeWriter, 500);
    }
    
    // Counter animation for stats
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text);
                const suffix = text.replace(/[0-9]/g, '');
                
                if (!isNaN(number)) {
                    let current = 0;
                    const increment = number / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= number) {
                            target.textContent = text;
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(current) + suffix;
                        }
                    }, 30);
                }
                
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => statsObserver.observe(stat));
});

// Add CSS for mobile menu
document.head.insertAdjacentHTML('beforeend', `
<style>
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background: white;
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0,0,0,0.05);
            padding: 2rem 0;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu li {
            margin: 1rem 0;
        }
    }
</style>
`);
