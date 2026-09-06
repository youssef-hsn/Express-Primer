import { env } from '@/config/env.js';

export type ExampleConfig = {
  featureEnabled: boolean;
};

const buildExampleConfig = (): ExampleConfig => {
  const featureEnabled = env.EXAMPLE_FEATURE_ENABLED ?? false;

  if (featureEnabled && env.NODE_ENV === 'prod') {
    throw new Error(
      'EXAMPLE_FEATURE_ENABLED must not be set when NODE_ENV=prod. It exists only to demonstrate a boot-time configuration guard.',
    );
  }

  return { featureEnabled };
};

export const exampleConfig = buildExampleConfig();
