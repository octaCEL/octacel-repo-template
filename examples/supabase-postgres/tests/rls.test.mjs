import assert from "node:assert/strict";
import { test } from "node:test";
import pg from "pg";

const { Client } = pg;

test("authenticated rows follow the current organization", async () => {
  const client = new Client({
    connectionString: process.env.TEST_DATABASE_URL,
  });
  await client.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "INSERT INTO public.organizations (id, name) VALUES ($1, 'Tenant one') ON CONFLICT DO NOTHING",
      ["11111111-1111-4111-8111-111111111111"],
    );
    await client.query(
      "INSERT INTO public.facilities (id, organization_id, name) VALUES ($1, $2, 'Visible facility') ON CONFLICT DO NOTHING",
      [
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "11111111-1111-4111-8111-111111111111",
      ],
    );
    await client.query("SET LOCAL ROLE authenticated");
    await client.query(
      "SELECT set_config('app.current_organization_id', $1, true)",
      ["11111111-1111-4111-8111-111111111111"],
    );
    const result = await client.query(
      "SELECT count(*)::int AS count FROM public.facilities",
    );
    assert.equal(result.rows[0]?.count, 1);
  } finally {
    await client.query("ROLLBACK");
    await client.end();
  }
});
