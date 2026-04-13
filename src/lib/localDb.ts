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

//Pulls One row in the database.
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


// Pulls from database, all the rows for mapping
export async function getAllLocalArticles(): Promise<ArticleMeta[]> {
  try {
    // Select all rows from the articles table
    const result = await pool.query(
      'SELECT id, author, date::text, tags FROM articles ORDER BY id DESC'
    );

    // Return all the rows! (result.rows is automatically an array)
    return result.rows as ArticleMeta[];
  } catch (error) {
    console.error('Error fetching all articles from Postgres:', error);
    return [];
  }
}

