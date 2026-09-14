# AGENTS.md

Instructions for AI coding agents working in this repository. People should
start with [README.md](README.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

Express Primer is a template for Express + TypeScript HTTP APIs. Every new
project starts as a copy of this repo, so the code here should be the cleanest
version of each pattern.

## Before you write code

1. Read [docs/architecture.md](docs/architecture.md). It's the source of truth
   for the layer map, import direction and how to add a resource.
2. Read the `.agents/` files that match your task (see the table below).
3. Follow the `example.*` slice. It's a complete, working reference for every layer.

## Non-negotiables

- **Never read `.env` files.** Set values blind, following [.agents/secrets.md](.agents/secrets.md).
- **Never use git worktrees.** Work in the current checkout on the current
  branch. Don't run `git worktree add`, don't create `.worktrees/`, and don't
  turn on any worktree or isolation mode in your agent tool.
- **pnpm only.** Add, upgrade and remove packages with `pnpm add` / `pnpm up` /
  `pnpm remove`. Never hand-edit dependency versions in `package.json`.
- **No comments** unless it's one line explaining *why* something the code can't express.
- **Commit only when asked**, as scoped Conventional Commits ([.agents/git.md](.agents/git.md)).
- **Verify before you say it's done:** `pnpm check && pnpm typecheck && pnpm test`.

## Rule files

| Read | When |
|---|---|
| [.agents/principles.md](.agents/principles.md) | Always. It's the clean-code core. |
| [.agents/naming.md](.agents/naming.md) | Naming files, identifiers, routes |
| [.agents/typescript.md](.agents/typescript.md) | Writing any TypeScript |
| [.agents/backend.md](.agents/backend.md) | Touching routes, controllers, services, repositories, errors, tests |
| [.agents/workflow.md](.agents/workflow.md) | Running commands, changing dependencies or migrations |
| [.agents/git.md](.agents/git.md) | Writing a commit message |
| [.agents/secrets.md](.agents/secrets.md) | Anything involving environment variables |

## Precedence

1. What the user explicitly asks for.
2. `docs/architecture.md` on structure.
3. `.agents/` on style and conventions.
4. Your own defaults.

New code follows the rules. If existing code doesn't match a rule, leave it
unless you're already editing that file for another reason, and even then don't
mass-migrate it.
