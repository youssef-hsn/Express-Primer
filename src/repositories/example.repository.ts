import { and, count, desc, eq, isNull } from 'drizzle-orm';
import { db } from '@/config/db.js';
import { type ExampleFilters, exampleFilters } from '@/repositories/example.filters.js';
import { type ExampleStatus, examples } from '@/repositories/schema/example.js';
import type { PaginationParams } from '@/utils/pagination.js';

export type Example = typeof examples.$inferSelect;

type CreateExampleData = {
  name: string;
  status?: ExampleStatus;
  notes?: string | null;
};

type UpdateExampleData = {
  name?: string;
  status?: ExampleStatus;
  notes?: string | null;
};

const notDeleted = isNull(examples.deletedAt);

export const findAll = async ({
  page,
  limit,
  ...filters
}: PaginationParams & ExampleFilters): Promise<{ rows: Example[]; total: number }> => {
  const offset = (page - 1) * limit;
  const where = and(notDeleted, exampleFilters.buildWhere(filters));
  const [rows, [countRow]] = await Promise.all([
    db
      .select()
      .from(examples)
      .where(where)
      .orderBy(desc(examples.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(examples).where(where),
  ]);
  return { rows, total: countRow?.total ?? 0 };
};

export const findById = async (id: string): Promise<Example | undefined> => {
  const rows = await db
    .select()
    .from(examples)
    .where(and(eq(examples.id, id), notDeleted))
    .limit(1);
  return rows[0];
};

export const findActiveByName = async (name: string): Promise<Example | undefined> => {
  const rows = await db
    .select()
    .from(examples)
    .where(and(eq(examples.name, name), notDeleted))
    .limit(1);
  return rows[0];
};

export const create = async (data: CreateExampleData): Promise<Example> => {
  const rows = await db.insert(examples).values(data).returning();
  const row = rows[0];
  if (!row) throw new Error('Insert returned no rows');
  return row;
};

export const update = async (id: string, data: UpdateExampleData): Promise<Example | undefined> => {
  const rows = await db
    .update(examples)
    .set(data)
    .where(and(eq(examples.id, id), notDeleted))
    .returning();
  return rows[0];
};

export const softDelete = async (id: string): Promise<Example | undefined> => {
  const rows = await db
    .update(examples)
    .set({ deletedAt: new Date() })
    .where(and(eq(examples.id, id), notDeleted))
    .returning();
  return rows[0];
};
