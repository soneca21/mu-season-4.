import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/db/prisma';

describe('Tasks CRUD', () => {
  let taskId: string;

  beforeAll(async () => {
    // Limpar tabela antes dos testes
    await prisma.task.deleteMany();
  });

  afterAll(async () => {
    // Limpar após testes e desconectar
    await prisma.task.deleteMany();
    await prisma.$disconnect();
  });

  // POST /tasks - Criar task
  it('should create a task', async () => {
    const res = await request(app).post('/tasks').send({
      title: 'Learn Prisma',
      description: 'Study Prisma ORM with TypeScript',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Learn Prisma');
    expect(res.body.description).toBe('Study Prisma ORM with TypeScript');
    expect(res.body.status).toBe('todo');
    expect(res.body).toHaveProperty('createdAt');
    expect(res.body).toHaveProperty('updatedAt');

    taskId = res.body.id;
  });

  // POST /tasks - Validação: título obrigatório
  it('should reject task without title', async () => {
    const res = await request(app).post('/tasks').send({
      description: 'No title here',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  // POST /tasks - Validação: título vazio
  it('should reject task with empty title', async () => {
    const res = await request(app).post('/tasks').send({
      title: '   ',
      description: 'Only whitespace title',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  // GET /tasks - Listar tasks
  it('should list all tasks', async () => {
    const res = await request(app).get('/tasks');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('count');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
  });

  // GET /tasks/:id - Obter task
  it('should get a task by id', async () => {
    const res = await request(app).get(`/tasks/${taskId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(taskId);
    expect(res.body.title).toBe('Learn Prisma');
    expect(res.body.status).toBe('todo');
  });

  // GET /tasks/:id - Task não encontrada
  it('should return 404 for non-existent task', async () => {
    const res = await request(app).get('/tasks/00000000-0000-0000-0000-000000000000');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
    expect(res.body.error.message).toBe('Task not found');
  });

  // PATCH /tasks/:id - Atualizar status
  it('should update task status', async () => {
    const res = await request(app).patch(`/tasks/${taskId}`).send({
      status: 'doing',
    });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(taskId);
    expect(res.body.status).toBe('doing');
    expect(res.body.title).toBe('Learn Prisma'); // não deve mudar
  });

  // PATCH /tasks/:id - Atualizar título
  it('should update task title', async () => {
    const res = await request(app).patch(`/tasks/${taskId}`).send({
      title: 'Master Prisma',
    });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Master Prisma');
    expect(res.body.status).toBe('doing'); // deve permanecer
  });

  // PATCH /tasks/:id - Limpar description
  it('should clear task description', async () => {
    const res = await request(app).patch(`/tasks/${taskId}`).send({
      description: null,
    });

    expect(res.status).toBe(200);
    expect(res.body.description).toBeNull();
  });

  // PATCH /tasks/:id - Body vazio
  it('should reject PATCH with empty body', async () => {
    const res = await request(app).patch(`/tasks/${taskId}`).send({});

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  // PATCH /tasks/:id - Task não encontrada
  it('should return 404 when updating non-existent task', async () => {
    const res = await request(app).patch('/tasks/00000000-0000-0000-0000-000000000000').send({
      status: 'done',
    });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  // PATCH /tasks/:id - Status inválido
  it('should reject invalid status', async () => {
    const res = await request(app).patch(`/tasks/${taskId}`).send({
      status: 'invalid',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  // DELETE /tasks/:id - Deletar task
  it('should delete a task', async () => {
    const res = await request(app).delete(`/tasks/${taskId}`);

    expect(res.status).toBe(204);
    expect(res.text).toBe('');
  });

  // GET /tasks/:id - Verificar que foi deletada
  it('should return 404 after deletion', async () => {
    const res = await request(app).get(`/tasks/${taskId}`);

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  // DELETE /tasks/:id - Task não encontrada
  it('should return 404 when deleting non-existent task', async () => {
    const res = await request(app).delete('/tasks/00000000-0000-0000-0000-000000000000');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  // POST /tasks - Criar múltiplas tasks para testar listagem
  it('should list multiple tasks', async () => {
    // Criar 3 tasks
    for (let i = 1; i <= 3; i++) {
      await request(app).post('/tasks').send({
        title: `Task ${i}`,
        status: 'todo',
      });
    }

    const res = await request(app).get('/tasks');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(3);
    expect(res.body.items.length).toBe(3);
  });
});
