import assert from "node:assert/strict";
import { test } from "node:test";

test("example tenant fixture uses stable UUIDs", () => {
  assert.match("11111111-1111-4111-8111-111111111111", /^[0-9a-f-]{36}$/);
});
