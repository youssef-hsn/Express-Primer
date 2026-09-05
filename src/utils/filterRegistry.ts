import { and, type SQL } from 'drizzle-orm';
import { type ZodType, z } from 'zod';

export type FilterDef<V> = {
  schema: ZodType<V>;
  toCondition: (value: NonNullable<V>) => SQL | undefined;
};

export function createFilterRegistry<V extends Record<string, unknown>>(
  filters: {
    [K in keyof V]: FilterDef<V[K]>;
  },
) {
  const keys = Object.keys(filters) as (keyof V)[];

  const shape = {} as { [K in keyof V]: z.ZodOptional<ZodType<V[K]>> };
  for (const key of keys) {
    shape[key] = filters[key].schema.optional();
  }
  const schema = z.object(shape);

  const buildWhere = (values: Partial<V>): SQL | undefined => {
    const conditions: SQL[] = [];
    for (const key of keys) {
      const value = values[key];
      if (value === undefined || value === null) continue;
      const condition = filters[key].toCondition(value as NonNullable<V[typeof key]>);
      if (condition) conditions.push(condition);
    }
    return conditions.length > 0 ? and(...conditions) : undefined;
  };

  return { schema, buildWhere };
}
