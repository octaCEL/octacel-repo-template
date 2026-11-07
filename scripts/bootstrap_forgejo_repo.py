#!/usr/bin/env python3
"""Apply explicit main-branch protections through the Forgejo v15 API."""

from __future__ import annotations

import argparse
import json
import os
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


def api_call(url: str, token: str, method: str, payload: dict | None = None) -> int:
    body = json.dumps(payload).encode("utf-8") if payload is not None else None
    request = Request(
        url,
        data=body,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "octacel-repository-bootstrap",
        },
    )
    try:
        with urlopen(request, timeout=15) as response:
            return response.status
    except HTTPError as error:
        return error.code


def configure_main(base_url: str, owner: str, repo: str, token: str, statuses: list[str], approvals: int) -> int:
    root = base_url.rstrip("/")
    if not root.startswith("https://"):
        raise ValueError("Forgejo API URL must use HTTPS")
    if not statuses or any(not status.strip() for status in statuses):
        raise ValueError("provide the exact required CI status context from a completed workflow")
    if approvals < 1:
        raise ValueError("at least one human approval is required")
    resource = f"{root}/repos/{owner}/{repo}/branch_protections/main"
    collection = f"{root}/repos/{owner}/{repo}/branch_protections"
    payload = {
        "branch_name": "main",
        "rule_name": "main",
        "required_approvals": approvals,
        "dismiss_stale_approvals": True,
        "block_on_outdated_branch": True,
        "block_on_rejected_reviews": True,
        "apply_to_admins": True,
        "enable_push": False,
        "enable_status_check": True,
        "status_check_contexts": statuses,
    }
    status = api_call(resource, token, "GET")
    if status == 404:
        result = api_call(collection, token, "POST", payload)
        if result not in {200, 201, 202}:
            return result
        return result
    if status != 200:
        return status
    return api_call(resource, token, "PATCH", payload)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default="https://git.octacel.com/api/v1")
    parser.add_argument("--owner", required=True)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--required-status", action="append", required=True)
    parser.add_argument("--approvals", type=int, default=1)
    arguments = parser.parse_args()
    token = os.environ.get("FORGEJO_TOKEN", "")
    if not token:
        print("Set FORGEJO_TOKEN in the environment; do not pass it on the command line.", file=sys.stderr)
        return 2
    try:
        status = configure_main(
            arguments.base_url,
            arguments.owner,
            arguments.repo,
            token,
            arguments.required_status,
            arguments.approvals,
        )
    except (ValueError, URLError, TimeoutError) as error:
        print(f"Repository protection could not be configured: {error}", file=sys.stderr)
        return 1
    if status not in {200, 201, 202}:
        print(f"Forgejo branch-protection API returned HTTP {status}.", file=sys.stderr)
        return 1
    print(f"Protected {arguments.owner}/{arguments.repo}: main requires {arguments.approvals} approval(s) and the specified CI status checks.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
