# Contributing

## Development flow

1. Create a feature branch from `main`.
2. Keep the change scoped to one reviewed task. Add or update real tests and the relevant English/Arabic behavior if the project has user-facing interfaces.
3. Run the repository's formatting, lint, type, build, and test commands locally.
4. Run `./scripts/init-project.sh` after changing project metadata, then review `.octacel/project.json`.
5. Open a pull request. Do not push directly to `main` or create a release tag without the repository's approval.
6. Fix failed checks. Do not hide a scanner, suppress an error, or mark an unused check as successful.

## Code and data

Never commit credentials, customer data, production snapshots, recovery keys, or live `.env` files. Keep authorization server-side and preserve tenant isolation, audit history, and migration compatibility. Use synthetic data in tests.

## Commit and version conventions

Use concise imperative commits and Conventional Commit prefixes such as `feat`, `fix`, `docs`, `test`, `refactor`, `build`, `ci`, and `chore`. Follow the product's version source and increment it in the same pull request. Release tags use `vMAJOR.MINOR.PATCH` and must match the project's version file or manifest.
