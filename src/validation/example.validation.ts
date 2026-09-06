import type { Request } from 'express';
import { z } from 'zod';
import { validate } from '@/middleware/validate.js';
import { exampleFilters } from '@/repositories/example.filters.js';
import { exampleStatus } from '@/repositories/schema/example.js';
import { paginationSchema } from '@/utils/pagination.js';
import type { ParamsWithUUID } from '@/validation/shared.validation.js';

const listQuerySchema = paginationSchema.extend(exampleFilters.schema.shape);

const createExampleBody = z.object({
  name: z.string().min(1).max(255),
  status: z.enum(exampleStatus).optional(),
  notes: z.string().max(2000).nullable().optional(),
});

const updateExampleBody = z
  .object({
    name: z.string().min(1).max(255).optional(),
    status: z.enum(exampleStatus).optional(),
    notes: z.string().max(2000).nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });

export const validateListQuery = validate(listQuerySchema, 'query');
export const validateCreateBody = validate(createExampleBody, 'body');
export const validateUpdateBody = validate(updateExampleBody, 'body');

export type ListExamplesRequest = Request<
  unknown,
  unknown,
  unknown,
  z.infer<typeof listQuerySchema>
>;
export type CreateExampleRequest = Request<unknown, unknown, z.infer<typeof createExampleBody>>;
export type UpdateExampleRequest = Request<
  ParamsWithUUID,
  unknown,
  z.infer<typeof updateExampleBody>
>;
