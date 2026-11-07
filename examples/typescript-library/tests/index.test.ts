import assert from "node:assert/strict";
import { test } from "node:test";

import { normalizeProjectName } from "../src/index.js";

test("normalizes a project name to a slug", () => {
  assert.equal(normalizeProjectName(" octaCEL CI "), "octacel-ci");
});
