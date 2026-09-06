import { Router } from 'express';
import {
  createExample,
  deleteExample,
  getExample,
  listExamples,
  updateExample,
} from '@/controllers/example.controller.js';
import { requireHeader } from '@/middleware/example.middleware.js';
import {
  validateCreateBody,
  validateListQuery,
  validateUpdateBody,
} from '@/validation/example.validation.js';
import { validateIdParam } from '@/validation/shared.validation.js';

export const exampleRouter = Router();

exampleRouter.get('/', validateListQuery, listExamples);
exampleRouter.post('/', requireHeader('x-request-id'), validateCreateBody, createExample);
exampleRouter.get('/:id', validateIdParam, getExample);
exampleRouter.patch('/:id', validateIdParam, validateUpdateBody, updateExample);
exampleRouter.delete('/:id', validateIdParam, deleteExample);
