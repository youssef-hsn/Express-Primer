# Express Primer

A clean starting point for Express + TypeScript HTTP APIs, kept up to date
with the latest package releases and the patterns I reach for in every backend project.

Read [why it exists](docs/philosophy.md).

## What's inside

| Area | Choice |
|---|---|
| Runtime | Node.js 22+, Express 5, TypeScript (strict, NodeNext) |
| Validation | Zod 4, with environment validated at boot via `@t3-oss/env-core` |
| Database | PostgreSQL with Drizzle ORM and migrations |
| Logging | Winston, with morgan request logs routed through it |
| Security | helmet, cors |
| Tests | Vitest and supertest |
| Tooling | pnpm, Biome, Bruno API collection, Docker |

Ready-made patterns:

- **Error taxonomy.** `NotFoundError`, `ConflictError`, … rendered by one central error handler.
- **`validate` middleware.** Parses the body, query or params once and types the handler.
- **Filter registry.** Declare a query filter once and get both the Zod schema and the SQL `WHERE`.
- **Pagination envelope.** `{ data, meta: { page, pageSize, total, totalPages } }`.
- **Soft deletes.** Partial unique indexes over live rows.
- **Auth seam.** Reads claims from a bearer token verified by an upstream gateway.
- **Graceful shutdown** and a `/v1/health` endpoint.
- **A worked `example` resource** across every layer, meant to be deleted.

## Quick start

You need Node.js 22+ (see `.nvmrc`), pnpm (`corepack enable`) and Docker.

```bash
git clone --depth 1 https://github.com/youssef-hsn/Express-Primer.git my-api
cd my-api
rm -rf .git && git init

pnpm install
cp .env.example .env
pnpm db:up
pnpm db:migrate
pnpm dev
```

```bash
curl http://localhost:3000/v1/health
```

## Starting a new project from it

1. Rename `name` and `description` in `package.json`.
2. Build your first resource by following
   [Adding a resource](docs/architecture.md#adding-a-resource).
3. Delete the example slice with
   [Removing the example slice](docs/architecture.md#removing-the-example-slice).
4. Replace the requests in `bruno/` with your own.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start with watch mode |
| `pnpm build` / `pnpm start` | Compile to `dist/` / run the build |
| `pnpm test` | Run the test suite |
| `pnpm typecheck` | Type-check without emitting |
| `pnpm check` / `pnpm check:fix` | Biome format and lint / apply fixes |
| `pnpm db:up` / `pnpm db:down` | Start / stop local Postgres |
| `pnpm db:generate` / `pnpm db:migrate` | Create / apply migrations |
| `pnpm db:studio` | Open Drizzle Studio |

## Project layout

```
src/
  routes/        URL → middleware + controller
  validation/    Zod schemas and typed requests
  controllers/   thin request/response adapters
  services/      business logic
  repositories/  data access and Drizzle schema
  middleware/    validate, errorHandler, notFound
  config/        env, logger, db
  utils/         framework-agnostic helpers
tests/           unit and integration
drizzle/         generated migrations
bruno/           API collection
```

The full guide, covering layer rules, the request lifecycle and conventions,
is [docs/architecture.md](docs/architecture.md).

## Docker

```bash
docker compose up --build
```

This runs Postgres, then migrations, then the API. See
[architecture.md → Docker](docs/architecture.md#docker) for the production images.

## Working with AI agents

[AGENTS.md](AGENTS.md) points coding agents to short rule files in
[.agents/](.agents/). They cover code style, backend conventions, commit
messages and how to handle secrets.

AI tools look for instructions in different places, so set this up for the one
you use. For example, Claude Code reads `CLAUDE.md` rather than `AGENTS.md`.
Add a `CLAUDE.md` containing the single line `@AGENTS.md` to import it, and
put any Claude-specific notes next to that line.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[The Unlicense](LICENSE). This is public domain, so take it and make it yours.
