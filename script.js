/* =============================================
   BELLE WONG — RESUME LANDING PAGE
   script.js — Interactions & Animations
   ============================================= */

'use strict';

/* ===== NAVBAR: Scroll state ===== */
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
};
window.addEventListener('scroll', onScroll, { passive: true });

/* ===== NAVBAR: Mobile toggle ===== */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});
// Close on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) navLinks.classList.remove('open');
});

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // Stagger sibling cards slightly
      const delay = Math.min(idx * 60, 300);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== COUNTER ANIMATION ===== */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCount(el) {
  const target   = parseInt(el.dataset.count, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 1600; // ms
  const start    = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value    = Math.round(easeOutCubic(progress) * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix; // ensure exact final value
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

// Hero stats
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
// KPI section counts
document.querySelectorAll('.count-up').forEach(el => counterObserver.observe(el));

/* ===== THROUGHPUT BAR ANIMATION ===== */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Slight delay so user sees the bars grow in
      setTimeout(() => {
        entry.target.querySelectorAll('.tp-bar').forEach(bar => {
          const w = bar.dataset.width;
          bar.style.width = w + '%';
        });
      }, 200);
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.kpi-featured').forEach(el => barObserver.observe(el));

/* ===== SMOOTH SCROLL for anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight + 8;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== ACTIVE NAV LINK highlight on scroll ===== */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a[href^="#"]');

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAs.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--accent)' : '';
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(s => activeSectionObserver.observe(s));
