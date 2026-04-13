import { Pool } from 'pg';

interface ArticleMeta {
  id: number;
  author: string;
  date: string;
  tags: string[];
}

// Create a connection pool using the DATABASE_URL environment variable
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});


export async function getLocalArticleMeta(id: number): Promise<ArticleMeta | null> {
  try {
    const result = await pool.query(
      'SELECT id, author, date::text, tags FROM articles WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as ArticleMeta;
  } catch (error) {
    console.error('Error fetching from local Postgres database:', error);
    return null;
  }
}

