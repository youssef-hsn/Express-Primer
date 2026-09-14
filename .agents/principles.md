# Principles

- **No comments.** Names and small functions carry the meaning. A comment is
  allowed only for a *why* the code can't express, such as a workaround or a
  spec quirk, and then it's one line. Never narrate *what* the code does.
- **Small, cohesive files.** One concern per file. Keep tightly coupled code
  together, but don't split just to split.
- **Validate at the boundaries.** Parse untrusted input once at the edge with
  Zod, then trust the types inside. Never re-validate downstream.
- **Guard clauses over nesting.** Handle edge cases with an early `return` or
  `throw`. Keep the happy path flat and last.
- **The toolchain enforces style.** Biome owns formatting, import order and
  lint. Run `pnpm check:fix`; never hand-format.
- **No barrels.** Import from the source file. Use the `@/` alias across
  modules and relative paths within one. A `../../..` chain is a smell.
- **Errors speak human.** Every error response carries a specific, actionable
  message that says *what* conflicted, *which* field, *which* record. For
  example: `An example named 'foo' already exists`, not `Conflict`.
- **Deletes are soft by default.** Use a `deletedAt` timestamp, filter it out
  of every read, and revive by re-creating the same key. Hard delete only
  disposable rows (logs, junction rows, caches) or data you must erase for
  compliance, and say which case it is.
- **Keep the scope tight.** Build what the task needs. A pattern goes into
  `src/utils/` only once it's proven and reusable.
