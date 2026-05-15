/* ============================================
   SASI ❤️ SRI THANUJA — PROPOSAL WEBSITE
   script.js
   ============================================ */

/* ===== AUDIO SETUP =====
   REPLACE: swap these URLs with actual romantic music files.
   You can host .mp3 files alongside index.html or use a CDN link.
   openingAudio  → soft background music for opening/proposal screens
   yesAudio      → cheerful romantic music on YES
   ==================== */
let openingAudio = null;
let yesAudio = null;
let isMuted = false;

function initAudio() {
  try {
    // REPLACE src values with your actual audio file paths
    openingAudio = new Audio('opening.mp3');
    openingAudio.loop = true;
    openingAudio.volume = 0.4;

    yesAudio = new Audio('yes.mp3');
    yesAudio.loop = true;
    yesAudio.volume = 0.6;
  } catch (e) {
    console.log('Audio not available:', e);
  }
}

function playOpening() {
  if (openingAudio && !isMuted) {
    openingAudio.play().catch(() => {});
  }
}

function switchToYesMusic() {
  if (openingAudio) { openingAudio.pause(); openingAudio.currentTime = 0; }
  if (yesAudio && !isMuted) { yesAudio.play().catch(() => {}); }
}

function toggleMute() {
  isMuted = !isMuted;
  document.getElementById('muteBtn').textContent = isMuted ? '🔇' : '🔊';
  if (openingAudio) openingAudio.muted = isMuted;
  if (yesAudio) yesAudio.muted = isMuted;
}

/* ===== CUSTOM HEART CURSOR ===== */
const cursor = document.createElement('div');
cursor.id = 'customCursor';
cursor.textContent = '💗';
document.body.appendChild(cursor);

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

/* ===== HEART TRAIL (CANVAS) ===== */
const trailCanvas = document.getElementById('trailCanvas');
const tCtx = trailCanvas.getContext('2d');
const trails = [];

function resizeTrail() {
  trailCanvas.width  = window.innerWidth;
  trailCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeTrail);
resizeTrail();

document.addEventListener('mousemove', e => {
  trails.push({ x: e.clientX, y: e.clientY, life: 1, emoji: ['💗','💕','✨'][Math.floor(Math.random()*3)] });
});

// Touch trail for mobile
document.addEventListener('touchmove', e => {
  const t = e.touches[0];
  trails.push({ x: t.clientX, y: t.clientY, life: 1, emoji: '💗' });
});

function animateTrail() {
  tCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  for (let i = trails.length - 1; i >= 0; i--) {
    const p = trails[i];
    tCtx.globalAlpha = p.life;
    tCtx.font = `${14 + (1 - p.life) * 10}px serif`;
    tCtx.fillText(p.emoji, p.x - 8, p.y + 8);
    p.life -= 0.04;
    if (p.life <= 0) trails.splice(i, 1);
  }
  tCtx.globalAlpha = 1;
  requestAnimationFrame(animateTrail);
}
animateTrail();

/* ===== FLOATING HEARTS BACKGROUND ===== */
const heartContainer = document.getElementById('floatingHearts');
const heartEmojis = ['❤️','💕','💖','💗','💓','💞','🩷'];

function spawnFloatingHeart() {
  const el = document.createElement('div');
  el.className = 'fheart';
  el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  el.style.left  = Math.random() * 100 + 'vw';
  el.style.animationDuration = (6 + Math.random() * 8) + 's';
  el.style.animationDelay   = (Math.random() * 3) + 's';
  el.style.fontSize = (1 + Math.random() * 1.4) + 'rem';
  heartContainer.appendChild(el);
  setTimeout(() => el.remove(), 16000);
}
setInterval(spawnFloatingHeart, 700);

/* ===== SPARKLES ===== */
const sparkleContainer = document.getElementById('sparkles');
function spawnSparkle() {
  const el = document.createElement('div');
  el.className = 'sparkle';
  el.style.left = Math.random() * 100 + 'vw';
  el.style.top  = Math.random() * 100 + 'vh';
  el.style.animationDuration = (1.5 + Math.random() * 2) + 's';
  el.style.animationDelay   = (Math.random() * 2) + 's';
  el.style.background = ['#f9a825','#f06292','#fff176','#ff6eb4'][Math.floor(Math.random()*4)];
  sparkleContainer.appendChild(el);
  setTimeout(() => el.remove(), 5000);
}
setInterval(spawnSparkle, 300);

