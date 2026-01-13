import { Router, Request, Response, NextFunction } from 'express';
import * as tasksService from '../tasks/tasks.service.js';
import { CreateTaskSchema, UpdateTaskSchema } from '../tasks/tasks.schemas.js';
import { ZodError } from 'zod';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();

/**
 * POST /tasks
 * Criar nova task
 */
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = CreateTaskSchema.parse(req.body);
    const task = await tasksService.createTask(body);
    res.status(201).json(task);
  })
);

/**
 * GET /tasks
 * Listar todas as tasks
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await tasksService.listTasks();
    res.json(result);
  })
);

/**
 * GET /tasks/:id
 * Obter task por ID
 */
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const task = await tasksService.getTask(req.params.id);
    if (!task) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Task not found',
        },
      });
    }
    res.json(task);
  })
);

/**
 * PATCH /tasks/:id
 * Atualizar task parcialmente
 */
router.patch(
  '/:id',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = UpdateTaskSchema.parse(req.body);
    const task = await tasksService.updateTask(req.params.id, body);
    if (!task) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Task not found',
        },
      });
    }
    res.json(task);
  })
);

/**
 * DELETE /tasks/:id
 * Deletar task
 */
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const deleted = await tasksService.deleteTask(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Task not found',
        },
      });
    }
    res.status(204).send();
  })
);

export default router;
