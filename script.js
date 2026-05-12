/* ═══════════════════════════════════════════════
   SATKAR WAGLE — PORTFOLIO SCRIPTS
   ═══════════════════════════════════════════════ */

'use strict';

// ── DOM REFS ──
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');
const navLinkEls = document.querySelectorAll('.nav-link');
const sendBtn    = document.getElementById('sendBtn');
const reveals    = document.querySelectorAll('.reveal');

// ─────────────────────────────────────────────
// NAVBAR — scroll shadow + active link tracking
// ─────────────────────────────────────────────
let lastScrollY = 0;

function onScroll() {
  const scrollY = window.scrollY;

  // Add shadow on scroll
  navbar.classList.toggle('scrolled', scrollY > 20);

  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 90;
    if (scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinkEls.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  lastScrollY = scrollY;
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // Initial call

// ─────────────────────────────────────────────
// HAMBURGER MENU
// ─────────────────────────────────────────────
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close on nav link click (mobile)
navLinkEls.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

// ─────────────────────────────────────────────
// SCROLL REVEAL — Intersection Observer
// ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

reveals.forEach(el => revealObserver.observe(el));

// ─────────────────────────────────────────────
// CONTACT FORM — Basic validation & feedback
// ─────────────────────────────────────────────
if (sendBtn) {
  sendBtn.addEventListener('click', async () => {
    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const message = document.getElementById('message');

    // Simple validation
    let valid = true;
    [name, email, message].forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = 'rgba(158, 42, 43, 0.7)';
        valid = false;
      }
    });
    if (!valid) { shakeBtn(sendBtn); return; }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      email.style.borderColor = 'rgba(158, 42, 43, 0.7)';
      shakeBtn(sendBtn);
      return;
    }

    // Sending state
    const originalHTML = sendBtn.innerHTML;
    sendBtn.innerHTML = 'Sending…';
    sendBtn.disabled = true;

    try {
      const res = await fetch('https://formspree.io/f/xpqbbpvj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.value.trim(),
          email: email.value.trim(),
          message: message.value.trim(),
        }),
      });

      if (!res.ok) throw new Error('Failed');

      // Success state
      sendBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Message Sent!
      `;
      sendBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
      sendBtn.style.color = '#0d1a1d';

      setTimeout(() => {
        sendBtn.innerHTML = originalHTML;
        sendBtn.style.background = '';
        sendBtn.style.color = '';
        sendBtn.disabled = false;
        name.value = '';
        email.value = '';
        message.value = '';
      }, 3000);

    } catch {
      // Error state
      sendBtn.innerHTML = '✕ Failed — try again';
      sendBtn.style.background = 'rgba(158, 42, 43, 0.7)';
      sendBtn.style.color = '#fff';

      setTimeout(() => {
        sendBtn.innerHTML = originalHTML;
        sendBtn.style.background = '';
        sendBtn.style.color = '';
        sendBtn.disabled = false;
      }, 3000);
    }
  });
}

function shakeBtn(btn) {
  btn.style.animation = 'none';
  btn.offsetHeight; // reflow
  btn.style.animation = 'shake 0.4s ease';
  setTimeout(() => { btn.style.animation = ''; }, 400);
}

// Inject shake keyframes once
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

// ─────────────────────────────────────────────
// SMOOTH SCROLL — fallback for older browsers
// ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 70;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─────────────────────────────────────────────
// HERO TYPING EFFECT — subtle cursor blink
// ─────────────────────────────────────────────
(function initHeroTyping() {
  const heroName = document.querySelector('.hero-name');
  if (!heroName) return;

  // Add a blinking cursor after name — purely decorative
  const cursor = document.createElement('span');
  cursor.textContent = '_';
  cursor.style.cssText = `
    display: inline-block;
    margin-left: 4px;
    color: #e09f3e;
    animation: blink-cursor 1.1s step-end infinite;
    -webkit-text-fill-color: #e09f3e;
    font-weight: 400;
    opacity: 0.7;
  `;

  const blinkStyle = document.createElement('style');
  blinkStyle.textContent = `
    @keyframes blink-cursor {
      0%, 100% { opacity: 0.7; }
      50%       { opacity: 0; }
    }
  `;
  document.head.appendChild(blinkStyle);
  heroName.appendChild(cursor);
})();

// ─────────────────────────────────────────────
// SKILL CARDS — stagger on hover out reset
// ─────────────────────────────────────────────
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transitionDelay = '0ms';
  });
});

// ─────────────────────────────────────────────
// PERFORMANCE — passive listeners where possible
// ─────────────────────────────────────────────
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
}, { passive: true });
