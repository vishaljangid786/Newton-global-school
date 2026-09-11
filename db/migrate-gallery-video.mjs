// Bring an EXISTING database up to the gallery-video schema.
//   npm run db:migrate:video
//
// db/schema.sql only uses CREATE TABLE IF NOT EXISTS, so re-running db:setup
// never alters a table that is already there — a database created before videos
// existed would keep the old four columns and every upload would fail. This
// adds the new ones.
//
// Safe to run repeatedly: every step checks information_schema first, so a
// second run reports "already applied" and changes nothing. No row is written
// or deleted; existing photographs come out as media_type = 'image', which is
// exactly what they are.
import nextEnv from "@next/env";
import mysql from "mysql2/promise";

nextEnv.loadEnvConfig(process.cwd());

const DB = process.env.DB_NAME ?? "newton";

const conn = await mysql.createConnection({
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: DB,
});

async function hasColumn(table, column) {
  const [rows] = await conn.query(
    `SELECT 1 FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1`,
    [DB, table, column]
  );
  return rows.length > 0;
}

async function hasIndex(table, index) {
  const [rows] = await conn.query(
    `SELECT 1 FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1`,
    [DB, table, index]
  );
  return rows.length > 0;
}

async function isNullable(table, column) {
  const [rows] = await conn.query(
    `SELECT IS_NULLABLE FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1`,
    [DB, table, column]
  );
  return rows[0]?.IS_NULLABLE === "YES";
}

const steps = [];

console.log(`Migrating gallery_images in "${DB}" for video support…`);

const [[{ n: tableExists }]] = await conn.query(
  `SELECT COUNT(*) AS n FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'gallery_images'`,
  [DB]
);
if (!tableExists) {
  console.error(
    "gallery_images does not exist. Run `npm run db:setup` first — the schema " +
      "already includes the video columns, so no migration is needed after that."
  );
  await conn.end();
  process.exit(1);
}

if (!(await hasColumn("gallery_images", "media_type"))) {
  await conn.query(
    `ALTER TABLE gallery_images
       ADD COLUMN media_type ENUM('image','video') NOT NULL DEFAULT 'image'
       AFTER caption`
  );
  steps.push("added media_type (every existing row becomes 'image')");
}

if (!(await hasColumn("gallery_images", "video_url"))) {
  await conn.query(
    `ALTER TABLE gallery_images
       ADD COLUMN video_url VARCHAR(500) NULL AFTER image_url`
  );
  steps.push("added video_url");
}

if (!(await hasColumn("gallery_images", "video_source"))) {
  await conn.query(
    `ALTER TABLE gallery_images
       ADD COLUMN video_source ENUM('file','youtube') NULL AFTER video_url`
  );
  steps.push("added video_source");
}

// An uploaded clip need not carry a poster frame, so image_url has to relax.
if (!(await isNullable("gallery_images", "image_url"))) {
  await conn.query(
    `ALTER TABLE gallery_images MODIFY COLUMN image_url VARCHAR(500) NULL`
  );
  steps.push("image_url is now nullable (videos may have no poster)");
}

if (!(await hasIndex("gallery_images", "idx_gallery_media"))) {
  await conn.query(
    `ALTER TABLE gallery_images ADD KEY idx_gallery_media (media_type)`
  );
  steps.push("added idx_gallery_media");
}

await conn.end();

if (steps.length === 0) {
  console.log("Already applied — nothing to change.");
} else {
  for (const step of steps) console.log(`  • ${step}`);
  console.log("Done. Videos can now be uploaded from Admin → Gallery.");
}
