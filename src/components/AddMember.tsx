'use client'; // This directive strictly separates client-side JS (like form validation) from server logic.

import { useActionState, useState } from 'react';
import { AddMemberDB } from '@/lib/actions';
import styles from './AddBlogForm.module.css';

export default function AddMember() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Optional enhancement: We wrap the raw action inside a client handler 
  // so we can toggle local loading state easily.
  const formAction = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await AddMemberDB(formData);
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
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" required placeholder="Savmax" />
      </div>

      <div className={styles.inputRow}>
        <div className={styles.inputGroup}>
          <label htmlFor="role">Role</label>
          <input type="text" id="role" name="role" required placeholder={'eg: editor'} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input type="text" id="password" name="password" required placeholder="eg: Password@&41" />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="image_url">Profile Image URL</label>
        <input type="url" id="image_url" name="image_url" placeholder="your image url" />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
        {isSubmitting ? 'Inserting into Database...' : 'Insert Record'}
      </button>
    </form>
  );
}
