// ===== iLynx — interactions =====
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

// header scroll state
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// mobile menu
const menuBtn = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
}

// dark mode toggle
const themeBtn = document.querySelector('[data-theme-toggle]');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
  });
}

// scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

// hero letter-by-letter animation
document.querySelectorAll('[data-letters]').forEach((el) => {
  const text = el.textContent;
  el.textContent = '';
  el.setAttribute('aria-label', text);
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.style.animationDelay = reduceMotion ? '0s' : `${i * 0.02}s`;
    el.appendChild(span);
  });
});

// binary rain canvas
const canvas = document.getElementById('binary-canvas');
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext('2d');
  let w, h, cols, drops;
  const fontSize = 14;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    cols = Math.floor(w / fontSize);
    drops = new Array(cols).fill(0).map(() => Math.random() * -50);
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-cyan') || '#06B6D4';
    ctx.font = `${fontSize}px monospace`;
    drops.forEach((y, i) => {
      const char = Math.random() > 0.5 ? '1' : '0';
      ctx.fillText(char, i * fontSize, y * fontSize);
      if (y * fontSize > h && Math.random() > 0.975) drops[i] = 0;
      else drops[i] += 0.6;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// card 3D tilt + spotlight (desktop only)
if (!isTouch && !reduceMotion) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const rx = ((y / r.height) - 0.5) * -8;
      const ry = ((x / r.width) - 0.5) * 8;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      card.style.setProperty('--spot-x', `${x}px`);
      card.style.setProperty('--spot-y', `${y}px`);
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// process timeline fill on scroll
const timeline = document.querySelector('[data-timeline]');
if (timeline) {
  const fill = timeline.querySelector('.timeline-fill');
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) fill.style.width = '100%';
    });
  }, { threshold: 0.4 });
  io2.observe(timeline);
}

// footer year
document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
