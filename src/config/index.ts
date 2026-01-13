import { validateEnv } from './env.js';

/**
 * Config layer centralizado e tipado
 * Validado em startup, exportado como readonly
 */
const config = {
  ...validateEnv(),
} as const;

export default config;
