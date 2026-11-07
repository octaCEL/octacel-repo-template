# Rootless service example

This fixture serves `/health` on port 8080 as the unprivileged `nobody` user. Its image base is digest-pinned. The shared CI builds and scans the image before Forgejo registry authentication; the protected publish job then adds a commit-SHA tag.
