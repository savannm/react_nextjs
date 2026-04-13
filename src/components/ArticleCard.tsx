import styles from './ArticleCard.module.css';

interface ArticleCardProps {
  title: string;
  body: string;
  author: string;
  date: string;
  tags: string[];
}

export default function ArticleCard({ title, body, author, date, tags }: ArticleCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.meta}>
          <span className={styles.author}>By {author}</span>
          <span className={styles.date}>{new Date(date).toLocaleDateString()}</span>
        </div>
      </header>
      <div className={styles.content}>
        <p>{body}</p>
      </div>
      <footer className={styles.footer}>
        <ul className={styles.tags}>
          {tags.map(tag => (
            <li key={tag} className={styles.tag}>{tag}</li>
          ))}
        </ul>
      </footer>
    </article>
  );
}
