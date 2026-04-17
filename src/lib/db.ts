import { Pool } from 'pg';

interface ArticleMeta {
  id: number;
  author: string;
  date: string;
  tags: string[];
}

export interface MemberInfoProps {
  username: string;
  role: string;
  password: string;
  image_url: string;
  resume: string;
}

// Create a connection pool using the DATABASE_URL environment variable
export const db = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

//Pulls One row in the database.
export async function getLocalArticleMeta(id: number): Promise<ArticleMeta | null> {
  try {
    const result = await db.query(
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
    const result = await db.query(
      'SELECT id, author, date::text, tags FROM articles ORDER BY id DESC'
    );

    // Return all the rows! (result.rows is automatically an array)
    return result.rows as ArticleMeta[];
  } catch (error) {
    console.error('Error fetching all articles from Postgres:', error);
    return [];
  }
}

// Pulls one member from the database by username
export async function getMember(username: string): Promise<MemberInfoProps | null> {
  try {
    const result = await db.query(
      'SELECT username, role, password, image_url, resume FROM members WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as MemberInfoProps;
  } catch (error) {
    console.error('Error fetching member from local Postgres database:', error);
    return null;
  }
}

// Saves a resume to the database
export async function saveResume(username: string, content: string): Promise<boolean> {
  try {
    // Update existing member record where the username/email matches. $1 is 1st in the array below.
    await db.query(
      'UPDATE members SET resume = $2 WHERE email = $1',
      [username, content]
    );
    return true;
  } catch (error) {
    console.error('Error saving resume to Postgres:', error);
    return false;
  }
}
