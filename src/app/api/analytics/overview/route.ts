import { NextResponse } from 'next/server';
import { getOverviewData } from '@/lib/analytics';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start') ?? '30daysAgo';
    const end = searchParams.get('end') ?? 'today';

    try {
        const data = await getOverviewData(start, end);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
