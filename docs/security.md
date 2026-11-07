# Project CI security boundaries

Pull-request workflows do not receive production credentials or OpenBao access. Project commands run with Forgejo, GitHub, and OIDC request tokens removed. Checkout disables persisted credentials. Shared workflows pin actions by commit SHA and job/scanner images by digest, use per-job containers, set timeouts, avoid shared caches, and do not mount host container sockets.

Forgejo v15 still injects a repository-scoped Actions token into workflow steps, and permissions cannot be narrowed with GitHub-style job permissions. Pull-request tokens are read-only; trusted push tokens can write to the repository. Keep `main` protected, require human review, restrict direct writers to trusted contributors, and require approval before Actions run for first-time fork contributors. Do not enable `pull_request_target`.

The currently available organization runner is on VPS61 with Forgejo, OpenBao, Vaultwarden, and monitoring on the same host. Rootless Podman and the workflow restrictions reduce exposure but do not eliminate container-runtime or kernel escape risk, host network access, or all runner vulnerabilities. Do not run unreviewed public-fork code on this runner. Use an isolated CI host and restricted egress before broadening untrusted contributor access.

Ordinary product CI does not deploy, apply/destroy Terraform, modify OpenBao, or write production secrets. Registry publication is a separate job that authenticates only after validation and image scanning. Keep protected infrastructure workflows in `octaCEL-Infra`.
