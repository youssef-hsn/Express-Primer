# Architecture

An Express + TypeScript HTTP API arranged in one direction: a request enters
through a route, is validated by middleware, handled by a thin controller,
decided by a service, and persisted by a repository. Every directory under
`src/` is one of those stops. This file explains what belongs in each and what
each is allowed to import.

## Layer map

| Directory | Holds | Rule |
|---|---|---|
| `src/routes/` | Express `Router` instances that map URL segments to middleware + controller | Versioned: `routes/index.ts` mounts `/v1`, `routes/v1/index.ts` mounts each resource. No logic beyond wiring. |
| `src/validation/` | Zod schemas and the `validate(...)`-built middleware for a resource, plus the `z.infer` request aliases | The only place `req` shapes are declared. Exports both the middleware and the typed `Request<...>` alias. |
| `src/middleware/` | Cross-cutting `RequestHandler`s: `validate`, `errorHandler`, `notFound` | Generic and resource-agnostic. Resource-specific checks live in that resource's validation module. |
| `src/controllers/` | Request/response adapters | Read `req`, call one service, set a status, send JSON. No business rules, no DB access, no `try/catch` (throwing reaches `errorHandler`). |
| `src/services/` | Business logic and domain errors | Never touch `req` or `res`. Throw `AppError` subclasses. Compose repositories. |
| `src/repositories/` | Data access — Drizzle queries, filter registries | The **only** place `db` is imported. Returns rows and row types, never HTTP concepts. |
| `src/repositories/schema/` | Drizzle table definitions, enums, indexes | One file per table, re-exported from `schema/index.ts` (which `config/db.ts` feeds to `drizzle()`). |
| `src/config/` | Process-level wiring: `env`, `logger`, `db` pool, feature config | Built once at import time. Boot-time invariants throw here (see `config/example.config.ts`). |
| `src/utils/` | Framework-agnostic helpers: `appError`, `pagination`, `filterRegistry`, `jwt`, `auth` | Importable from anywhere. Must not import a service, controller, or repository. |

Top-level entry points: `src/app.ts` builds the `Express` instance (helmet, cors,
body parsers, morgan → Winston, the root router, then `notFoundHandler` and
`errorHandler` last). `src/server.ts` listens and handles graceful shutdown.
`src/migrate.ts` runs Drizzle migrations.

## Dependency direction

```
routes → validation → controllers → services → repositories → schema
                                                    ↑
                          config, utils ────────────┘
```

Imports flow left to right and never back. A repository must not import a
service; a service must not import a controller; nothing outside
`src/repositories/` imports `db`. `config/` and `utils/` are leaves that any
layer may use.

Cross-module imports use the `@/*` alias with a `.js` specifier
(`import { db } from '@/config/db.js'`) — NodeNext resolution, rewritten at build
time by `tsc-alias`. Modules are flat collections of named arrow-const exports,
consumed with a namespace import: `import * as exampleService from '@/services/example.service.js'`.

## Request lifecycle

Take `POST /v1/examples`:

1. `app.ts` → `rootRouter` → `v1Router` → `exampleRouter` (`routes/v1/example.routes.ts`).
2. `requireHeader('x-request-id')` (`middleware/example.middleware.ts`) rejects a missing header with `BadRequestError`.
3. `validateCreateBody` (`validation/example.validation.ts`) parses `req.body` through Zod and **replaces** it with the parsed value. Everything downstream trusts the type.
4. `createExample` (`controllers/example.controller.ts`) reads `req.body`, resolves claims via `getRequestClaims`, calls the service, logs, responds `201`.
5. `exampleService.createExample` enforces the rule — a live example with that name may not already exist — throwing `ConflictError` if it does.
6. `exampleRepository.create` inserts through Drizzle and returns the row.
7. Any thrown value skips the rest and lands in `errorHandler`, which renders `{ error: { message, status, data? } }`. `AppError` subclasses carry their own status; anything else is a 500, and its message is hidden in production.

Reads are shaped the same way, plus the pagination envelope:
`{ data, meta: { page, pageSize, total, totalPages } }`, built by
`buildMeta` in `utils/pagination.ts`.

## Conventions worth knowing before you write code

