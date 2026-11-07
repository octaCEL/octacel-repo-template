import assert from "node:assert/strict";
import { test } from "node:test";
import pg from "pg";

const { Client } = pg;

test("a migrated project exposes organization-scoped facilities", async () => {
  assert.ok(
    process.env.TEST_DATABASE_URL,
    "TEST_DATABASE_URL must be disposable",
  );
  const client = new Client({
    connectionString: process.env.TEST_DATABASE_URL,
  });
  await client.connect();
  try {
    const result = await client.query(
      "SELECT relrowsecurity FROM pg_class WHERE oid = 'public.facilities'::regclass",
    );
    assert.equal(result.rows[0]?.relrowsecurity, true);
  } finally {
    await client.end();
  }
});
