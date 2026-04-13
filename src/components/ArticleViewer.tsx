import { getLocalArticleMeta } from '../lib/localDb';
import { getCdnArticleContent } from '../lib/cdnDb';
import ArticleCard from './ArticleCard';

interface ArticleViewerProps {
  articleId: number;
}

export default async function ArticleViewer({ articleId }: ArticleViewerProps) {
  // Fetch from both databases in parallel
  const [localMeta, cdnContent] = await Promise.all([
    getLocalArticleMeta(articleId),
    getCdnArticleContent(articleId)
  ]);

  if (!cdnContent) {
    return <div>CDN Article not found</div>;
  }

  // Provide fallback local metadata if the Postgres DB isn't connected yet 
  // so the user can still preview the CDN fetch.
  const fallbackMeta = localMeta || {
    author: 'Database Disconnected',
    date: new Date().toISOString(),
    tags: ['Fallback', 'Pending Local DB Setup']
  };

  return (
    <ArticleCard
      title={cdnContent.title}
      body={cdnContent.body}
      author={fallbackMeta.author}
      date={fallbackMeta.date}
      tags={fallbackMeta.tags}
    />
  );
}
