import { sql } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

export const exampleStatus = ['active', 'archived'] as const;
export type ExampleStatus = (typeof exampleStatus)[number];

export const exampleStatusEnum = pgEnum('example_status', exampleStatus);

export const examples = pgTable(
  'example',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    status: exampleStatusEnum('status').notNull().default('active'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('example_name_live_idx').on(table.name).where(sql`${table.deletedAt} is null`),
  ],
);
