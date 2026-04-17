import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: any }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ error: 'Unauthorised' }, { status: 401 });
    }

    // In Next.js 15+, params is a Promise that must be awaited.
    // If you are on an older version, this still works if you handle it.
    const resolvedParams = await params;

    try {
        const data = await db.query(
            'SELECT id, username, email FROM users WHERE id = $1', [resolvedParams.id]
        );

        if (data.rows.length === 0) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }

        return Response.json(data.rows[0]);
    } catch (error) {
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}