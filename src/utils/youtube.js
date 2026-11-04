// Helpers for lesson video links. Lessons store only the YouTube link (not the
// video itself), so nothing heavy ends up in localStorage.

const YT_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "www.youtu.be",
]);

const ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

const parseUrl = (input) => {
  if (!input || typeof input !== "string") return null;
  let text = input.trim();
  if (!text) return null;
  // Allow links pasted without the protocol, e.g. "youtu.be/abc..."
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(text)) text = `https://${text}`;
  try {
    const url = new URL(text);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
};

// Returns the 11-character video id for any common YouTube link format
// (watch, youtu.be, embed, shorts, live), or null if it isn't one.
export const getYouTubeId = (input) => {
  const url = parseUrl(input);
  if (!url) return null;
  const host = url.hostname.toLowerCase();
  if (!YT_HOSTS.has(host)) return null;

  let id = null;
  if (host === "youtu.be" || host === "www.youtu.be") {
    id = url.pathname.split("/")[1];
  } else if (url.pathname === "/watch") {
    id = url.searchParams.get("v");
  } else {
    const match = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/);
    if (match) id = match[1];
  }
  return id && ID_PATTERN.test(id) ? id : null;
};

// "90", "1m30s", "1h2m3s" -> seconds
const parseStartTime = (value) => {
  if (!value) return 0;
  if (/^\d+$/.test(value)) return parseInt(value, 10);
  const m = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
  if (!m) return 0;
  return (Number(m[1]) || 0) * 3600 + (Number(m[2]) || 0) * 60 + (Number(m[3]) || 0);
};

export const getYouTubeEmbedUrl = (input) => {
  const id = getYouTubeId(input);
  if (!id) return null;
  const url = parseUrl(input);
  const start = parseStartTime(url.searchParams.get("t") || url.searchParams.get("start"));
  let embed = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
  if (start > 0) embed += `&start=${start}`;
  return embed;
};

export const getYouTubeWatchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;

export const isHttpUrl = (input) => {
  if (!input || typeof input !== "string") return false;
  try {
    const url = new URL(input.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};