/* ===== TYPING ANIMATION ===== */
const typingEl  = document.getElementById('typingText');
const subEl     = document.getElementById('subtitleText');
const openBtn   = document.getElementById('openHeartBtn');

const line1 = 'Hey Sri Thanuja ❤️';
const line2 = 'I made something special just for you 🥺💖';

let charIdx = 0;

function typeChar() {
  if (charIdx < line1.length) {
    typingEl.textContent += line1[charIdx++];
    setTimeout(typeChar, 75);
  } else {
    setTimeout(() => {
      subEl.textContent = line2;
      subEl.classList.add('show');
      setTimeout(() => {
        openBtn.classList.remove('hidden');
        openBtn.classList.add('visible');
      }, 900);
    }, 400);
  }
}

/* ===== SCREEN TRANSITIONS ===== */
function showScreen(id) {
  document.querySelectorAll('.screen.active').forEach(s => {
    s.classList.add('exit');
    setTimeout(() => { s.classList.remove('active', 'exit'); }, 800);
  });
  setTimeout(() => {
    const next = document.getElementById(id);
    next.classList.add('active');
  }, 400);
}

function goToProposal() {
  showScreen('proposalScreen');
}

function goToMemories() {
  showScreen('memoriesScreen');
  initSlideshow();
}

function goToFinal() {
  showScreen('finalScreen');
  launchFinalHearts();
}

/* ===== PROPOSAL LOGIC ===== */
let noCount = 0;
let yesScale = 1;
let noScale  = 1;
let noOpacity = 1;
let noMoving = false;

const noMessages = [
  "I'll always listen to you 🥺",
  "Please believe me once ❤️",
  "You mean so much to me 💖",
  "Don't break this cute little heart 😭",
  "I promise to make you smile every day ✨",
  "At least think once more 🥺💞",
  "My heart only beats for you 💓",
  "Just one yes… that's all I ask 🙏💕",
  "I'll wait forever if I have to 🌸",
  "You make my world beautiful 🌺",
];

function handleNo() {
  noCount++;
  const yesBtn = document.getElementById('yesBtn');
  const noBtn  = document.getElementById('noBtn');
  const msg    = document.getElementById('proposalMsg');

  // YES grows
  yesScale = Math.min(1 + noCount * 0.18, 2.4);
  yesBtn.style.transform = `scale(${yesScale})`;
  yesBtn.style.fontSize  = (1.3 + noCount * 0.12) + 'rem';
  yesBtn.style.boxShadow = `0 0 ${20 + noCount * 8}px var(--glow-pink)`;

  // NO shrinks
  noScale  = Math.max(1 - noCount * 0.12, 0.25);
  noOpacity = Math.max(1 - noCount * 0.1, 0.15);
  noBtn.style.transform = `scale(${noScale})`;
  noBtn.style.opacity   = String(noOpacity);

  // Update message
  const msgIdx = Math.min(noCount - 1, noMessages.length - 1);
  msg.textContent = noMessages[msgIdx];

  // After 5 clicks NO starts running away
  if (noCount >= 5 && !noMoving) {
    noMoving = true;
    makeNoRunAway();
  }

  // After 9 clicks NO disappears
  if (noCount >= 9) {
    noBtn.style.display = 'none';
  }

  // Tiny shake on proposal card
  const card = document.querySelector('.proposal-card');
  card.style.animation = 'none';
  card.offsetHeight; // reflow
  card.style.animation = '';
}

function makeNoRunAway() {
  const noBtn = document.getElementById('noBtn');
  const container = document.getElementById('btnContainer');
  container.style.position = 'relative';
  noBtn.style.position = 'absolute';

  noBtn.addEventListener('mouseover', moveNoBtn);
  noBtn.addEventListener('touchstart', moveNoBtn);
}

