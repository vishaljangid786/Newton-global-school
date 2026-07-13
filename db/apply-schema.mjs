// Apply db/schema.sql to the configured database. Works without the mysql CLI.
//   npm run db:setup
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import nextEnv from "@next/env";
import mysql from "mysql2/promise";

nextEnv.loadEnvConfig(process.cwd());

const here = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(here, "schema.sql"), "utf8");

const conn = await mysql.createConnection({
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "newton",
  multipleStatements: true,
});

console.log(`Applying schema to "${process.env.DB_NAME}"…`);
await conn.query(sql);
await conn.end();
console.log("Schema applied.");
