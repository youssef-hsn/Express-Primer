# TypeScript

- **Exports are arrow consts**: `export const getExampleById = async (id: string) => {}`.
  Exceptions: overloaded functions, which TypeScript can only declare with
  `function` (see `src/middleware/validate.ts`), and error classes.
- **`type` over `interface`.** Use `interface` only for declaration merging or
  module augmentation, like `Express.Request` in `src/utils/auth.ts`.
- **Derive types from schemas**: `type TokenClaims = z.infer<typeof tokenClaims>`.
  Export both the schema and the type.
- **Use `satisfies`** to check a config object or lookup table without widening its type.
- **Loose absence checks only**: `== null`, `!= null`, `??`. Never branch on
  `null` vs `undefined`.
- **No `any`.** `noUncheckedIndexedAccess` is on, so handle the `undefined`.
  Use `import type` for type-only imports (Biome enforces this).
- **Add generics only when there's real reuse.** Don't parametrize something with one caller.
- **Modules are flat collections of named exports.** Use classes only for
  genuinely stateful things like sockets, registries and pools.
- **Imports** use the `@/` alias with a `.js` specifier (NodeNext):
  `import { db } from '@/config/db.js'`.
