# CI and release use

`.forgejo/workflows/ci.yml` calls the public `octacel-ci` reusable workflows at a full commit SHA. Keep that pin unchanged unless a reviewed CI upgrade PR intentionally moves it. The GitHub mirror is for source backup during migration; CI results are produced by Forgejo Actions. The current Forgejo server cannot expand the shared workflows while the `octaCEL` owner is private; see [the required administrator setting](forgejo-settings.md#shared-workflow-owner-visibility).

## Checks by profile

- Node: exact Node toolchain; lockfile-based install; formatting, lint, type check, build, unit tests, and optional integration command.
- Supabase/PostgreSQL: a disposable PostgreSQL service, migration/schema commands, append-only migration check, pgTAP SQL tests, explicit RLS and tenant-isolation suites, and database-backed integration tests.
- Terraform infrastructure: exact Terraform version, format, backend-free init and validate, TFLint, Checkov, Trivy IaC, ShellCheck, Quadlet parsing, and systemd unit verification. Container profiles also validate any bundled Quadlet/systemd files.
- All profiles: Gitleaks, Semgrep, OSV-Scanner, Trivy, workflow syntax validation, source SBOM, release-ref validation, measured target compatibility, and a final required-check summary.
- Container: rootless Buildah build, Trivy image scan, SPDX SBOM, and publication after all gates pass. The publisher adds an immutable commit-SHA tag. A protected `vMAJOR.MINOR.PATCH` tag also receives a semantic tag.

The profile validator rejects unknown profiles and missing commands. It does not generate passing test scripts. Do not set a command to `true`, use an empty test suite, or remove a required job to get a green result.

## Branch and release rules

Protect `main`, require human approval and the final summary check, dismiss stale approvals, block outdated branches, and disable direct pushes and force pushes. Protect `v*` tags so release maintainers alone can create them. A tag must match a version in `package.json`, `VERSION`, or `.octacel/release.json`.

The template does not copy branch rules, runner assignment, secrets, environment approvals, or team permissions to generated repositories. See [Forgejo settings](forgejo-settings.md).

## Runner cleanup

Jobs have explicit timeouts and use isolated per-job containers. No shared cache or host container socket is configured. Container builds remove their temporary OCI archive; the registry credential is created after image scanning and removed immediately after the push. Do not run unreviewed fork code on the shared VPS61 runner; see the [security model](security.md).
