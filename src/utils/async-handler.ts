import { Request, Response, NextFunction } from 'express';

/**
 * Wrapper para rotas assíncronas
 * Converte rejections de Promise para next(error)
 */
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