- **Validate once, at the edge.** `validate(schema, 'body' | 'query' | 'params')` (`middleware/validate.ts`) overwrites the request property with the parsed data and narrows the handler's type. Never re-validate in a service. Query params arrive as strings — use `z.coerce`.
- **Errors are a taxonomy, not strings.** Services throw `NotFoundError`, `ConflictError`, `BadRequestError`, … from `utils/appError.ts`, each with a message specific enough for a client to display (*which* name conflicted, *which* id was missing). A bare `Error` means "should never happen" and is reserved for repositories.
- **Deletes are soft.** Rows carry `deletedAt`; every read filters `isNull(deletedAt)`, and uniqueness is enforced by a partial index over live rows only (see `example_name_live_idx`). Re-creating the same key is the revival path.
- **Filters are declared, not hand-written.** `createFilterRegistry` (`utils/filterRegistry.ts`) takes `{ schema, toCondition }` per query param and returns a Zod shape for the validation layer plus a `buildWhere` for the repository — one declaration, both ends.
- **Auth is a seam.** `getRequestClaims` (`utils/auth.ts`) *decodes* a bearer token that an upstream gateway has already verified; `utils/jwt.ts` does not check signatures. Add verification here if this service is ever exposed directly.
- **Logging is structured.** `logger` from `config/logger.ts`, metadata as a second argument: `logger.error('msg', { err })`. Never `console.*`.
- **Config is validated at boot.** `config/env.ts` parses `process.env` through `@t3-oss/env-core`; the process fails to start on a bad environment rather than failing on the first request.

## Adding a resource

Working outward from the data, for a resource named `widget`:

1. `src/repositories/schema/widget.ts` — the `pgTable`, its enums and indexes. Re-export it from `schema/index.ts`.
2. `pnpm db:generate` then `pnpm db:migrate` — the SQL lands in `drizzle/`. Commit it.
3. `src/repositories/widget.filters.ts` — `createFilterRegistry({ ... })` for the query params the list endpoint accepts.
4. `src/repositories/widget.repository.ts` — `findAll`, `findById`, `create`, `update`, `softDelete`. Export `type Widget = typeof widgets.$inferSelect`.
5. `src/services/widget.service.ts` — business rules, `AppError` subclasses, pagination envelope via `buildMeta`.
6. `src/validation/widget.validation.ts` — body/query schemas, `validate(...)` middleware, and the `z.infer` request aliases the controller imports.
7. `src/controllers/widget.controller.ts` — one thin handler per route.
8. `src/routes/v1/widget.routes.ts` — the router; mount it in `routes/v1/index.ts` under the kebab-case plural segment `/widgets`.
9. Tests: unit tests for anything with branching logic in `tests/unit/`, an endpoint test in `tests/integration/`. Run `pnpm test`.

Mirror `example.*` at each step — it is a complete, working instance of exactly this sequence.

## Removing the example slice

The `example.*` files exist to demonstrate the layering and are meant to be
deleted once you have a real resource. Remove them together:

```bash
rm src/routes/v1/example.routes.ts \
   src/controllers/example.controller.ts \
   src/services/example.service.ts \
   src/repositories/example.repository.ts \
   src/repositories/example.filters.ts \
   src/repositories/schema/example.ts \
   src/validation/example.validation.ts \
   src/middleware/example.middleware.ts \
   src/config/example.config.ts \
   src/utils/example.util.ts \
   tests/unit/example.util.test.ts \
   tests/integration/example.test.ts
```

Then clean up the three references that outlive the files:

- `src/routes/v1/index.ts` — drop the `exampleRouter` import and its `v1Router.use('/examples', …)` line.
- `src/repositories/schema/index.ts` — drop `export * from './example.js'`.
- `src/config/env.ts` — drop `EXAMPLE_FEATURE_ENABLED`, and remove it from `.env` and `.env.example`.

Drop the example's table with a fresh migration (`pnpm db:generate`) rather than
editing the existing one, and delete the Bruno requests under `bruno/v1/`.
Confirm with `pnpm typecheck && pnpm test`.

## Supporting directories

| Directory | Purpose |
|---|---|
| `tests/unit/` | Pure-function tests — utils, the `validate` factory, the filter registry. |
| `tests/integration/` | Endpoint tests driving the app through supertest. |
| `drizzle/` | Generated migration SQL and journal. Generated, never hand-edited; always committed. |
| `bruno/` | Bruno API collection — one request per endpoint, plus the `Local` environment. |

## Docker

| File | Purpose |
| --- | --- |
| `docker/db.compose.yml` | Local Postgres only. Driven by `pnpm db:up` / `pnpm db:down`. |
| `Dockerfile` | Production API image (`NODE_ENV=prod`, non-root, healthcheck on `/v1/health`). |
| `docker/migrate.dockerfile` | One-shot migration image running `dist/migrate.js`. Needs only `DATABASE_URL`; exits non-zero on failure. |
| `docker-compose.yml` | Full stack: postgres → migrate → api. `docker compose up --build`. |

In CI, build from the repo root and run the migration image before deploying the API:

    docker build -f docker/migrate.dockerfile -t <registry>/express-primer-migrate .
    docker run --rm -e DATABASE_URL=$DATABASE_URL <registry>/express-primer-migrate
| `scripts/` | Reserved for pipeline and utility scripts (CI helpers, maintenance tasks). Nothing lives here yet. |
| `dist/` | Build output from `pnpm build`. Git-ignored. |
