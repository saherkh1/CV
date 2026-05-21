// ============================================================
//  Saher Khateeb — CV interactions
// ============================================================
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Particle constellation hero ----------
  (function heroParticles() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr, particles, raf;
    const mouse = { x: -9999, y: -9999 };

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function build() {
      size();
      const count = Math.min(120, Math.round((w * h) / 13000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 128) {
            ctx.strokeStyle = 'rgba(56, 189, 248, ' + (1 - d / 128) * 0.42 + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dm < 160) {
          ctx.strokeStyle = 'rgba(125, 211, 252, ' + (1 - dm / 160) * 0.6 + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        ctx.fillStyle = 'rgba(125, 211, 252, 0.85)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = mouse.y = -9999;
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 200);
    });

    build();
    if (reduceMotion) {
      draw();
      cancelAnimationFrame(raf); // single static frame
    } else {
      draw();
    }
  })();

  // ---------- Expandable timeline ----------
  document.querySelectorAll('.timeline-head').forEach((head) => {
    head.addEventListener('click', () => {
      const item = head.closest('.timeline-item');
      const open = item.classList.toggle('expanded');
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // ---------- Scroll: progress bar, navbar, back-to-top ----------
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (navbar) navbar.classList.toggle('scrolled', y > 4);
    if (scrollProgress) {
      const doc = document.documentElement;
      const max = (doc.scrollHeight - doc.clientHeight) || 1;
      scrollProgress.style.width = ((y / max) * 100) + '%';
    }
    if (backToTop) backToTop.classList.toggle('visible', y > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Mobile nav toggle ----------
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // ---------- Smooth scroll for in-page links ----------
  document.querySelectorAll('.nav-link, a.scroll-cue, .navbar-brand, .hero-buttons a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function (event) {
      const href = this.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top: offset, behavior: 'smooth' });
      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ---------- Section reveal ----------
  const revealEls = document.querySelectorAll('.section-reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('revealed'));
  }

  // ---------- Scrollspy (active nav highlight) ----------
  const sectionIds = ['home', 'about', 'services', 'skills', 'portfolio', 'timeline', 'certifications', 'testimonials', 'contact'];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((l) => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }

  // ---------- Typing animation ----------
  const typedEl = document.getElementById('typed');
  if (typedEl) {
    const phrases = [
      'reliable backend services.',
      'cloud-native apps on AWS.',
      'APIs that don’t page you at 3am.',
      'full-stack features, hardware included.'
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function tick() {
      const current = phrases[phraseIdx];
      if (!deleting) {
        typedEl.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
      } else {
        typedEl.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 70);
    }

    if (reduceMotion) {
      typedEl.textContent = phrases[0];
    } else {
      tick();
    }
  }

  // ---------- Portfolio filtering ----------
  const filterChips = document.querySelectorAll('.filter-chip');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      portfolioItems.forEach((item) => {
        const tags = (item.dataset.tags || '').split(' ');
        const show = filter === 'all' || tags.includes(filter);
        item.classList.toggle('hidden', !show);
      });
    });
  });

  // ---------- Footer year ----------
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
