// app/api/incidents/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resolvedParam = searchParams.get('resolved');

    // Build the query's 'where' clause based on the query parameter
    const whereClause =
      resolvedParam !== null
        ? { resolved: resolvedParam === 'true' } // Convert "true" string to boolean
        : {}; // If no param, return all incidents

    const incidents = await prisma.incident.findMany({
      where: whereClause,
      orderBy: {
        tsStart: 'desc', // Newest incidents first
      },
      include: {
        camera: true, // Include the related camera information
      },
    });

    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Failed to fetch incidents:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}