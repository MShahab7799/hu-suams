// ============================================================
//  Hazara University – Main JavaScript
//  Core logic: splash, navigation, reveals, counters, etc.
// ============================================================

(function () {
  'use strict';

  // ── Helpers ─────────────────────────────────────────────────
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ── Splash Screen ────────────────────────────────────────────
  function initSplash() {
    const splash = $('#splash-screen');
    if (!splash) return;
    // Wait for bar animation (2s) + a bit extra
    setTimeout(() => {
      splash.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2400);
    document.body.style.overflow = 'hidden';
  }

  // ── Navbar ───────────────────────────────────────────────────
  function initNavbar() {
    const navbar = $('#navbar');
    if (!navbar) return;

    // Scroll effect
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Active link
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    $$('.nav-link', navbar).forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

    // Mobile hamburger
    const hamburger = $('#nav-hamburger');
    const mobileMenu = $('#nav-mobile');
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', open);
        // Animate bars
        const bars = $$('span', hamburger);
        if (open) {
          bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          bars[1].style.opacity = '0';
          bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
        }
      });
      // Close on outside click
      document.addEventListener('click', e => {
        if (!navbar.contains(e.target)) {
          mobileMenu.classList.remove('open');
          const bars = $$('span', hamburger);
          bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
        }
      });
    }
  }

  // ── Intersection Observer (reveal) ──────────────────────────
  function initReveal() {
    const items = $$('.reveal');
    if (!items.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.delay || 0;
          setTimeout(() => el.classList.add('visible'), delay * 100);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(el => io.observe(el));
  }

  // ── Counter Animation ────────────────────────────────────────
  function animateCounter(el, target, duration = 1800) {
    const suffix = el.dataset.suffix || '';
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(eased * target);
      el.textContent = val.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = $$('[data-counter]');
    if (!counters.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCounter(el, parseInt(el.dataset.counter), 1800);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => io.observe(el));
  }

  // ── Hero Particles ───────────────────────────────────────────
  function initParticles() {
    const container = $('#hero-particles');
    if (!container) return;
    const colors = ['#1B4D3E', '#2E7D5A', '#C5A028', '#4CAF50'];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      const size = Math.random() * 6 + 2;
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: -20px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${Math.random() * 15 + 10}s;
        animation-delay: ${Math.random() * 10}s;
        opacity: ${Math.random() * 0.5 + 0.1};
      `;
      container.appendChild(p);
    }
  }

  // ── Faculty Card Expand ──────────────────────────────────────
  function initFacultyCards() {
    $$('.faculty-card').forEach(card => {
      const header = card.querySelector('.faculty-programs-header');
      if (!header) return;
      header.addEventListener('click', () => {
        const isExpanded = card.classList.contains('expanded');
        // Close all
        $$('.faculty-card.expanded').forEach(c => c.classList.remove('expanded'));
        if (!isExpanded) card.classList.add('expanded');
      });
    });
  }

  // ── Filter Buttons ───────────────────────────────────────────
  function initFilterBtns() {
    $$('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.dataset.group || 'default';
        $$(`[data-group="${group}"].filter-btn`).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        filterItems(filter, btn.closest('.filter-section') || document);
      });
    });
  }

  function filterItems(filter, ctx) {
    $$('[data-filter-item]', ctx).forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // ── Search ───────────────────────────────────────────────────
  function initSearch() {
    $$('.search-input').forEach(input => {
      input.addEventListener('input', debounce(() => {
        const q = input.value.trim().toLowerCase();
        const grid = document.querySelector(input.dataset.target || '.officials-grid');
        if (!grid) return;
        $$('[data-filter-item]', grid).forEach(card => {
          const text = card.textContent.toLowerCase();
          card.style.display = text.includes(q) ? '' : 'none';
        });
      }, 300));
    });
  }

  // ── Modal ────────────────────────────────────────────────────
  function openModal(id) {
    const overlay = $(`#${id}`);
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    const overlay = $(`#${id}`);
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.openModal = openModal;
  window.closeModal = closeModal;

  function initModals() {
    // Close on overlay click
    $$('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal(overlay.id);
      });
    });
    // Close buttons
    $$('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
    });
    // ESC key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        $$('.modal-overlay.open').forEach(o => closeModal(o.id));
      }
    });
  }

  // ── Toast ────────────────────────────────────────────────────
  function showToast(message, type = 'info', duration = 4000) {
    let container = $('#toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const icons = { success: '✅', error: '❌', info: '📌', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-msg">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastIn 0.3s ease reverse both';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
  window.showToast = showToast;

  // ── Utility ──────────────────────────────────────────────────
  function debounce(fn, delay) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
  }

  // ── Auth Tabs ────────────────────────────────────────────────
  function initAuthTabs() {
    const tabs = $$('.auth-tab');
    if (!tabs.length) return;
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        $$('[data-tab-panel]').forEach(panel => {
          panel.classList.toggle('hidden', panel.dataset.tabPanel !== target);
        });
      });
    });
  }

  // ── Time Slots ───────────────────────────────────────────────
  function initTimeSlots() {
    $$('.time-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        const group = slot.closest('.time-slots');
        $$('.time-slot', group).forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
      });
    });
    $$('.date-slot').forEach(slot => {
      if (slot.classList.contains('unavailable')) return;
      slot.addEventListener('click', () => {
        const group = slot.closest('.date-grid');
        $$('.date-slot', group).forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
      });
    });
  }

  // ── Smooth Scroll for anchor links ──────────────────────────
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = $(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // ── Dashboard greeting ───────────────────────────────────────
  function initDashboard() {
    const greeting = $('#dashboard-greeting');
    if (!greeting) return;
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    greeting.textContent = `${greet}, Student 👋`;

    const dateEl = $('#dashboard-date');
    if (dateEl) {
      dateEl.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    }
  }

  // ── Init All ─────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initSplash();
    initNavbar();
    initReveal();
    initCounters();
    initParticles();
    initFacultyCards();
    initFilterBtns();
    initSearch();
    initModals();
    initAuthTabs();
    initTimeSlots();
    initSmoothScroll();
    initDashboard();
  });

})();
