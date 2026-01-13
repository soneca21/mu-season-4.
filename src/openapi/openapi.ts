import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../../package.json'), 'utf-8')
);

/**
 * OpenAPI 3.0.3 Specification
 * Contrato formal da API com todas as rotas, schemas, autenticação e respostas de erro
 */

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'mu-season-4 API',
    version: packageJson.version,
    description:
      'Backend API for task management with structured logging, authentication via API key, and comprehensive error handling',
    contact: {
      name: 'mu-season-4 Contributors',
    },
    license: {
      name: 'MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description: 'API key for authentication (required for /tasks endpoints)',
      },
    },
    schemas: {
      Task: {
        type: 'object',
        required: ['id', 'title', 'status', 'createdAt', 'updatedAt'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Task ID (UUID)',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          title: {
            type: 'string',
            description: 'Task title',
            example: 'Learn Prisma ORM',
          },
          description: {
            type: 'string',
            nullable: true,
            description: 'Task description (optional)',
            example: 'Study Prisma documentation and best practices',
          },
          status: {
            type: 'string',
            enum: ['todo', 'doing', 'done'],
            description: 'Task status',
            example: 'todo',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
            example: '2025-01-13T22:00:00Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
            example: '2025-01-13T22:30:00Z',
          },
        },
      },
      TaskList: {
        type: 'object',
        required: ['items', 'count'],
        properties: {
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Task',
            },
            description: 'Array of tasks',
          },
          count: {
            type: 'integer',
            description: 'Total number of tasks',
            example: 3,
          },
        },
      },
      CreateTaskRequest: {
        type: 'object',
        required: ['title'],
        properties: {
          title: {
            type: 'string',
            minLength: 1,
            description: 'Task title (required)',
            example: 'New task',
          },
          description: {
            type: 'string',
            description: 'Task description (optional)',
            example: 'Task details',
          },
        },
      },
      UpdateTaskRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            minLength: 1,
            description: 'Task title (optional)',
            example: 'Updated task',
          },
          description: {
            type: 'string',
            nullable: true,
            description: 'Task description (nullable, optional)',
            example: null,
          },
          status: {
            type: 'string',
            enum: ['todo', 'doing', 'done'],
            description: 'Task status (optional)',
            example: 'doing',
          },
        },
      },
      ErrorDetail: {
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: {
            type: 'string',
            enum: [
              'VALIDATION_ERROR',
              'NOT_FOUND',
              'INTERNAL_ERROR',
              'UNAUTHORIZED',
            ],
            description: 'Error code',
          },
          message: {
            type: 'string',
            description: 'Error message',
          },
          details: {
            description: 'Additional error details',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            $ref: '#/components/schemas/ErrorDetail',
          },
        },
      },
      HealthResponse: {
        type: 'object',
        required: ['status', 'uptime', 'timestamp'],
        properties: {
          status: {
            type: 'string',
            enum: ['ok'],
            description: 'Health status',
          },
          uptime: {
            type: 'number',
            description: 'Server uptime in milliseconds',
            example: 12345,
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp',
            example: '2025-01-13T22:00:00Z',
          },
        },
      },
    },
    responses: {
      ValidationError: {
        description: 'Request validation error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            example: {
              error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: [
                  {
                    path: ['title'],
                    message: 'Required',
                  },
                ],
              },
            },
          },
        },
      },
      Unauthorized: {
        description: 'Authentication error (missing or invalid API key)',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            example: {
              error: {
                code: 'UNAUTHORIZED',
                message: 'Invalid or missing API key',
              },
            },
          },
        },
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            example: {
              error: {
                code: 'NOT_FOUND',
                message: 'Resource not found',
              },
            },
          },
        },
      },
      InternalError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            example: {
              error: {
                code: 'INTERNAL_ERROR',
                message: 'Internal server error',
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        operationId: 'getHealth',
        summary: 'Health check endpoint',
        description:
          'Check if the server is running and responsive. No authentication required.',
        security: [],
        tags: ['Health'],
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthResponse',
                },
              },
            },
          },
        },
      },
    },
    '/tasks': {
      get: {
        operationId: 'listTasks',
        summary: 'List all tasks',
        description: 'Retrieve all tasks with pagination info.',
        tags: ['Tasks'],
        responses: {
          '200': {
            description: 'List of tasks',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TaskList',
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '500': {
            $ref: '#/components/responses/InternalError',
          },
        },
      },
      post: {
        operationId: 'createTask',
        summary: 'Create a new task',
        description: 'Create a new task with the provided title and optional description.',
        tags: ['Tasks'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateTaskRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Task created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/ValidationError',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '500': {
            $ref: '#/components/responses/InternalError',
          },
        },
      },
    },
    '/tasks/{id}': {
      get: {
        operationId: 'getTask',
        summary: 'Get a task by ID',
        description: 'Retrieve a specific task by its UUID.',
        tags: ['Tasks'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
            description: 'Task ID',
          },
        ],
        responses: {
          '200': {
            description: 'Task found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task',
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '404': {
            $ref: '#/components/responses/NotFound',
          },
          '500': {
            $ref: '#/components/responses/InternalError',
          },
        },
      },
      patch: {
        operationId: 'updateTask',
        summary: 'Update a task',
        description: 'Update specific fields of a task (title, description, status).',
        tags: ['Tasks'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
            description: 'Task ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateTaskRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Task updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/ValidationError',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '404': {
            $ref: '#/components/responses/NotFound',
          },
          '500': {
            $ref: '#/components/responses/InternalError',
          },
        },
      },
      delete: {
        operationId: 'deleteTask',
        summary: 'Delete a task',
        description: 'Delete a task by its ID.',
        tags: ['Tasks'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
            description: 'Task ID',
          },
        ],
        responses: {
          '204': {
            description: 'Task deleted successfully (no content)',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '404': {
            $ref: '#/components/responses/NotFound',
          },
          '500': {
            $ref: '#/components/responses/InternalError',
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoints',
    },
    {
      name: 'Tasks',
      description: 'Task management endpoints',
    },
  ],
};

export default openApiSpec;
