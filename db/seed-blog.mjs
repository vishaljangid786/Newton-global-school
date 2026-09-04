// Load the document's article into blog_posts. Run after the schema:
//   npm run db:seed:blog
//
// The article's blocks live in src/data/pages/online-school.ts (generated
// verbatim from the .docx). This converts them to the HTML the blog renderer
// expects. Safe to re-run: the post is matched on slug and updated in place.

import { readFileSync } from "node:fs";
import nextEnv from "@next/env";
import mysql from "mysql2/promise";

nextEnv.loadEnvConfig(process.cwd());

const SLUG = "is-online-school-valid-in-india";

const escape = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/** `**bold**` is the document's own emphasis marker. */
const inline = (s) =>
  escape(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

/** Read the generated blocks without needing a TypeScript compiler. */
function readBlocks() {
  const src = readFileSync("src/data/pages/online-school.ts", "utf8");
  const blocks = [];
  const re =
    /\{\s*kind:\s*"(h1|h2|h3|p|li)",\s*text:\s*`([\s\S]*?)`\s*\}|\{\s*kind:\s*"table",\s*rows:\s*\[([\s\S]*?)\n\s*\],\s*\}/g;
  let m;
  while ((m = re.exec(src))) {
    if (m[1]) blocks.push({ kind: m[1], text: m[2] });
    else {
      const rows = [...m[3].matchAll(/\[([\s\S]*?)\]/g)].map((r) =>
        [...r[1].matchAll(/`([\s\S]*?)`/g)].map((c) => c[1])
      );
      blocks.push({ kind: "table", rows });
    }
  }
  return blocks;
}

function toHtml(blocks) {
  const out = [];
  let list = [];
  const flush = () => {
    if (list.length) {
      out.push(`<ul>${list.map((i) => `<li>${inline(i)}</li>`).join("")}</ul>`);
      list = [];
    }
  };
  for (const b of blocks) {
    if (b.kind === "li") {
      list.push(b.text);
      continue;
    }
    flush();
    if (b.kind === "h1") continue; // the page prints the title itself
    if (b.kind === "h2") out.push(`<h2>${inline(b.text)}</h2>`);
    else if (b.kind === "h3") out.push(`<h3>${inline(b.text)}</h3>`);
    else if (b.kind === "p") out.push(`<p>${inline(b.text)}</p>`);
    else if (b.kind === "table") {
      const [head, ...rest] = b.rows;
      out.push(
        `<table><thead><tr>${head
          .map((c) => `<th>${inline(c)}</th>`)
          .join("")}</tr></thead><tbody>${rest
          .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
          .join("")}</tbody></table>`
      );
    }
  }
  flush();
  return out.join("\n");
}

async function main() {
  const blocks = readBlocks();
  if (blocks.length === 0) {
    console.error("No blocks parsed from src/data/pages/online-school.ts");
    process.exit(1);
  }
  const h1 = blocks.find((b) => b.kind === "h1");
  const first = blocks.find((b) => b.kind === "p");
  const title = (h1?.text ?? "").replace(/\*\*/g, "");
  const excerpt = `${(first?.text ?? "").replace(/\*\*/g, "").slice(0, 300)}…`;
  const body = toHtml(blocks);

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "newton_global_school",
  });

  const [rows] = await conn.execute("SELECT id FROM blog_posts WHERE slug = ?", [SLUG]);
  if (rows.length > 0) {
    await conn.execute(
      `UPDATE blog_posts SET title = ?, excerpt = ?, body = ?, status = 'published',
         published_at = COALESCE(published_at, NOW()) WHERE slug = ?`,
      [title, excerpt, body, SLUG]
    );
    console.log(`  ✓ updated ${SLUG} (${body.length} chars of HTML)`);
  } else {
    await conn.execute(
      `INSERT INTO blog_posts
         (slug, title, branch_ref, excerpt, body, cover_tone, status, author_name, published_at)
       VALUES (?, ?, 'all', ?, ?, 'primary', 'published', 'Newton Global School', NOW())`,
      [SLUG, title, excerpt, body]
    );
    console.log(`  ✓ inserted ${SLUG} (${body.length} chars of HTML)`);
  }
  await conn.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
