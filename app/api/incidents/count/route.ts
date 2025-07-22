import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// FIX: This line tells Next.js to always treat this route as dynamic
export const dynamic = 'force-dynamic';

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