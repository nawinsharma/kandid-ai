import { PrismaClient } from '@prisma/client';

// Create a single instance of PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// Export types for convenience
export type { User, Campaign, Lead, LinkedinAccount } from '@prisma/client';
