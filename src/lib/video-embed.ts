// Converts YouTube / Facebook share links into embeddable player URLs.
export function getEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const u = url.trim();
  if (!u) return null;

  // YouTube: watch, youtu.be, shorts, live, embed
  const yt =
    u.match(/(?:youtube\.com\/(?:watch\?[^#]*v=|shorts\/|live\/|embed\/))([\w-]{6,})/) ||
    u.match(/youtu\.be\/([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  // Facebook: video or reel links
  if (/facebook\.com|fb\.watch/.test(u)) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u)}&show_text=false`;
  }

  return null;
}
