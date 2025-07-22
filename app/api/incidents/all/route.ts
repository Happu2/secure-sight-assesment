// app/api/incidents/all/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: {
        tsStart: 'asc', // Oldest first for timeline drawing
      },
      include: {
        camera: true,
      },
    });
    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Failed to fetch all incidents:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}