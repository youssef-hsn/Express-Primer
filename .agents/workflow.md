# Workflow

## Workspace

- **Work in the existing checkout, on the current branch.** Never create git
  worktrees (`git worktree add`, `.worktrees/`, agent isolation modes).
- **Don't create branches, push or open PRs** unless asked.

## Commands

| Task | Command |
|---|---|
| Dev server | `pnpm dev` |
| Format + lint (fix) | `pnpm check:fix` |
| Type check | `pnpm typecheck` |
| Tests | `pnpm test` |
| Local Postgres | `pnpm db:up` / `pnpm db:down` |
| Generate / apply migrations | `pnpm db:generate` / `pnpm db:migrate` |

**Done means** `pnpm check && pnpm typecheck && pnpm test` passes. If a step
fails, report the output. Don't claim success.

## Dependencies

- **pnpm only.** Never npm or yarn, and never commit their lockfiles.
- **Change packages only through the CLI**: `pnpm add <pkg>`,
  `pnpm add -D <pkg>`, `pnpm up --latest <pkg>`, `pnpm remove <pkg>`. Never
  type a dependency or version into `package.json`.
- **This template tracks the latest releases.** When you upgrade, read the
  package's changelog or migration guide for breaking changes, apply them, and
  run the full verification.
- **Check current documentation** before using a library API. Your training
  data may be out of date.
