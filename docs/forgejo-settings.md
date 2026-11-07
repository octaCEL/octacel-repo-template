# Required Forgejo settings

After creating the project from this template:

1. Set `main` as the default branch.
2. Confirm the `octaCEL` organization runner is assigned to this repository and uses the `octacel-org-ci` label.
3. Protect `main`, require one approval and the final CI summary, dismiss stale approvals, block outdated branches, and disable direct and force pushes.
4. Protect `v*` tags for release maintainers.
5. For public projects, require approval before Actions run for first-time contributors or fork pull requests.
6. Add project teams and permissions explicitly. Template generation does not inherit repository access controls.
7. For container images, check the Forgejo OCI package after publication and ensure it is linked to the source repository.

## Shared workflow owner visibility

Forgejo v15 requires the repository called by a cross-repository reusable workflow to be public and its owner publicly resolvable. The shared framework is at `ahmed.al-zanam/octacel-ci`, owned by the public `ahmed.al-zanam` profile. The `octaCEL` organization remains private. Keep new workflows and the commit lock file pinned to this canonical Forgejo path.

The final CI status context can vary with server version. Inspect the first completed workflow run and require the exact final summary check; do not guess its name.

For a repository administrator, `scripts/bootstrap_forgejo_repo.py` can create or update the `main` branch rule after the first workflow finishes. Set a narrowly scoped `FORGEJO_TOKEN` in the shell environment, pass the exact required status context and repository name, then unset the token. The script does not configure team access, runner assignment, tag rules, or Actions approval settings.

The shared organization runner currently runs on VPS61 alongside Forgejo, OpenBao, Vaultwarden, and monitoring. VPS61 is recorded for capacity and runner-host context, but is not offered as an application deployment target. The workflow uses rootless containers and no host socket, but that is not a complete host isolation boundary. Only trusted reviewed changes should execute there until an isolated CI host and network are available.
