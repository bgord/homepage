# homepage

[![Deploy](https://github.com/bgord/homepage/actions/workflows/deploy-server.yml/badge.svg)](https://github.com/bgord/homepage/actions/workflows/deploy-server.yml)

[![Healthcheck](https://github.com/bgord/homepage/actions/workflows/healthcheck.yml/badge.svg)](https://github.com/bgord/homepage/actions/workflows/healthcheck.yml)

[Check status](https://bgord.github.io/statuses/history/homepage)

## Configuration:

Clone the repository

```
git clone git@github.com:bgord/homepage.git --recurse-submodules
```

Install packages

```
bun i
```

Create env files

```
cp .env.example .env.local
cp .env.example .env.test
```

Start the app

```
./bgord-scripts/local-server-start.sh
```

Run the tests

```
./bgord-scripts/test-run.sh
```

Generate production master key

Master key fils hould include 64 hex characters

```
bun run bgord-scripts/secrets-encrypt.ts --master-key /run/master-key.txt --input /project/path/.env.production --output /project/path/infra/secrets.enc
```

## Domain:

```
modules/
└── supported-languages.ts
```

## App:

```
app/
├── http
│   ├── error-handler.ts
```

## Infra:

```
infra/
├── adapters
│   └── system
│       ├── certificate-inspector.adapter.ts
│       ├── clock.adapter.ts
│       ├── disk-space-checker.adapter.ts
│       ├── file-reader-json.adapter.ts
│       ├── id-provider.adapter.ts
│       ├── logger.adapter.ts
│       ├── sleeper.adapter.ts
│       ├── timekeeper.adapter.ts
│       └── timeout-runner.adapter.ts
├── bootstrap.ts
├── depcruise.webpack.cjs
├── e2e
│   └── home.spec.ts
├── env.ts
└── tools
    ├── i18n.ts
    ├── prerequisites.ts
    ├── shield-basic-auth.strategy.ts
    ├── shield-rate-limit.strategy.ts
    └── shield-timeout.strategy.ts
```