function moveNoBtn() {
  const noBtn = document.getElementById('noBtn');
  const container = document.getElementById('btnContainer');
  const cRect = container.getBoundingClientRect();
  const maxX = cRect.width  - noBtn.offsetWidth  - 10;
  const maxY = 80;
  const rx = Math.floor(Math.random() * maxX);
  const ry = Math.floor(Math.random() * maxY) - 10;
  noBtn.style.left = rx + 'px';
  noBtn.style.top  = ry + 'px';
}

function handleYes() {
  // Vibrate on mobile
  if ('vibrate' in navigator) navigator.vibrate([100, 50, 100, 50, 200]);

  // Confetti!
  launchConfetti();
  switchToYesMusic();

  // Transition to memories after confetti
  setTimeout(() => { goToMemories(); }, 2200);
}

/* ===== CONFETTI ===== */
const confCanvas = document.getElementById('confettiCanvas');
const cCtx = confCanvas.getContext('2d');
let confettiPieces = [];

function launchConfetti() {
  confCanvas.width  = window.innerWidth;
  confCanvas.height = window.innerHeight;
  confCanvas.classList.add('active');

  const colors = ['#e91e8c','#f06292','#f9a825','#ff6eb4','#fff176','#ce93d8','#ff8a65'];
  for (let i = 0; i < 180; i++) {
    confettiPieces.push({
      x: Math.random() * confCanvas.width,
      y: -20,
      w: 6 + Math.random() * 10,
      h: 4 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 6,
      vy: 3 + Math.random() * 5,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 8,
      emoji: Math.random() > 0.65 ? ['💖','💕','✨','🎉'][Math.floor(Math.random()*4)] : null
    });
  }
  animateConfetti();
}

function animateConfetti() {
  if (!confettiPieces.length) {
    confCanvas.classList.remove('active');
    return;
  }
  cCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
  confettiPieces.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.rotV;
    p.vy += 0.12;

    cCtx.save();
    cCtx.translate(p.x, p.y);
    cCtx.rotate((p.rot * Math.PI) / 180);
    if (p.emoji) {
      cCtx.font = '18px serif';
      cCtx.fillText(p.emoji, -9, 9);
    } else {
      cCtx.fillStyle = p.color;
      cCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }
    cCtx.restore();

    if (p.y > confCanvas.height + 40) confettiPieces.splice(i, 1);
  });
  if (confettiPieces.length) requestAnimationFrame(animateConfetti);
  else confCanvas.classList.remove('active');
}

/* ===== SLIDESHOW ===== */
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dotsEl = document.getElementById('slideDots');
let slideshowTimer = null;

function initSlideshow() {
  dotsEl.innerHTML = '';
  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goToSlide(i);
    dotsEl.appendChild(d);
  });
  currentSlide = 0;
  goToSlide(0);
  slideshowTimer = setInterval(() => changeSlide(1), 4000);
}

function changeSlide(dir) {
  goToSlide((currentSlide + dir + slides.length) % slides.length);
}

function goToSlide(idx) {
  slides[currentSlide].classList.remove('active-slide');
  document.querySelectorAll('.dot')[currentSlide]?.classList.remove('active');
  currentSlide = idx;
  slides[currentSlide].classList.add('active-slide');
  document.querySelectorAll('.dot')[currentSlide]?.classList.add('active');
  if (slideshowTimer) { clearInterval(slideshowTimer); slideshowTimer = setInterval(() => changeSlide(1), 4000); }
}

/* ===== FINAL HEARTS BURST ===== */
function launchFinalHearts() {
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'fheart';
      el.textContent = ['❤️','💖','💕','💗'][Math.floor(Math.random()*4)];
      el.style.left = (20 + Math.random() * 60) + 'vw';
      el.style.animationDuration = (3 + Math.random() * 4) + 's';
      el.style.fontSize = (1.5 + Math.random() * 2) + 'rem';
      heartContainer.appendChild(el);
      setTimeout(() => el.remove(), 8000);
    }, i * 120);
  }
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initAudio();

  // Start typing after slight delay
  setTimeout(() => {
    playOpening();
    typeChar();
  }, 600);
});

// Also try to start audio on first touch (mobile autoplay policy)
document.addEventListener('touchstart', () => {
  if (openingAudio && !isMuted) openingAudio.play().catch(() => {});
}, { once: true });