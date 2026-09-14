# Git

## Commit messages

Use Conventional Commits, and always include a scope:

```
<type>(<scope>): <Subject>
```

- **type**: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `build`, `ci`, `chore`.
- **scope**: kebab-case, naming the area touched: `app-error`,
  `filter-registry`, `docker`, `db`. No unscoped commits.
- **Subject**: starts with a capital letter, reads as a sentence in the
  imperative mood, and has no trailing period.
- **Body** (optional): explain *why*, not what.

Examples from this repo:

```
feat(filter-registry): Add typed query-param to Drizzle WHERE factory
fix(docker): Mount Postgres 18 data at /var/lib/postgresql
chore(tooling): Set up pnpm, TypeScript, Biome and package scripts
```

## Rules

- **Commit only when asked.**
- **One logical change per commit.** Split unrelated changes.
- **Stage specific paths**, not `git add -A`, so stray files stay out.
- **Never** `--no-verify`, never amend or force-push pushed commits, never push unless asked.
