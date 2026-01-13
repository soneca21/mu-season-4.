import { PrismaClient } from '@prisma/client';

/**
 * Singleton PrismaClient
 * Reutilizável em toda aplicação
 */
const prisma = new PrismaClient();

export default prisma;
