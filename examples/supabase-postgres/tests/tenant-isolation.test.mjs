import assert from "node:assert/strict";
import { test } from "node:test";
import pg from "pg";

const { Client } = pg;

test("switching organization context never exposes another tenant's facility", async () => {
  const client = new Client({
    connectionString: process.env.TEST_DATABASE_URL,
  });
  await client.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "INSERT INTO public.organizations (id, name) VALUES ($1, 'Tenant one'), ($2, 'Tenant two') ON CONFLICT DO NOTHING",
      [
        "11111111-1111-4111-8111-111111111111",
        "22222222-2222-4222-8222-222222222222",
      ],
    );
    await client.query(
      "INSERT INTO public.facilities (id, organization_id, name) VALUES ($1, $2, 'Tenant one facility'), ($3, $4, 'Tenant two facility') ON CONFLICT DO NOTHING",
      [
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "11111111-1111-4111-8111-111111111111",
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        "22222222-2222-4222-8222-222222222222",
      ],
    );
    await client.query("SET LOCAL ROLE authenticated");
    await client.query(
      "SELECT set_config('app.current_organization_id', $1, true)",
      ["11111111-1111-4111-8111-111111111111"],
    );
    const firstTenant = await client.query(
      "SELECT count(*)::int AS count FROM public.facilities",
    );
    assert.equal(firstTenant.rows[0]?.count, 1);
    await client.query(
      "SELECT set_config('app.current_organization_id', $1, true)",
      ["22222222-2222-4222-8222-222222222222"],
    );
    const secondTenant = await client.query(
      "SELECT count(*)::int AS count FROM public.facilities",
    );
    assert.equal(secondTenant.rows[0]?.count, 1);
  } finally {
    await client.query("ROLLBACK");
    await client.end();
  }
});
