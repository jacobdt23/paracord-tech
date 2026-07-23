const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navBackdrop = document.getElementById('navBackdrop');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    if (navBackdrop) navBackdrop.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      if (navBackdrop) navBackdrop.classList.remove('open');
    })
  );
  if (navBackdrop) {
    navBackdrop.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navBackdrop.classList.remove('open');
    });
  }
}

// ---- Live YouTube feed (client-side, via RSS -> JSON proxy) ----
// YouTube's RSS feed doesn't send CORS headers, so a free proxy
// (rss2json.com) is used to fetch it from the browser. If that
// service is unreachable or rate-limited, we fall back to a plain
// "view on YouTube" card instead of ever showing fake/stale titles.
// Called per-page (paracord.html / tech.html) with that page's channel ID.
async function loadYouTubeChannel(channelId, gridId, count = 6) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error('bad response: ' + res.status);
    const data = await res.json();
    if (data.status !== 'ok' || !Array.isArray(data.items) || data.items.length === 0) {
      throw new Error('no items returned');
    }

    grid.innerHTML = '';
    data.items.slice(0, count).forEach(item => {
      const card = document.createElement('a');
      card.href = item.link;
      card.target = '_blank';
      card.rel = 'noopener';
      card.className = 'video-card';

      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      const thumbUrl = item.thumbnail || (item.enclosure && item.enclosure.link) || '';
      if (thumbUrl) thumb.style.backgroundImage = `url("${thumbUrl}")`;

      const playIcon = document.createElement('div');
      playIcon.className = 'play-icon';
      playIcon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
      thumb.appendChild(playIcon);

      const info = document.createElement('div');
      info.className = 'video-info';

      const h3 = document.createElement('h3');
      h3.textContent = item.title;

      const meta = document.createElement('div');
      meta.className = 'video-meta';
      const d = new Date(item.pubDate);
      meta.textContent = isNaN(d) ? 'Latest upload' :
        d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

      info.appendChild(h3);
      info.appendChild(meta);
      card.appendChild(thumb);
      card.appendChild(info);
      grid.appendChild(card);
    });
  } catch (err) {
    console.warn('Live video feed unavailable, showing fallback:', err);
    grid.innerHTML = '';
    const fallback = document.createElement('a');
    fallback.href = `https://www.youtube.com/channel/${channelId}`;
    fallback.target = '_blank';
    fallback.rel = 'noopener';
    fallback.className = 'video-card fallback-card';
    fallback.innerHTML =
      '<div class="video-info" style="padding:28px;">' +
      '<h3>Couldn\'t load latest uploads</h3>' +
      '<div class="video-meta">Tap to view the channel directly on YouTube ↗</div>' +
      '</div>';
    grid.appendChild(fallback);
  }
}
