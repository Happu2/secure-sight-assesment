// src/app/api/incidents/[id]/resolve/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Corrected import path

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const incidentId = params.id;

    const updatedIncident = await prisma.incident.update({
      where: {
        id: incidentId,
      },
      data: {
        resolved: true,
      },
    });

    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error('Failed to resolve incident:', error);
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
       return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}