# Security policy

Report suspected vulnerabilities privately to the octaCEL maintainers through the organization's approved security contact. Do not publish exploit details, credentials, tenant data, or production endpoints in a public issue.

Do not commit secrets. Rotate any credential that may have been exposed. Use synthetic development data. CI scans source and dependencies, but a green scan does not replace review, threat modeling, or runtime security testing.

Project CI is not a deployment workflow. Production secrets and deployment credentials belong only in protected octaCEL infrastructure workflows and OpenBao policies for the intended environment.
