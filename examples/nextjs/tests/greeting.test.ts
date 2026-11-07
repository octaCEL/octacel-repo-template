import assert from "node:assert/strict";
import { test } from "node:test";

import { greeting } from "../src/greeting";

test("greets the named project user", () => {
  assert.equal(greeting("Ahmed"), "Welcome, Ahmed.");
});
