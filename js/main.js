const songs = {
  A: [
    ['Black Sabbath', '01-black-sabbath.mp3', '06:20', '01-black-sabbath.txt'],
    ['The Wizard', '02-the-wizard.mp3', '04:24', '02-the-wizard.txt'],
    [
      'Behind the Wall of Sleep',
      '03-behind-the-wall-of-sleep.mp3',
      '03:37',
      '03-behind-the-wall-of-sleep.txt',
    ],
    ['N.I.B.', '04-nib.mp3', '06:06', '04-nib.txt'],
  ],
  B: [
    ['Evil Woman', '05-evil-woman.mp3', '03:25', '05-evil-woman.txt'],
    [
      'Sleeping Village',
      '06-sleeping-village.mp3',
      '03:46',
      '06-sleeping-village.txt',
    ],
    ['Warning', '07-warning.mp3', '10:32', '07-warning.txt'],
  ],
};
const s = { side: 'A', index: 0, shuffle: false },
  $ = (id) => document.getElementById(id),
  a = $('audio'),
  item = () => songs[s.side][s.index],
  src = () => 'assets/audio/side-' + s.side.toLowerCase() + '/' + item()[1],
  fmt = (n) =>
    Number.isFinite(n)
      ? String(Math.floor(n / 60)).padStart(2, '0') +
        ':' +
        String(Math.floor(n % 60)).padStart(2, '0')
      : '00:00';
function render() {
  const t = item(),
    wanted = new URL(src(), location.href).pathname,
    loaded = new URL(a.currentSrc || a.src, location.href).pathname;
  $('title').textContent = t[0];
  $('lyric-title').textContent = t[0];
  $('meta').textContent =
    'SIDE ' + s.side + ' · TRACK ' + String(s.index + 1).padStart(2, '0');
  $('side-a').classList.toggle('active', s.side === 'A');
  $('side-b').classList.toggle('active', s.side === 'B');
  $('side-a').setAttribute('aria-pressed', s.side === 'A');
  $('side-b').setAttribute('aria-pressed', s.side === 'B');
  $('list').innerHTML = songs[s.side]
    .map(
      (x, i) =>
        '<button class="track ' +
        (i === s.index ? 'active' : '') +
        '" role="listitem" data-i="' +
        i +
        '" aria-current="' +
        (i === s.index) +
        '"><span class="track-num">' +
        String(i + 1).padStart(2, '0') +
        '</span><span class="track-name">' +
        x[0] +
        '</span><span class="track-time">' +
        x[2] +
        '</span></button>'
    )
    .join('');
  document
    .querySelectorAll('.track')
    .forEach((b) => (b.onclick = () => select(+b.dataset.i)));
  if (loaded !== wanted) {
    a.src = src();
    a.load();
  }
  $('duration').textContent = fmt(a.duration);
  $('elapsed').textContent = fmt(a.currentTime);
  $('seek').value = a.duration
    ? Math.round((a.currentTime / a.duration) * 1000)
    : 0;
  updateState();
  const lyricFile = t[3];
  fetch('assets/lyrics/' + lyricFile)
    .then((r) => {
      if (!r.ok) throw new Error('not found');
      return r.text();
    })
    .then((text) => {
      if (item()[3] === lyricFile)
        $('lyrics').textContent = text.trim() || 'Archivo de letras vacío.';
    })
    .catch(() => {
      if (item()[3] !== lyricFile) return;
      $('lyrics').textContent =
        location.protocol === 'file:'
          ? 'Abre VINYLIA desde un servidor local (XAMPP o Live Server); el navegador bloquea la lectura de letras al abrir index.html directamente.'
          : 'No se encontró ' + lyricFile + ' en assets/lyrics/.';
    });
  $('notice').textContent =
    'Archivo: ' + src() + ' · ' + (a.error ? 'no encontrado' : 'listo');
}
function updateState() {
  $('play').textContent = a.paused ? '▶' : 'Ⅱ';
  $('play').setAttribute('aria-label', a.paused ? 'Reproducir' : 'Pausar');
  $('record').classList.toggle('spin', !a.paused);
  $('arm').classList.toggle('playing', !a.paused);
  $('dot').classList.toggle('live', !a.paused);
  $('status').textContent = a.paused ? 'READY TO PLAY' : 'NOW PLAYING';
}
function select(i) {
  a.pause();
  s.index = i;
  a.currentTime = 0;
  render();
}
function side(x) {
  a.pause();
  s.side = x;
  s.index = 0;
  render();
}
function step(d) {
  let n = s.index + d;
  if (s.shuffle && d > 0) n = Math.floor(Math.random() * songs[s.side].length);
  if (n < 0) n = songs[s.side].length - 1;
  if (n >= songs[s.side].length) n = 0;
  select(n);
  a.play().catch(() => {});
}
$('play').onclick = () =>
  a.paused
    ? a.play().catch(() => {
        $('notice').textContent = 'No se encontró el archivo: ' + src();
      })
    : a.pause();
$('prev').onclick = () => (a.currentTime > 3 ? (a.currentTime = 0) : step(-1));
$('next').onclick = () => step(1);
$('side-a').onclick = () => side('A');
$('side-b').onclick = () => side('B');
$('shuffle').onclick = (e) => {
  s.shuffle = !s.shuffle;
  e.currentTarget.setAttribute('aria-pressed', s.shuffle);
};
$('repeat').onclick = (e) => {
  a.loop = !a.loop;
  e.currentTarget.setAttribute('aria-pressed', a.loop);
};
$('fav').onclick = (e) => {
  const b = e.currentTarget,
    on = b.getAttribute('aria-pressed') !== 'true';
  b.textContent = on ? '♥' : '♡';
  b.setAttribute('aria-pressed', on);
  try {
    let f = JSON.parse(localStorage.getItem('vinylia-favorites') || '[]'),
      k = s.side + s.index;
    localStorage.setItem(
      'vinylia-favorites',
      JSON.stringify(on ? [...new Set([...f, k])] : f.filter((x) => x !== k))
    );
  } catch {}
};
$('volume').oninput = (e) => {
  a.volume = e.target.value / 100;
  $('volvalue').textContent = e.target.value + '%';
};
$('seek').oninput = (e) => {
  if (a.duration) a.currentTime = (e.target.value / 1000) * a.duration;
};
a.volume = 0.72;
a.addEventListener('play', updateState);
a.addEventListener('pause', updateState);
a.addEventListener('timeupdate', () => {
  $('elapsed').textContent = fmt(a.currentTime);
  if (a.duration)
    $('seek').value = Math.round((a.currentTime / a.duration) * 1000);
});
a.addEventListener('loadedmetadata', () => {
  render();
  $('notice').textContent = 'Reproduciendo ' + src();
});
a.addEventListener('ended', () => {
  if (!a.loop) step(1);
});
a.addEventListener('error', () => {
  $('notice').textContent =
    'No se encuentra ' + src() + '; coloca el MP3 con ese nombre.';
});
render();