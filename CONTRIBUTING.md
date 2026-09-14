# Contributing

Thanks for stopping by. Express Primer is a personal template shared for the
love of the game, and contributions that keep it sharp are welcome.

## What helps most

- **Dependency upgrades**, including any code changes a new major version needs.
- **Best-practice updates** where Express, TypeScript, Zod or Drizzle have moved on.
- **Bug fixes** in the existing patterns.
- **Utility patterns** that have proven themselves in a real project. Please
  open an issue before starting one (see below).

The goal is a starting point, not a framework, so features most projects
wouldn't keep are unlikely to be accepted. [docs/philosophy.md](docs/philosophy.md)
explains why.

## Setup

```bash
pnpm install
cp .env.example .env
pnpm db:up
pnpm db:migrate
```

Use pnpm only. Add and upgrade packages with `pnpm add` / `pnpm up --latest`,
never by editing `package.json` by hand.

## Before opening a pull request

```bash
pnpm check && pnpm typecheck && pnpm test
```

All three must pass.

## Conventions

The rules live in [.agents/](.agents/). They're written for AI agents but
apply to everyone:

- [principles](.agents/principles.md): no comments, small files, guard
  clauses, validate at the edge, human error messages, soft deletes
- [naming](.agents/naming.md) and [typescript](.agents/typescript.md)
- [backend](.agents/backend.md): layers, errors, validation, data, tests

For structure, [docs/architecture.md](docs/architecture.md) is the reference.
When in doubt, copy how the `example.*` slice does it.

## Commits

Use scoped [Conventional Commits](https://www.conventionalcommits.org/), with
the subject starting with a capital letter:

```
feat(pagination): Add cursor-based pagination helper
fix(error-handler): Hide internal messages in stg as well as prod
```

Keep each commit to one logical change. The details are in [.agents/git.md](.agents/git.md).

## Adding a utility pattern

A new pattern should:

1. **Solve a problem that comes up in most backend projects.**
2. **Be proven in a real codebase**, not written speculatively.
3. **Live in the right layer**: framework-agnostic helpers in `src/utils/`,
   cross-cutting middleware in `src/middleware/`.
4. **Come with unit tests** in `tests/unit/`.
5. **Be shown in use in the `example.*` slice** if it touches a request.
6. **Get a line in [docs/architecture.md](docs/architecture.md)** so people can find it.

## Pull requests

- **Keep each PR to one topic.** Say *why* the change matters, not just what it does.
- **Update the docs** in the same PR when behavior or conventions change.

## License

By contributing, you agree your work is released under [the Unlicense](LICENSE),
into the public domain.
