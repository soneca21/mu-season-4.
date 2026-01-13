import * as tasksRepo from './tasks.repo.js';
import { CreateTaskInput, UpdateTaskInput, TaskResponse } from './tasks.schemas.js';

/**
 * Service layer para Task
 * Lógica de negócio, delega persistência ao repo
 */

export async function createTask(data: CreateTaskInput): Promise<TaskResponse> {
  return await tasksRepo.createTask(data);
}

export async function listTasks(): Promise<{ items: TaskResponse[]; count: number }> {
  return await tasksRepo.listTasks();
}

export async function getTask(id: string): Promise<TaskResponse | null> {
  return await tasksRepo.getTask(id);
}

export async function updateTask(id: string, data: UpdateTaskInput): Promise<TaskResponse | null> {
  const existing = await tasksRepo.getTask(id);
  if (!existing) {
    return null;
  }
  return await tasksRepo.updateTask(id, data);
}

export async function deleteTask(id: string): Promise<boolean> {
  const existing = await tasksRepo.getTask(id);
  if (!existing) {
    return false;
  }
  return await tasksRepo.deleteTask(id);
}
