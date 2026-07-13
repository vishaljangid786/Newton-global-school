import "server-only";
import mysql from "mysql2/promise";

/**
 * Pooled MySQL connection for the admin/RBAC layer.
 *
 * The pool is cached on globalThis so Next.js dev hot-reloads don't leak
 * connections. Every public-facing read wraps its query in `tryQuery` so the
 * site still renders (falling back to static src/data) when MySQL is offline —
 * only the admin dashboard hard-requires a live database.
 */

declare global {
  // eslint-disable-next-line no-var
  var __sunrisePool: mysql.Pool | undefined;
}

/** Values accepted as bound query parameters. */
type SqlParams = Array<string | number | boolean | null | Date | Buffer>;

function createPool(): mysql.Pool {
  return mysql.createPool({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "sunrise_school",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60_000,
    enableKeepAlive: true,
    // MySQL DATETIME columns come back as JS strings, not Date objects,
    // which keeps values serialisable across the server/client boundary.
    dateStrings: true,
    namedPlaceholders: false,
  });
}

export function getPool(): mysql.Pool {
  if (!global.__sunrisePool) {
    global.__sunrisePool = createPool();
  }
  return global.__sunrisePool;
}

/**
 * Run a query and return typed rows. Throws on failure — use this in admin
 * code paths where a DB error should surface loudly.
 */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const [rows] = await getPool().execute(sql, params as SqlParams);
  return rows as T[];
}

/** Like `query`, but returns the raw ResultSetHeader (for INSERT/UPDATE/DELETE). */
export async function mutate(
  sql: string,
  params: unknown[] = []
): Promise<mysql.ResultSetHeader> {
  const [result] = await getPool().execute(sql, params as SqlParams);
  return result as mysql.ResultSetHeader;
}

/**
 * Run a read that must never break the public site. Returns `fallback` if the
 * database is unreachable or the query fails (e.g. MySQL not yet set up).
 */
export async function tryQuery<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
  fallback: T[] = []
): Promise<T[]> {
  try {
    return await query<T>(sql, params);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[db] read failed, using fallback:",
        (error as Error).message
      );
    }
    return fallback;
  }
}

/** True when the database is reachable — used by the admin health check. */
export async function isDbHealthy(): Promise<boolean> {
  try {
    await getPool().query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}
