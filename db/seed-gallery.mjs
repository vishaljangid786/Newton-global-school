// Load the school's own photographs into gallery_images. Run after the schema:
//   npm run db:seed:gallery
//
// The photograph list lives in src/data/gallery-seed.ts so the file that ships
// to the browser stays empty — the site reads the gallery from the database.
// Safe to re-run: rows are matched on image_url and left untouched.

import { readFileSync } from "node:fs";
import nextEnv from "@next/env";
import mysql from "mysql2/promise";

nextEnv.loadEnvConfig(process.cwd());

/** Pull the literal entries out of the TypeScript seed without a compiler. */
function readSeed() {
  const src = readFileSync("src/data/gallery-seed.ts", "utf8");
  const out = [];
  const re =
    /caption:\s*`([^`]*)`,\s*category:\s*"([^"]+)",\s*branch:\s*"([^"]+)",\s*imageUrl:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) {
    out.push({ caption: m[1], category: m[2], branch: m[3], imageUrl: m[4] });
  }
  return out;
}

async function main() {
  const items = readSeed();
  if (items.length === 0) {
    console.error("No entries found in src/data/gallery-seed.ts");
    process.exit(1);
  }

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "newton_global_school",
    ssl: undefined,
    multipleStatements: false,
  });

  console.log(`Seeding ${items.length} photographs…`);
  let added = 0;
  let skipped = 0;
  for (const item of items) {
    const [rows] = await conn.execute(
      "SELECT id FROM gallery_images WHERE image_url = ? LIMIT 1",
      [item.imageUrl]
    );
    if (rows.length > 0) {
      skipped += 1;
      continue;
    }
    await conn.execute(
      `INSERT INTO gallery_images (branch_ref, category, caption, image_url)
       VALUES (?, ?, ?, ?)`,
      [item.branch, item.category, item.caption, item.imageUrl]
    );
    added += 1;
  }
  console.log(`  ✓ inserted ${added}, already present ${skipped}`);
  await conn.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
