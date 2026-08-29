(() => {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const loader = document.querySelector('#loader');
  const home = document.querySelector('#home');
  const heartPetals = document.querySelector('#heartPetals');
  const loveHeart = document.querySelector('#loveHeart');
  const loveRain = document.querySelector('#loveRain');

  const LOVE_WORDS = ['te quiero', 'te amo'];
  const MAX_PARTICLES = 38;
  let rainTimer = null;
  let burstTimer = null;

  function pointOnHeart(t) {
    const sin = Math.sin(t);
    const x = 11.4 * 13 * sin * sin * sin;
    const y = -11.2 * (
      10.4 * Math.cos(t)
      - 4.25 * Math.cos(2 * t)
      - 2.15 * Math.cos(3 * t)
      - 0.95 * Math.cos(4 * t)
    );
    return { x, y };
  }

  function buildPetalHeart() {
    if (!heartPetals) return;

    const count = window.innerWidth < 520 ? 30 : 36;
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < count; index += 1) {
      const t = (index / count) * Math.PI * 2;
      const current = pointOnHeart(t);
      const next = pointOnHeart(t + 0.02);
      const tangent = Math.atan2(next.y - current.y, next.x - current.x) * (180 / Math.PI);
      const variation = Math.sin(index * 2.17) * 8;
      const scale = 0.73 + ((Math.sin(index * 1.71) + 1) / 2) * 0.28;

      const petal = document.createElementNS(SVG_NS, 'use');
      petal.setAttribute('href', '#petalShape');
      petal.setAttribute(
        'transform',
        `translate(${current.x.toFixed(2)} ${current.y.toFixed(2)}) rotate(${(tangent + 90 + variation).toFixed(2)}) scale(${scale.toFixed(3)})`,
      );
      petal.style.opacity = String(0.82 + ((Math.cos(index * 1.4) + 1) / 2) * 0.18);
      fragment.appendChild(petal);
    }

    heartPetals.replaceChildren(fragment);
  }

  function centerOfFlower() {
    const rect = loveHeart.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2 + rect.height * 0.035,
    };
  }

  function removeOldestParticleIfNeeded() {
    while (loveRain.childElementCount >= MAX_PARTICLES) {
      loveRain.firstElementChild?.remove();
    }
  }

  function spawnLoveWord({ burst = false } = {}) {
    if (!loveHeart || !loveRain) return;
    removeOldestParticleIfNeeded();

    const origin = centerOfFlower();
    const word = document.createElement('span');
    const choice = LOVE_WORDS[Math.floor(Math.random() * LOVE_WORDS.length)];
    const size = 13 + Math.random() * (burst ? 11 : 8);
    const xJitter = (Math.random() - 0.5) * 54;
    const yJitter = (Math.random() - 0.5) * 30;

    word.className = 'love-word';
    word.textContent = choice;
    word.style.setProperty('--size', `${size.toFixed(1)}px`);
    word.style.left = `${origin.x + xJitter}px`;
    word.style.top = `${origin.y + yJitter}px`;
    loveRain.appendChild(word);

    if (reducedMotion.matches) {
      const animation = word.animate(
        [
          { opacity: 0, transform: 'translate(-50%, -50%) scale(.92)' },
          { opacity: 0.95, offset: 0.3, transform: 'translate(-50%, -62%) scale(1)' },
          { opacity: 0, transform: 'translate(-50%, -82%) scale(1.02)' },
        ],
        { duration: 1500, easing: 'ease-out' },
      );
      animation.onfinish = () => word.remove();
      return;
    }

    const drift = (Math.random() - 0.5) * (burst ? 290 : 230);
    const rise = 58 + Math.random() * 105;
    const fall = window.innerHeight - origin.y + 120;
    const rotate = (Math.random() - 0.5) * 26;
    const duration = (burst ? 3800 : 4700) + Math.random() * 1800;

    const animation = word.animate(
      [
        {
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(.66) rotate(0deg)',
        },
        {
          opacity: 0.96,
          offset: 0.13,
          transform: `translate(calc(-50% + ${drift * 0.1}px), calc(-50% - ${rise * 0.55}px)) scale(1) rotate(${rotate * 0.25}deg)`,
        },
        {
          opacity: 0.9,
          offset: 0.28,
          transform: `translate(calc(-50% + ${drift * 0.26}px), calc(-50% - ${rise}px)) scale(1.02) rotate(${rotate * 0.5}deg)`,
        },
        {
          opacity: 0,
          transform: `translate(calc(-50% + ${drift}px), calc(-50% + ${fall}px)) scale(.92) rotate(${rotate}deg)`,
        },
      ],
      {
        duration,
        easing: 'cubic-bezier(.21,.62,.25,1)',
      },
    );

    animation.onfinish = () => word.remove();
  }

  function startAmbientRain() {
    if (rainTimer) window.clearInterval(rainTimer);
    const interval = reducedMotion.matches ? 2400 : 720;

    rainTimer = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      spawnLoveWord();
      if (!reducedMotion.matches && Math.random() > 0.55) {
        window.setTimeout(() => spawnLoveWord(), 160 + Math.random() * 180);
      }
    }, interval);
  }

  function burstLove() {
    if (!loveHeart) return;

    loveHeart.classList.remove('is-bursting');
    window.requestAnimationFrame(() => loveHeart.classList.add('is-bursting'));
    window.clearTimeout(burstTimer);
    burstTimer = window.setTimeout(() => loveHeart.classList.remove('is-bursting'), 720);

    const count = reducedMotion.matches ? 5 : 22;
    for (let index = 0; index < count; index += 1) {
      window.setTimeout(() => spawnLoveWord({ burst: true }), index * (reducedMotion.matches ? 100 : 52));
    }
  }

  function revealHome() {
    const delay = reducedMotion.matches ? 450 : 2550;

    window.setTimeout(() => {
      loader?.classList.add('is-leaving');
      home?.classList.add('is-ready');
      startAmbientRain();

      if (!reducedMotion.matches) {
        for (let index = 0; index < 8; index += 1) {
          window.setTimeout(() => spawnLoveWord(), 500 + index * 190);
        }
      }
    }, delay);
  }

  buildPetalHeart();
  revealHome();

  loveHeart?.addEventListener('click', burstLove);
  reducedMotion.addEventListener?.('change', startAmbientRain);

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(buildPetalHeart, 180);
  });
})();
