import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import pg from "pg";

const { Client } = pg;
const connectionString = process.env.TEST_DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "TEST_DATABASE_URL must point to a disposable test database.",
  );
}

const directory = "supabase/migrations";
const files = (await readdir(directory))
  .filter((name) => name.endsWith(".sql"))
  .sort();
if (files.length === 0) {
  throw new Error("No migrations were found.");
}

const client = new Client({ connectionString });
await client.connect();
try {
  for (const file of files) {
    await client.query(await readFile(path.join(directory, file), "utf8"));
  }
} finally {
  await client.end();
}
