'use server'

import { Pool } from 'pg';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});


//Get Member info from database
export async function AddMemberDB(formData: FormData) {
  // 1. Extract the raw values from the form component
  const username = formData.get('username') as string;
  const role = formData.get('role') as string;
  const password = formData.get('password') as string;
  const image_url = formData.get('image_url') as string;

  try {
    // 3. Execute the SQL insertion query securely leveraging parameterization ($1, $2)
    // to prevent SQL injection vulnerabilities automatically!
    await pool.query(
      `INSERT INTO members (username, role, password, image_url) 
       VALUES ($1, $2, $3, $4)`,
      [username, role, password, image_url]
    );

  } catch (error) {
    console.error('Failed to insert into table:', error);
    throw new Error('Database Error: Failed to add post.');
  }

  // 4. Force Next.js to dump the cached version of the homepage/routes so the new post appears immediately!
  // revalidatePath('/');
  // revalidatePath('/add');

  // 5. Seamlessly redirect physical user to the homepage!
  redirect('/');
}



//Get Blog info from database
export async function addBlogPost(formData: FormData) {
  // 1. Extract the raw values from the form component
  const author = formData.get('author') as string;
  const date = formData.get('date') as string; // Expects YYYY-MM-DD
  const tagsStr = formData.get('tags') as string;
  const title = formData.get('title') as string;
  const body = formData.get('body') as string;
  const url = formData.get('url') as string;
  const image_url = formData.get('image_url') as string;

  // 2. Simple sanitisation and fallback defaults
  // Convert comma-separated string back to array literal syntax accepted by postgres text[]
  const rawTags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
  const tagsLiteral = `{${rawTags.join(',')}}`;

  try {
    // 3. Execute the SQL insertion query securely leveraging parameterization ($1, $2)
    // to prevent SQL injection vulnerabilities automatically!
    await pool.query(
      `INSERT INTO blog (author, date, tags, title, body, url, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [author, date, tagsLiteral, title, body, url, image_url]
    );

  } catch (error) {
    console.error('Failed to insert into blog table:', error);
    throw new Error('Database Error: Failed to add blog post.');
  }

  // 4. Force Next.js to dump the cached version of the homepage/routes so the new post appears immediately!
  revalidatePath('/');
  revalidatePath('/add');

  // 5. Seamlessly redirect physical user to the homepage!
  redirect('/');
}
