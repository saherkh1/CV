// ---------- Navbar background on scroll ----------
const navbar = document.querySelector('.navbarScroll');
const scrollProgress = document.getElementById('scrollProgress');
const backToTopBtn = document.getElementById('backToTop');

function onScroll() {
    const y = window.scrollY || window.pageYOffset;

    if (navbar) navbar.classList.toggle('scrolled', y > 0);

    if (scrollProgress) {
        const doc = document.documentElement;
        const max = (doc.scrollHeight - doc.clientHeight) || 1;
        scrollProgress.style.width = ((y / max) * 100) + '%';
    }

    if (backToTopBtn) backToTopBtn.classList.toggle('visible', y > 400);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Smooth scroll for nav links ----------
document.querySelectorAll('.nav-link, a.scroll-cue, .navbar-brand').forEach((link) => {
    link.addEventListener('click', function (event) {
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: offset, behavior: 'smooth' });

        // Collapse mobile menu if open
        const collapse = document.getElementById('navbarSupportedContent');
        if (collapse && collapse.classList.contains('show') && window.bootstrap) {
            const inst = window.bootstrap.Collapse.getInstance(collapse) || new window.bootstrap.Collapse(collapse, { toggle: false });
            inst.hide();
        }
    });
});

// ---------- Back to top ----------
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---------- Section reveal on scroll ----------
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

// ---------- Active section highlight (scrollspy) ----------
const sectionIds = ['home', 'about', 'skills', 'portfolio', 'timeline', 'certifications', 'testimonials', 'contact'];
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
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach((s) => spy.observe(s));
}

// ---------- Typing animation in hero ----------
const typedEl = document.getElementById('typed');
if (typedEl) {
    const phrases = [
        'C# / .NET backend services.',
        'cloud-native apps on AWS.',
        'APIs that don’t wake you up at 3am.',
        'full-stack features when needed.'
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;

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
    tick();
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
