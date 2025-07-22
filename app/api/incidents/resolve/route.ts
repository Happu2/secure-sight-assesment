// app/api/incidents/resolve/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Read the incident ID from the request body
    const { id: incidentId } = await request.json();

    if (!incidentId) {
      return NextResponse.json({ error: 'Incident ID is required' }, { status: 400 });
    }

    const updatedIncident = await prisma.incident.update({
      where: { id: incidentId },
      data: { resolved: true },
    });

    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error('Failed to resolve incident:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}