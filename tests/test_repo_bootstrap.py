import hashlib
import json
from pathlib import Path
import subprocess
import unittest
from unittest.mock import patch

from scripts.bootstrap_forgejo_repo import configure_main


class RepoBootstrapTests(unittest.TestCase):
    def test_local_initializer_matches_locked_framework_scripts(self):
        root = Path(__file__).resolve().parents[1]
        lock = json.loads((root / ".octacel/ci-framework.lock.json").read_text(encoding="utf-8"))
        for name, expected in lock["initScripts"].items():
            actual = hashlib.sha256((root / "scripts" / name).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, name)

    def test_initializer_help_runs_offline_from_template(self):
        root = Path(__file__).resolve().parents[1]
        result = subprocess.run(
            ["bash", str(root / "scripts/init-project.sh"), "--help"],
            cwd=root,
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("--project-type", result.stdout)

    @patch("scripts.bootstrap_forgejo_repo.api_call")
    def test_creates_main_protection_with_required_status(self, api_call):
        api_call.side_effect = [404, 201]
        status = configure_main("https://git.octacel.com/api/v1", "octaCEL", "sample", "test-fixture-token", ["CI / summary"], 1)
        self.assertEqual(status, 201)
        self.assertEqual(api_call.call_count, 2)
        payload = api_call.call_args.args[3]
        self.assertEqual(payload["status_check_contexts"], ["CI / summary"])
        self.assertFalse(payload["enable_push"])
        self.assertTrue(payload["apply_to_admins"])

    def test_requires_explicit_status_and_https(self):
        with self.assertRaises(ValueError):
            configure_main("http://git.octacel.com/api/v1", "octaCEL", "sample", "token", ["CI / summary"], 1)
        with self.assertRaises(ValueError):
            configure_main("https://git.octacel.com/api/v1", "octaCEL", "sample", "token", [], 1)


if __name__ == "__main__":
    unittest.main()
