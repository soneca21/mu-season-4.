import prisma from '../db/prisma.js';
import { CreateTaskInput, UpdateTaskInput, TaskResponse } from './tasks.schemas.js';

/**
 * Repository layer para Task
 * Acesso direto ao Prisma
 */

export async function createTask(data: CreateTaskInput): Promise<TaskResponse> {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      status: 'todo',
    },
  });
  return task as TaskResponse;
}

export async function listTasks(): Promise<{ items: TaskResponse[]; count: number }> {
  const [items, count] = await Promise.all([
    prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.task.count(),
  ]);
  return { items: items as TaskResponse[], count };
}

export async function getTask(id: string): Promise<TaskResponse | null> {
  const task = await prisma.task.findUnique({
    where: { id },
  });
  return task as TaskResponse | null;
}

export async function updateTask(id: string, data: UpdateTaskInput): Promise<TaskResponse | null> {
  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status !== undefined && { status: data.status }),
    },
  });
  return task as TaskResponse;
}

export async function deleteTask(id: string): Promise<boolean> {
  const result = await prisma.task.delete({
    where: { id },
  });
  return !!result;
}
