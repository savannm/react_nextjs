import crypto from 'crypto';
import styles from './ArticleCard.module.css';
import { getMember, MemberInfoProps } from '../lib/db';

/**
 * Presentational component to display member information.
 */
export function MemberInfo({ username, role, password, image_url, resume }: MemberInfoProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>{username}</h2>
        <div className={styles.meta}>
          <span className={styles.author}>Role: {role}</span>
        </div>
      </header>
      <div className={styles.content}>
        <p><strong>Hashed Password:</strong> <code className={styles.hash}>{password}</code></p>
        <p><strong>Profile Image:</strong> {image_url}</p>
        <p><strong>Resume:</strong> {resume}</p>
      </div>
      <footer className={styles.footer}>
      </footer>
    </article>
  );
}

/**
 * Server Component that fetches a member by username and renders MemberInfo.
 * If no username is provided, it defaults to "Zax Max".
 */
export default async function AddMemberGet({ username = "sav" }: { username?: string }) {
  const member = await getMember(username);

  if (!member) {
    return (
      <div className={styles.card}>
        <p>Member "{username}" not found in database.</p>
        <p>Check your <code>members</code> table for existing records.</p>
      </div>
    );
  }

  // Hash the password before displaying it for security/demo purposes
  const hashedPassword = crypto.createHash('sha256').update(member.password).digest('hex');

  return <MemberInfo {...member} password={hashedPassword} />;
}