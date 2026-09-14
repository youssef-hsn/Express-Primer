# Naming

- **camelCase for identifiers and file names**: `filterRegistry.ts`,
  `errorHandler.ts`. Dot-separated layer suffixes stay: `.repository.ts`,
  `.service.ts`, `.controller.ts`, `.routes.ts`, `.validation.ts`, `.filters.ts`.
- **kebab-case only in URL segments.** Resources are plural: `/v1/widgets`,
  `/v1/order-items`.
- **Booleans start with `is`, `has` or `can`**: `isProduction`, `hasAccess`.
- **UPPER_SNAKE for constants**, with numeric separators for large numbers:
  `const SHUTDOWN_TIMEOUT_MS = 10_000`.
- **PascalCase for types and classes**: `PaginationMeta`, `NotFoundError`.
