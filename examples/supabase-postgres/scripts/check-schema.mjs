import pg from "pg";

const { Client } = pg;
const connectionString = process.env.TEST_DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "TEST_DATABASE_URL must point to a disposable test database.",
  );
}

const client = new Client({ connectionString });
await client.connect();
try {
  const result = await client.query(
    "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'facilities') AS valid",
  );
  if (result.rows[0]?.valid !== true) {
    throw new Error("The facilities table is missing after migration.");
  }
} finally {
  await client.end();
}
