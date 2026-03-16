/* =============================================
   CARL MASTERS PORTFOLIO — script.js
   ============================================= */

'use strict';

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');
const syncNavbarScrollState = () => {
  if (navbar.classList.contains('menu-open')) return;
  navbar.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', syncNavbarScrollState, { passive: true });
syncNavbarScrollState();

/* ---- Active nav link on scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const setActiveLink = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};
window.addEventListener('scroll', setActiveLink, { passive: true });

/* ---- Mobile hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.querySelector('.nav-links');

const closeMobileMenu = () => {
  hamburger.classList.remove('open');
  navLinksEl.classList.remove('mobile-open');
  navbar.classList.remove('menu-open');
  document.body.style.overflow = '';
  syncNavbarScrollState();
};

hamburger.addEventListener('click', () => {
  const isOpening = !navLinksEl.classList.contains('mobile-open');
  if (isOpening) {
    hamburger.classList.add('open');
    navLinksEl.classList.add('mobile-open');
    navbar.classList.remove('scrolled');
    navbar.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    return;
  }
  closeMobileMenu();
});

navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

/* ---- Smooth-close mobile menu on outside click ---- */
document.addEventListener('click', e => {
  if (navLinksEl.classList.contains('mobile-open') &&
      !navLinksEl.contains(e.target) &&
      !hamburger.contains(e.target)) {
    closeMobileMenu();
  }
});

/* ---- Rotating role text ---- */
const roles = [
  'Problem Solver',
  'Web Developer',
  'CS Student @ TUJ',
  'Aspiring Engineer',
  'Always Learning',
];
let roleIndex = 0;
const roleEl = document.getElementById('rotating-role');

const rotateRole = () => {
  roleEl.style.opacity = '0';
  setTimeout(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    roleEl.textContent = roles[roleIndex];
    roleEl.style.opacity = '1';
  }, 300);
};
setInterval(rotateRole, 2800);

/* ---- Particle canvas background ---- */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  const PARTICLE_COUNT = 70;
  const LINE_DIST      = 130;
  const SPEED          = 0.4;

  class Particle {
    constructor() { this.reset(true); }

    reset(random) {
      this.x  = random ? Math.random() * W : (Math.random() < 0.5 ? 0 : W);
      this.y  = random ? Math.random() * H : Math.random() * H;
      this.vx = (Math.random() - 0.5) * SPEED;
      this.vy = (Math.random() - 0.5) * SPEED;
      this.r  = Math.random() * 1.8 + 0.6;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(108,99,255,0.55)';
      ctx.fill();
    }
  }

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    if (!particles) {
      particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    } else {
      particles.forEach(p => { p.x = Math.random() * W; p.y = Math.random() * H; });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINE_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${(1 - dist / LINE_DIST) * 0.18})`;
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();

/* ---- Animated counters (About stats) ---- */
const animateCounter = (el) => {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const step     = 16;
  const steps    = duration / step;
  let count      = 0;

  const timer = setInterval(() => {
    count++;
    el.textContent = Math.round((count / steps) * target);
    if (count >= steps) {
      el.textContent = target;
      clearInterval(timer);
    }
  }, step);
};

/* ---- Scroll-reveal via IntersectionObserver ---- */
const observerOpts = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOpts);

/* Project cards stagger */
document.querySelectorAll('.project-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
  revealObserver.observe(card);
});

/* Timeline items */
document.querySelectorAll('.timeline-item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.15}s`;
  revealObserver.observe(item);
});

/* Stat counters */
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

/* ---- Contact form ---- */
const form       = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();

  /* Basic validation */
  if (!name || !email || !message) {
    setStatus('Please fill in your name, email, and message.', 'error');
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    setStatus('Please enter a valid email address.', 'error');
    return;
  }

  const endpoint = form.getAttribute('action') || '';
  if (!endpoint || endpoint.includes('/yourFormId')) {
    setStatus('Form not configured yet. Add your Formspree form ID in index.html.', 'error');
    return;
  }

  const submitBtn = form.querySelector('[type="submit"]');
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled    = true;

  try {
    const formData = new FormData(form);
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      setStatus('Message sent! I\'ll get back to you soon.', 'success');
      form.reset();
    } else {
      setStatus('Could not send message. Please try again in a moment.', 'error');
    }
  } catch (error) {
    setStatus('Network error. Please check your connection and try again.', 'error');
  } finally {
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled    = false;
  }
});

function setStatus(msg, type) {
  formStatus.textContent  = msg;
  formStatus.className    = `form-status ${type}`;
}
