import { z } from 'zod';

/**
 * Zod schema para validação de variáveis de ambiente
 * Aplicar defaults e coerção de tipos
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .default('3000'),
  APP_NAME: z.string().default('mu-season-4'),
  DATABASE_URL: z.string().default('file:./dev.db'),
  API_KEY: z.string().min(16, 'API_KEY must be at least 16 characters'),
});

/**
 * Validar e exportar configuração tipada
 * Falha imediata do processo se inválido
 *
 * Nota: usa console.error pois executa antes do logger estar disponível
 */
export function validateEnv() {
  try {
    const result = envSchema.parse(process.env);
    return result as z.infer<typeof envSchema>;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Configuration validation error:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    } else {
      console.error('Unknown configuration error:', error);
    }
    process.exit(1);
  }
}
