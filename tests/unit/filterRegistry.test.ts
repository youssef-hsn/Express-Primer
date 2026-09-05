import { eq, ilike, type SQL } from 'drizzle-orm';
import { PgDialect, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { createFilterRegistry } from '@/utils/filterRegistry.js';

const widgets = pgTable('widget', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  colour: varchar('colour', { length: 32 }).notNull(),
});

const widgetFilters = createFilterRegistry({
  name: {
    schema: z.string().min(1),
    toCondition: (value) => ilike(widgets.name, `%${value}%`),
  },
  colour: {
    schema: z.string().min(1),
    toCondition: (value) => eq(widgets.colour, value),
  },
});

const dialect = new PgDialect();
const compile = (where: SQL | undefined) => (where == null ? undefined : dialect.sqlToQuery(where));

describe('createFilterRegistry — schema', () => {
  it('makes every filter optional', () => {
    expect(widgetFilters.schema.parse({})).toEqual({});
  });

  it('keeps a supplied filter value', () => {
    expect(widgetFilters.schema.parse({ name: 'bolt' })).toEqual({ name: 'bolt' });
  });

  it('enforces each filter own schema', () => {
    expect(widgetFilters.schema.safeParse({ name: '' }).success).toBe(false);
  });

  it('exposes a shape that can be merged into a query schema', () => {
    expect(Object.keys(widgetFilters.schema.shape).sort()).toEqual(['colour', 'name']);
  });
});

describe('createFilterRegistry — buildWhere', () => {
  it('returns undefined when nothing is filtered', () => {
    expect(widgetFilters.buildWhere({})).toBeUndefined();
  });

  it('ignores undefined and null values', () => {
    expect(widgetFilters.buildWhere({ name: undefined, colour: undefined })).toBeUndefined();
  });

  it('builds a single condition with its parameter bound', () => {
    const query = compile(widgetFilters.buildWhere({ colour: 'red' }));
    expect(query?.params).toEqual(['red']);
    expect(query?.sql).toContain('"colour"');
  });

  it('ANDs multiple conditions together in declaration order', () => {
    const query = compile(widgetFilters.buildWhere({ colour: 'red', name: 'bolt' }));
    expect(query?.sql).toContain(' and ');
    expect(query?.params).toEqual(['%bolt%', 'red']);
  });
});
