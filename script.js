/* ═══════════════════════════════════════════════
   SATKAR WAGLE — PORTFOLIO SCRIPTS
   ═══════════════════════════════════════════════ */

'use strict';

document.documentElement.classList.add('js');

const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const navAnchors = [...document.querySelectorAll('.nav-links a')];
const skillButtons = [...document.querySelectorAll('.skill-button')];
const skillNote = document.getElementById('skill-note');
const year = document.getElementById('year');

if (year) year.textContent = String(new Date().getFullYear());

function setMenuOpen(isOpen) {
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  navLinks.classList.toggle('is-open', isOpen);
}

menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

navAnchors.forEach((anchor) => {
  anchor.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

document.addEventListener('click', (event) => {
  if (menuToggle.getAttribute('aria-expanded') === 'true' && !event.target.closest('.nav')) {
    setMenuOpen(false);
  }
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.hero-title, .hero-intro, .hero-foot, .intro-content, .section-heading, .project, .skills-heading, .skill-group, .contact-main');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

  revealItems.forEach((item) => {
    item.classList.add('reveal');
    revealObserver.observe(item);
  });
}

skillButtons.forEach((button) => {
  button.addEventListener('focus', () => describeSkill(button));
  button.addEventListener('mouseenter', () => describeSkill(button));
  button.addEventListener('click', () => {
    skillButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    describeSkill(button);
  });
});

function describeSkill(button) {
  const projects = button.dataset.projects;
  skillNote.textContent = projects ? `Used in: ${projects}.` : `${button.textContent} is part of my toolkit.`;
}

const observedSections = document.querySelectorAll('main section[id]');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((anchor) => {
        if (anchor.getAttribute('href') === `#${entry.target.id}`) {
          anchor.setAttribute('aria-current', 'location');
        } else {
          anchor.removeAttribute('aria-current');
        }
      });
    });
  }, { rootMargin: '-25% 0px -65% 0px' });

  observedSections.forEach((section) => sectionObserver.observe(section));
}
