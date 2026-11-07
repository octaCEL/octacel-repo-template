# Secret references and OpenBao

Store only a reference in `.octacel/project.json`, never the value. A reference names one environment, a KV path/key, an owner, and a rotation review date.

```json
{
  "environment": "development",
  "path": "kv/biomedup/development#DATABASE_URL",
  "rotation": {"owner": "platform-team", "reviewAfter": "2027-02-01"}
}
```

Use separate paths and policies for CI, development, staging, and production credentials. Do not use a staging value in development, or vice versa. Production secrets and service deployments are provisioned by protected octaCEL-Infra workflows. Normal CI cannot read or write OpenBao unless a separately reviewed protected workflow explicitly receives a narrowly scoped CI-only credential; never pass CI secrets to pull-request jobs. Never commit AppRole secret IDs, root tokens, recovery shares, private keys, real `.env` files, or database URLs.
