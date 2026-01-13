import { Router, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import openApiSpec from '../openapi/openapi.js';

const router = Router();

/**
 * GET /openapi.json
 * Retorna a especificação OpenAPI 3.0 completa
 * Público (sem autenticação)
 */
router.get('/openapi.json', (_req: Request, res: Response) => {
  res.json(openApiSpec);
});

/**
 * GET /docs
 * Swagger UI para visualizar a documentação da API
 * Público (sem autenticação)
 */
router.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      showRequestHeaders: true,
    },
    customCss: '.topbar { display: none }',
  })
);

export const openApiRouter = router;
export default openApiRouter;
