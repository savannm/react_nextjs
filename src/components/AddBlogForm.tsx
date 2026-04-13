'use client'; // This directive strictly separates client-side JS (like form validation) from server logic.

import { useActionState, useState } from 'react';
import { addBlogPost } from '@/lib/actions';
import styles from './AddBlogForm.module.css';

export default function AddBlogForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Optional enhancement: We wrap the raw action inside a client handler 
  // so we can toggle local loading state easily.
  const formAction = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await addBlogPost(formData);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false); // Reset on error so user can correct
    }
  };

  return (
    <form className={styles.formContainer} action={formAction}>
      <header className={styles.formHeader}>
        <h2>Publish New Entry</h2>
        <p>Push data securely straight into your PostgreSQL database via Server Actions.</p>
      </header>

      <div className={styles.inputGroup}>
        <label htmlFor="title">Post Title</label>
        <input type="text" id="title" name="title" required placeholder="e.g. Building API's" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="author">Author Name</label>
        <input type="text" id="author" name="author" required placeholder="Jane Doe" />
      </div>

      <div className={styles.inputRow}>
        <div className={styles.inputGroup}>
          <label htmlFor="date">Publish Date</label>
          <input type="date" id="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="tags">Tags (Comma separated)</label>
          <input type="text" id="tags" name="tags" placeholder="tech, news, software" />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="url">External Link URL</label>
        <input type="url" id="url" name="url" required placeholder="https://..." />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="image_url">Thumbnail Image URL</label>
        <input type="url" id="image_url" name="image_url" required placeholder="https://.../img.jpg" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="body">Content Body</label>
        <textarea id="body" name="body" required rows={6} placeholder="Type the main article content here..."></textarea>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
        {isSubmitting ? 'Inserting into Database...' : 'Insert Record'}
      </button>
    </form>
  );
}
