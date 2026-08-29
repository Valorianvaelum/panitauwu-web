(() => {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const loader = document.querySelector('#loader');
  const home = document.querySelector('#home');
  const heartPetals = document.querySelector('#heartPetals');
  const loveHeart = document.querySelector('#loveHeart');
  const loveRain = document.querySelector('#loveRain');

  const LOVE_WORDS = ['te quiero', 'te amo'];
  const MAX_PARTICLES = 28;
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
    return { x: x * 1.1, y: y * 1.1 };
  }

  function sampleHeartByArcLength(count) {
    const resolution = 720;
    const dense = [];
    let totalLength = 0;

    for (let index = 0; index <= resolution; index += 1) {
      const t = (index / resolution) * Math.PI * 2;
      const point = pointOnHeart(t);
      const previous = dense.at(-1);

      if (previous) {
        totalLength += Math.hypot(point.x - previous.x, point.y - previous.y);
      }

      dense.push({ ...point, length: totalLength });
    }

    const samples = [];
    let cursor = 0;

    for (let index = 0; index < count; index += 1) {
      const target = (index / count) * totalLength;
      while (cursor < dense.length - 1 && dense[cursor].length < target) cursor += 1;
      samples.push(dense[cursor]);
    }

    return samples;
  }

  function buildPetalHeart() {
    if (!heartPetals) return;

    const count = window.innerWidth < 520 ? 18 : 22;
    const points = sampleHeartByArcLength(count);
    const fragment = document.createDocumentFragment();

    points.forEach((current, index) => {
      const previous = points[(index - 1 + points.length) % points.length];
      const next = points[(index + 1) % points.length];
      const tangent = Math.atan2(next.y - previous.y, next.x - previous.x) * (180 / Math.PI);
      const variation = Math.sin(index * 2.17) * 11;
      const scale = 0.62 + ((Math.sin(index * 1.71) + 1) / 2) * 0.25;
      const xScale = index % 4 === 0 ? -scale : scale;

      const petal = document.createElementNS(SVG_NS, 'use');
      petal.setAttribute('href', '#petalShape');
      petal.setAttribute(
        'transform',
        `translate(${current.x.toFixed(2)} ${current.y.toFixed(2)}) rotate(${(tangent + 90 + variation).toFixed(2)}) scale(${xScale.toFixed(3)} ${scale.toFixed(3)})`,
      );
      petal.style.opacity = String(0.78 + ((Math.cos(index * 1.4) + 1) / 2) * 0.18);
      fragment.appendChild(petal);
    });

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
    const size = 12 + Math.random() * (burst ? 8 : 6);
    const xJitter = (Math.random() - 0.5) * 38;
    const yJitter = (Math.random() - 0.5) * 20;

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

    const drift = (Math.random() - 0.5) * (burst ? 360 : 300);
    const rise = 90 + Math.random() * 110;
    const fall = window.innerHeight - origin.y + 120;
    const rotate = (Math.random() - 0.5) * 26;
    const duration = (burst ? 4200 : 5200) + Math.random() * 1600;

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
    const interval = reducedMotion.matches ? 2600 : 980;

    rainTimer = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      spawnLoveWord();
      if (!reducedMotion.matches && Math.random() > 0.72) {
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

    const count = reducedMotion.matches ? 4 : 14;
    for (let index = 0; index < count; index += 1) {
      window.setTimeout(() => spawnLoveWord({ burst: true }), index * (reducedMotion.matches ? 120 : 72));
    }
  }

  function revealHome() {
    const delay = reducedMotion.matches ? 450 : 2550;

    window.setTimeout(() => {
      loader?.classList.add('is-leaving');
      home?.classList.add('is-ready');
      startAmbientRain();

      if (!reducedMotion.matches) {
        for (let index = 0; index < 5; index += 1) {
          window.setTimeout(() => spawnLoveWord(), 600 + index * 260);
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
