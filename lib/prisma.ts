// lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// Declare a global variable to hold the prisma instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Check if in production or if prisma is not already initialized
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;