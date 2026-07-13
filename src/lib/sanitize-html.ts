/**
 * Minimal allowlist HTML sanitiser for rich-text blog bodies. Runs on the
 * server before storage. Keeps a small set of formatting tags, drops every
 * attribute except a validated href on links, and removes script/style blocks
 * and event handlers. Content of disallowed tags is preserved as text.
 */

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "ul",
  "ol",
  "li",
  "a",
]);

export function sanitizeHtml(input: string): string {
  if (!input) return "";

  // Drop script/style blocks (including their contents) outright.
  let html = input.replace(/<(script|style)[\s\S]*?<\/\1\s*>/gi, "");
  // Drop HTML comments.
  html = html.replace(/<!--[\s\S]*?-->/g, "");

  html = html.replace(
    /<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g,
    (_match, close: string, tag: string, attrs: string) => {
      const name = tag.toLowerCase();
      if (!ALLOWED_TAGS.has(name)) return "";
      if (close) return `</${name}>`;

      if (name === "a") {
        const hrefMatch = attrs.match(
          /href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i
        );
        const raw = hrefMatch
          ? (hrefMatch[2] ?? hrefMatch[3] ?? hrefMatch[4] ?? "").trim()
          : "";
        if (!/^(https?:\/\/|mailto:)/i.test(raw)) return "<a>";
        const safe = raw.replace(/"/g, "&quot;");
        return `<a href="${safe}" target="_blank" rel="noopener noreferrer nofollow">`;
      }

      // All other allowed tags: strip every attribute.
      return `<${name}>`;
    }
  );

  return html.trim();
}

/** Plain-text length of an HTML string — used for "is the body empty?" checks. */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}
