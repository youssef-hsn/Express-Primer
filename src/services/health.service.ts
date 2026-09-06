export type HealthStatus = {
  status: 'ok';
  uptime: number;
  timestamp: string;
};

export const getHealthStatus = (): HealthStatus => ({
  status: 'ok',
  uptime: process.uptime(),
  timestamp: new Date().toISOString(),
});
