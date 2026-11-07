#!/usr/bin/env bash
set -euo pipefail

root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
lock="$root/.octacel/ci-framework.lock.json"
if [[ "$script_dir" != "$root/scripts" ]]; then
  echo 'Run init-project.sh from the repository root.' >&2
  exit 2
fi

python3 - "$lock" "$script_dir" <<'PY'
import hashlib
import json
import pathlib
import sys

lock = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
if not isinstance(lock.get("ref"), str) or len(lock["ref"]) != 40 or any(c not in "0123456789abcdef" for c in lock["ref"]):
    raise SystemExit("The shared CI framework pin is missing or invalid.")
for name, expected in lock.get("initScripts", {}).items():
    path = pathlib.Path(sys.argv[2]) / name
    if not isinstance(expected, str) or hashlib.sha256(path.read_bytes()).hexdigest() != expected:
        raise SystemExit(f"Bootstrap script does not match the locked octacel-ci revision: {name}")
PY

PYTHONPATH="$root${PYTHONPATH:+:$PYTHONPATH}" exec python3 "$script_dir/init_project.py" --root "$root" "$@"
