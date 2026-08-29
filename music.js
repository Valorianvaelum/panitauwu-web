(() => {
  const loveHeart = document.querySelector('#loveHeart');
  const musicCard = document.querySelector('#musicCard');
  const musicFrame = document.querySelector('#musicFrame');
  const musicClose = document.querySelector('#musicClose');
  const musicStatus = document.querySelector('#musicStatus');

  const VIDEO_ID = '_QU8XigLsO8';
  const START_SECONDS = 80;
  const END_SECONDS = 120;
  const FRAGMENT_DURATION_MS = (END_SECONDS - START_SECONDS + 5) * 1000;

  let musicStarted = false;
  let replayTimer = null;
  let hideTimer = null;

  function buildPlayerUrl() {
    const params = new URLSearchParams({
      autoplay: '1',
      start: String(START_SECONDS),
      end: String(END_SECONDS),
      playsinline: '1',
      controls: '1',
      rel: '0',
    });

    return `https://www.youtube.com/embed/${VIDEO_ID}?${params.toString()}`;
  }

  function revealMusicCard() {
    if (!musicCard) return;

    window.clearTimeout(hideTimer);
    musicCard.hidden = false;
    window.requestAnimationFrame(() => musicCard.classList.add('is-visible'));
  }

  function startMusic() {
    if (!musicFrame || musicStarted) return;

    musicStarted = true;
    window.clearTimeout(replayTimer);

    const iframe = document.createElement('iframe');
    iframe.src = buildPlayerUrl();
    iframe.title = 'Te Extraño, Te Olvido, Te Amo — fragmento de 1:20 a 2:00';
    iframe.width = '212';
    iframe.height = '200';
    iframe.loading = 'eager';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
    iframe.setAttribute('allowfullscreen', '');

    musicFrame.replaceChildren(iframe);
    if (musicStatus) musicStatus.textContent = '1:20–2:00 · si no arranca, tocá ▶';
    revealMusicCard();

    replayTimer = window.setTimeout(() => {
      musicStarted = false;
      if (musicStatus) musicStatus.textContent = 'terminó · tocá la rosa para repetir';
    }, FRAGMENT_DURATION_MS);
  }

  function stopMusic() {
    if (!musicCard || !musicFrame) return;

    musicStarted = false;
    window.clearTimeout(replayTimer);
    window.clearTimeout(hideTimer);
    musicCard.classList.remove('is-visible');

    hideTimer = window.setTimeout(() => {
      musicFrame.replaceChildren();
      musicCard.hidden = true;
      if (musicStatus) musicStatus.textContent = '1:20–2:00';
    }, 260);
  }

  loveHeart?.addEventListener('click', startMusic);
  musicClose?.addEventListener('click', stopMusic);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && musicCard && !musicCard.hidden) stopMusic();
  });
})();
