import type { Request, Response } from 'express';
import { logger } from '@/config/logger.js';
import * as exampleService from '@/services/example.service.js';
import { getRequestClaims } from '@/utils/auth.js';
import type {
  CreateExampleRequest,
  ListExamplesRequest,
  UpdateExampleRequest,
} from '@/validation/example.validation.js';

export const listExamples = async (req: ListExamplesRequest, res: Response): Promise<void> => {
  const { page, pageSize, ...filters } = req.query;
  const result = await exampleService.listExamples({ page, limit: pageSize, ...filters });
  res.status(200).json(result);
};

export const getExample = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const found = await exampleService.getExampleById(id as string);
  res.status(200).json({ data: found });
};

export const createExample = async (req: CreateExampleRequest, res: Response): Promise<void> => {
  const claims = getRequestClaims(req);
  const created = await exampleService.createExample(req.body);
  logger.info('Example created', { id: created.id, by: claims.sub });
  res.status(201).json({ data: created });
};

export const updateExample = async (req: UpdateExampleRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const updated = await exampleService.updateExample(id as string, req.body);
  res.status(200).json({ data: updated });
};

export const deleteExample = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await exampleService.deleteExample(id as string);
  res.status(204).send();
};
