import type { ExampleFilters } from '@/repositories/example.filters.js';
import type { Example } from '@/repositories/example.repository.js';
import * as exampleRepository from '@/repositories/example.repository.js';
import type { ExampleStatus } from '@/repositories/schema/example.js';
import { ConflictError, NotFoundError } from '@/utils/appError.js';
import { buildMeta, type PaginatedResult, type PaginationParams } from '@/utils/pagination.js';

type CreateExampleInput = {
  name: string;
  status?: ExampleStatus;
  notes?: string | null;
};

type UpdateExampleInput = {
  name?: string;
  status?: ExampleStatus;
  notes?: string | null;
};

export const listExamples = async (
  params: PaginationParams & ExampleFilters,
): Promise<PaginatedResult<Example>> => {
  const { rows, total } = await exampleRepository.findAll(params);
  return { data: rows, meta: buildMeta(params.page, params.limit, total) };
};

export const getExampleById = async (id: string): Promise<Example> => {
  const found = await exampleRepository.findById(id);
  if (found === undefined) throw new NotFoundError(`Example not found: ${id}`);
  return found;
};

export const createExample = async (input: CreateExampleInput): Promise<Example> => {
  const existing = await exampleRepository.findActiveByName(input.name);
  if (existing !== undefined) {
    throw new ConflictError(`An example named '${input.name}' already exists`);
  }
  return exampleRepository.create(input);
};

export const updateExample = async (id: string, input: UpdateExampleInput): Promise<Example> => {
  if (input.name != null) {
    const clash = await exampleRepository.findActiveByName(input.name);
    if (clash !== undefined && clash.id !== id) {
      throw new ConflictError(`An example named '${input.name}' already exists`);
    }
  }
  const updated = await exampleRepository.update(id, input);
  if (updated === undefined) throw new NotFoundError(`Example not found: ${id}`);
  return updated;
};

export const deleteExample = async (id: string): Promise<void> => {
  const removed = await exampleRepository.softDelete(id);
  if (removed === undefined) throw new NotFoundError(`Example not found: ${id}`);
};
