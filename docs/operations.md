# Operations handoff

Infrastructure deployment, service scaling, OpenBao provisioning, production database changes, and production secret writes belong in protected `octaCEL-Infra` workflows. Ordinary project CI validates code and publishes approved artifacts; it does not deploy or mutate infrastructure.

Before a runtime release, confirm the target host profile, required ports, filesystem permissions, rootless Podman support, startup and health checks, service limits, backup/recovery procedure, and rollback plan with the infrastructure maintainers. Static machine compatibility does not prove a live deployment.
