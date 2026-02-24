// Year
document.getElementById("y").textContent = new Date().getFullYear();

// Put current site URL into copybox
const siteUrlEl = document.getElementById("siteUrl");
if (siteUrlEl) siteUrlEl.textContent = window.location.href;

// Smooth scroll + active nav
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const sections = navLinks.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);

navLinks.forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", id);
  });
});

function setActive() {
  const y = window.scrollY + 130;
  let activeIndex = 0;
  sections.forEach((sec, i) => { if (sec.offsetTop <= y) activeIndex = i; });
  navLinks.forEach((a, i) => a.classList.toggle("active", i === activeIndex));
}
window.addEventListener("scroll", setActive, { passive: true });
window.addEventListener("load", setActive);

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal-item");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("reveal");
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Typewriter
const tw = document.querySelector(".typewriter");
if (tw) {
  const text = tw.dataset.text || tw.textContent || "";
  tw.textContent = "";
  let i = 0;
  const tick = () => {
    tw.textContent = text.slice(0, i++);
    if (i <= text.length) requestAnimationFrame(tick);
  };
  setTimeout(() => requestAnimationFrame(tick), 250);
}

// Toast
const toastEl = document.getElementById("toast");
let toastTimer = null;
function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1400);
}

// Copy box
const copyBox = document.getElementById("copyBox");
if (copyBox) {
  copyBox.addEventListener("click", async () => {
    const text = copyBox.innerText.trim();
    try {
      await navigator.clipboard.writeText(text);
      toast("Скопировано ✅");
    } catch {
      toast("Не удалось скопировать 😕");
    }
  });
}

// Copy page link button
const copyLinkBtn = document.getElementById("copyLinkBtn");
if (copyLinkBtn) {
  copyLinkBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Ссылка скопирована 🔗");
    } catch {
      toast("Не удалось скопировать 😕");
    }
  });
}

// Like button
let likes = 0;
const likeBtn = document.getElementById("likeBtn");
if (likeBtn) {
  likeBtn.addEventListener("click", () => {
    likes++;
    likeBtn.textContent = `❤ Лайк (${likes})`;
    toast("Огонь 😘");
  });
}

// Theme toggle
const themeBtn = document.getElementById("themeBtn");
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") document.body.classList.add("light");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
    toast(document.body.classList.contains("light") ? "Светлая тема ☀️" : "Тёмная тема 🌙");
  });
}

// Tilt effect for project cards (desktop)
const projCards = document.querySelectorAll(".proj");
projCards.forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-2px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// Hearts on click
const heartsLayer = document.querySelector(".hearts");
function spawnHeart(x, y) {
  if (!heartsLayer) return;
  const h = document.createElement("div");
  h.className = "heart";
  h.style.left = `${x - 7}px`;
  h.style.top = `${y - 7}px`;
  heartsLayer.appendChild(h);
  setTimeout(() => h.remove(), 2200);
}

document.addEventListener("click", (e) => {
  // не спавним, если клик по кнопке/ссылке
  const t = e.target;
  if (t.closest("a") || t.closest("button") || t.closest("input")) return;
  spawnHeart(e.clientX, e.clientY);
});

// Simple particles on canvas
const canvas = document.getElementById("fx");
const ctx = canvas ? canvas.getContext("2d") : null;

function resize() {
  if (!canvas) return;
  canvas.width = Math.floor(window.innerWidth * devicePixelRatio);
  canvas.height = Math.floor(window.innerHeight * devicePixelRatio);
}
window.addEventListener("resize", resize);
resize();

const particles = [];
const P = 60;

function rnd(min, max) { return Math.random() * (max - min) + min; }

function initParticles() {
  particles.length = 0;
  for (let i = 0; i < P; i++) {
    particles.push({
      x: rnd(0, canvas.width),
      y: rnd(0, canvas.height),
      vx: rnd(-0.25, 0.25),
      vy: rnd(-0.2, 0.2),
      r: rnd(0.8, 2.2),
      a: rnd(0.15, 0.6),
    });
  }
}
if (canvas) initParticles();

function step() {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw particles
  for (const p of particles) {
    p.x += p.vx * devicePixelRatio;
    p.y += p.vy * devicePixelRatio;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.globalAlpha = p.a;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  // lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 120 * devicePixelRatio) {
        ctx.globalAlpha = 0.07;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(step);
}
requestAnimationFrame(step);