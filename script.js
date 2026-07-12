const welcomeScreen = document.getElementById('welcomeScreen');
const birthdayScreen = document.getElementById('birthdayScreen');
const gift = document.getElementById('openGift');
const startButton = document.getElementById('startButton');
const blowButton = document.getElementById('blowButton');
const celebrateButton = document.getElementById('celebrateButton');
const flame = document.getElementById('flame');
const candle = document.querySelector('.candle');
const instruction = document.getElementById('instruction');
const finalMessage = document.getElementById('finalMessage');
const wishText = document.getElementById('wishText');
const music = document.getElementById('birthdayMusic');
const musicButton = document.getElementById('musicButton');
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');

const birthdayWish = "May this birthday bring you peaceful moments, exciting opportunities and countless reasons to smile. You deserve a truly beautiful year ahead.";
let typed = false;
let candleOut = false;
let particles = [];
let animationFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function showBirthday() {
  gift.classList.add('open');
  setTimeout(() => {
    welcomeScreen.classList.remove('active');
    birthdayScreen.classList.add('active');
    typeWish();
    launchConfetti(160);
  }, 650);
}

gift.addEventListener('click', showBirthday);
startButton.addEventListener('click', showBirthday);

function typeWish() {
  if (typed) return;
  typed = true;
  let index = 0;
  const timer = setInterval(() => {
    wishText.textContent += birthdayWish.charAt(index);
    index += 1;
    if (index >= birthdayWish.length) clearInterval(timer);
  }, 28);
}

function blowOutCandle() {
  if (candleOut) return;
  candleOut = true;
  flame.classList.add('out');
  instruction.textContent = "Your wish is on its way ✨";
  blowButton.textContent = "Wish made ✓";
  blowButton.disabled = true;
  blowButton.style.opacity = '.65';
  finalMessage.classList.remove('hidden');
  launchConfetti(280);
}

blowButton.addEventListener('click', blowOutCandle);
candle.addEventListener('click', blowOutCandle);
celebrateButton.addEventListener('click', () => launchConfetti(360));

musicButton.addEventListener('click', async () => {
  try {
    if (music.paused) {
      await music.play();
      musicButton.classList.add('playing');
      musicButton.textContent = '♫';
    } else {
      music.pause();
      musicButton.classList.remove('playing');
      musicButton.textContent = '♪';
    }
  } catch (error) {
    musicButton.title = 'Your browser blocked audio. Tap again to play.';
  }
});

function launchConfetti(amount = 220) {
  const colors = ['#ff6fae', '#ffd166', '#7d5cff', '#63d8c8', '#ffffff', '#ff956a'];
  for (let i = 0; i < amount; i += 1) {
    particles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 160,
      y: window.innerHeight * 0.42,
      vx: (Math.random() - 0.5) * 15,
      vy: Math.random() * -14 - 4,
      gravity: 0.2 + Math.random() * 0.12,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      size: 5 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 150 + Math.random() * 70
    });
  }
  if (!animationFrame) animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter(p => p.life > 0 && p.y < window.innerHeight + 40);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.992;
    p.rotation += p.rotationSpeed;
    p.life -= 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = Math.min(1, p.life / 45);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
    ctx.restore();
  });

  if (particles.length) {
    animationFrame = requestAnimationFrame(animateConfetti);
  } else {
    animationFrame = null;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}
