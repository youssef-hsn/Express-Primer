# Philosophy

Express Primer is where I start every backend project. It isn't a framework, a
generator or a product. It's a starting point I trust, shared openly for the
love of the game.

## A living template

Most templates are frozen the day they're published. This one isn't.

- **It tracks the latest releases.** Dependencies are upgraded as new versions
  ship, and breaking changes are handled here once, not again in every new project.
- **It follows current best practice.** When a better way to do something
  shows up, the template changes.
- **It collects patterns that proved themselves.** When a utility earns its
  place in a real project (the error taxonomy, the `validate` factory, the
  filter registry, the pagination envelope), it moves here, so the next
  project gets it on day one.

## What it values

**Explicit over clever.** Requests flow one way: route → validation →
controller → service → repository. You can trace any endpoint by reading files
in order. No decorators, no DI container, no magic.

**Validate once, then trust.** Input is parsed at the edge with Zod. Inside,
the types are true, so nothing checks twice.

**Errors are for humans.** An error names what went wrong: which field, which
record, which conflict. The client should be able to show the message as is.

**Data is not thrown away lightly.** Deletes are soft by default. Rows are
hidden, not destroyed.

**Tools enforce style.** Biome handles formatting and lint, and TypeScript
runs in strict mode. Nobody argues about style in review.

**Code explains itself.** Good names and small functions instead of comments.
A comment is only for a *why* the code can't show.

**Fail at boot, not at 3 a.m.** Environment variables are validated when the
process starts. A bad config never serves a request.

## What it is not

- **Not a framework.** There's nothing to install or extend. You copy it and
  it's yours.
- **Not a full product.** Auth is a seam, not a provider. Deployment is a
  Dockerfile, not a platform.
- **Not neutral.** It reflects one engineer's opinions. Fork it and change
  whatever doesn't suit you.

## The example slice

The `example.*` files show every layer working together, including validation,
filters, soft deletes, errors and tests. They're meant to be read, copied and
then deleted. See [architecture.md](architecture.md#removing-the-example-slice).
