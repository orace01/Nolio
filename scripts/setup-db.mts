/*
 * Creates the tables, the job queue and the storage buckets of Nolio on the
 * Supabase project: `npm run db:setup`. Safe to run again.
 */

import { readFileSync } from "node:fs";
import nextEnv from "@next/env";
import pg from "pg";

nextEnv.loadEnvConfig(process.cwd());

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error("Set SUPABASE_DB_URL in .env.local (Supabase: Project settings > Database > Connection string).");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();
try {
  await client.query(readFileSync("supabase/migrations/0001_nolio.sql", "utf8"));
  console.log("Database ready.");
} finally {
  await client.end();
}
