# Versioning and commits

Use Conventional Commit prefixes and keep commit subjects concise. For a release, use `vMAJOR.MINOR.PATCH` and update the project's declared version in the same reviewed pull request. The release check requires the tag to match the package version, `VERSION`, or `.octacel/release.json`.

Use MAJOR for incompatible public API/data changes, MINOR for backward-compatible user capabilities, and PATCH for fixes and maintenance. Document any different product-specific version policy in this file.
