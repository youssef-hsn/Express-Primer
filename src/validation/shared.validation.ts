import { z } from 'zod';
import { validate } from '@/middleware/validate.js';

const paramsWithUUID = z.object({ id: z.uuid() });

export const validateIdParam = validate(paramsWithUUID, 'params');

export type ParamsWithUUID = z.infer<typeof paramsWithUUID>;
