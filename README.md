# octaCEL project template

Use this repository to start a new octaCEL service, application, library, infrastructure project, or extension. It provides a small Forgejo workflow that calls the public, commit-pinned [`octacel-ci`](https://git.octacel.com/octaCEL/octacel-ci) framework. Each project selects its checks in `.octacel/project.json`; shared workflow implementations stay in the central CI repository.

## Start a project

1. In Forgejo, create a repository from the official `octacel-repo-template` after its maintainers have enabled the template setting.
2. Clone the generated repository and run `./scripts/init-project.sh`. The template includes checksum-verified bootstrap scripts pinned to the central framework commit, so initialization works without a CI credential. The script discovers common Node, Supabase, Terraform, and container conventions, prompts for missing values, and writes `.octacel/project.json`.
3. Review the generated contract. Add real formatting, lint, type, build, unit, integration, migration, schema, RLS, and tenant-isolation commands as applicable. CI rejects missing commands or missing SQL test suites; it does not invent passing checks.
4. Select and add a license before distributing the project. This template intentionally provides guidance rather than choosing a license for the project owner.
5. Push a feature branch and open a pull request. Forgejo Actions runs the applicable checks on the organization runner. Merge after required checks and review pass.
6. Protect `main` and `v*` tags before enabling container publishing. Approved `main` commits publish an immutable commit-SHA image; approved semantic tags also publish a matching `vMAJOR.MINOR.PATCH` tag.

## Supported profiles

- Next.js / React / TypeScript applications
- Node.js backend services and SaaS projects
- TypeScript libraries and browser extensions
- Supabase / PostgreSQL applications
- Terraform roots and modules
- Rootless Podman and containerized services

The initializer detects common conventions and prompts for values it cannot safely infer. Use its command-line options for non-interactive setup; run `./scripts/init-project.sh --help` for the supported inputs.

## CI checks

The shared framework runs only the checks relevant to the selected project: Node quality gates, disposable PostgreSQL and pgTAP, Terraform/IaC validation, machine compatibility, workflow syntax, Gitleaks, Semgrep, OSV-Scanner, Trivy, Syft SBOM generation, container build and scan, protected image publication, release validation, and a final required-check summary.

All external actions and job images are pinned to immutable revisions. The central workflow SHA is recorded in `.octacel/ci-framework.lock.json`; update it through a reviewed change after testing the new CI version. Forgejo runs the source of truth for checks during the GitHub migration period. Forgejo v15 also needs the reusable-workflow owner to be publicly resolvable. The central repository is public, but its `octaCEL` organization is private on the current instance, so workflow expansion is blocked until an administrator makes the owner publicly visible or relocates the public framework repository. Organization visibility can reveal membership metadata; see [Forgejo settings](docs/forgejo-settings.md).

## Repository configuration

Generated repositories do not inherit runner assignment, branch rules, tag protection, credentials, secrets, environment approvals, or team access. Follow [Forgejo settings](docs/forgejo-settings.md), [CI and release use](docs/ci.md), and [secret references](docs/secrets.md). Production credentials and infrastructure changes belong in protected `octaCEL-Infra` workflows, not ordinary project CI.

The available shared runner is on VPS61 beside other infrastructure services. Rootless containers and workflow restrictions reduce exposure, but do not provide a complete host boundary. Do not run unreviewed public-fork code on that runner; see [the security model](docs/security.md).

## Example projects

`examples/` contains small, real fixtures for Next.js, TypeScript libraries, Supabase/PostgreSQL, Terraform, and a rootless Podman service. They exercise the same configuration contract and shared workflows as generated repositories.
