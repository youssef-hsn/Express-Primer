import { eq, ilike, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { exampleStatus, examples } from '@/repositories/schema/example.js';
import { createFilterRegistry } from '@/utils/filterRegistry.js';

export const exampleFilters = createFilterRegistry({
  q: {
    schema: z.string().min(1),
    toCondition: (value) =>
      or(ilike(examples.name, `%${value}%`), ilike(sql`${examples.id}::text`, `%${value}%`)),
  },
  status: {
    schema: z.enum(exampleStatus),
    toCondition: (value) => eq(examples.status, value),
  },
});

export type ExampleFilters = z.infer<typeof exampleFilters.schema>;
