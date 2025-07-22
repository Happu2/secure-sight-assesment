import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const resolved = searchParams.get('resolved') === 'true';

  try {
    const count = await prisma.incident.count({
      where: { resolved: resolved },
    });
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Failed to count incidents:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}