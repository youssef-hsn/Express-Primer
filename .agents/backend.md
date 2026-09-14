# Backend

[docs/architecture.md](../docs/architecture.md) has the full layer map. These
are the rules to hold on to while you write code.

## Layers

`route → validation → controller → service → repository`. Imports flow one way only.

- **Controllers are thin.** Read `req`, call one service, set the status, send
  JSON. No business logic and no `try/catch`, because thrown errors already
  reach `errorHandler`.
- **Services own the business rules.** They never touch `req` or `res`.
- **Repositories own data access.** They're the only place `db` is imported.
- **Consume modules through a namespace import**:
  `import * as exampleService from '@/services/example.service.js'`.

## Errors

- **Services** throw domain failures as `AppError` subclasses from
  `src/utils/appError.ts`: `NotFoundError`, `ConflictError`, `BadRequestError`, …
- **Repositories** throw a bare `Error` only for should-never-happen invariants.
- **`src/middleware/errorHandler.ts`** formats every error response as
  `{ error: { message, status, data? } }`. Never hand-roll error JSON.

## Validation

- **Validate in route middleware**, using the `validate(schema, 'body' | 'query' | 'params')`
  factory placed before the controller. It replaces the request property with
  the parsed value.
- **Export typed request aliases** from the resource's `*.validation.ts`.
- **Use `z.coerce` for query params**, because they arrive as strings.
- **Declare list filters once** with `createFilterRegistry` in `*.filters.ts`.

## Data

- **Soft deletes**: a `deletedAt` column, `isNull(deletedAt)` on every read,
  and uniqueness enforced by a partial index over live rows.
- **Schema changes**: edit `src/repositories/schema/`, then `pnpm db:generate`.
  Commit the generated SQL and never hand-edit `drizzle/`.
- **Enriched read models** get hand-written mappers with explicit return types.
  No generic DTO layer.
- **Paginated lists** return `{ data, meta: { page, pageSize, total, totalPages } }`,
  built with `buildMeta` from `src/utils/pagination.ts`.

## Config and logging

- **New environment variables** go in `src/config/env.ts` and `.env.example`.
  The process should fail at boot, not on the first request.
- **Log with `logger`** from `src/config/logger.ts`, passing metadata as the
  second argument: `logger.error('Payment failed', { err, orderId })`. Never use `console.*`.

## Tests

- **`tests/unit/`** covers anything with branching logic.
- **`tests/integration/`** drives endpoints through supertest and `createApp()`.
- **A new resource** gets both, following `example.*`.
