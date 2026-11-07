# Local development

Use the runtime and package manager declared in `.octacel/project.json` and the lockfile. Copy `.env.example` to a local-only `.env` only after reviewing the values; never put production secrets in local development.

Each project must define its actual formatting, lint, type, build, and test commands. Supabase projects use a disposable local database and synthetic data; Terraform changes use backend-free init and validation. Ordinary development checks never run Terraform apply or destroy.

Run `./scripts/init-project.sh` from the repository root to discover common toolchains and verify that required profile settings are complete.
