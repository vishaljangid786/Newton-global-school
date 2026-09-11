/**
 * YouTube link handling — parsing and URL building, nothing else.
 *
 * Its own module rather than part of lib/uploads.ts, which is `server-only`:
 * the gallery's lightbox is a client component and needs the embed and watch
 * URLs, so importing them from there would fail the build. Everything here is
 * pure string work with no Node API behind it, so it is safe on both sides.
 */

/** An 11-character YouTube video id. */
const ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * Pull the video id out of whatever YouTube URL was pasted.
 *
 * Accepts every shape the Share button and the address bar produce — watch?v=,
 * youtu.be/, /embed/, /shorts/, /live/ — plus a bare id, because someone will
 * paste one. Returns null when it is not a YouTube link at all, which is what
 * the caller turns into "that does not look like a YouTube link".
 */
export function parseYouTubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  if (ID.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const isYouTube =
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "music.youtube.com" ||
    host === "youtube-nocookie.com" ||
    host === "youtu.be";
  if (!isYouTube) return null;

  /* youtu.be/<id> — the id is the whole path. */
  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return ID.test(id) ? id : null;
  }

  /* youtube.com/watch?v=<id> */
  const v = url.searchParams.get("v");
  if (v && ID.test(v)) return v;

  /* /embed/<id>, /shorts/<id>, /live/<id>, /v/<id> */
  const match = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

/**
 * YouTube's own poster frame for a video id. `hqdefault` exists for every
 * video ever uploaded, which `maxresdefault` does not — a missing maxres 404s
 * and leaves a broken tile, so the guaranteed size wins.
 *
 * i.ytimg.com must be in `images.remotePatterns` in next.config.ts for
 * next/image to accept it.
 */
export function youTubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/** The watch page, for the "Watch on YouTube" link under a playing video. */
export function youTubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/**
 * Privacy-enhanced embed. youtube-nocookie.com does not set tracking cookies
 * until the visitor actually presses play, which matters on a site whose
 * audience is children and their parents.
 */
export function youTubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}
