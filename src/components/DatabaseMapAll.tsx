import { getAllLocalArticles } from '@/lib/localDb';
import ArticleCard from '@/components/ArticleCard';
import { getCdnArticleContent } from '@/lib/cdnDb';

export default async function AllArticlesViewer() {
    // 1. Fetch EVERYTHING from your PostgreSQL database
    const allLocalMeta = await getAllLocalArticles();

    // Handle the case where the DB is empty or disconnected
    if (allLocalMeta.length === 0) {
        return <div>No articles found in the database.</div>;
    }

    // 2. Iterate (.map) over the Postgres array to generate the UI!
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }
        }>

            {
                allLocalMeta.map(async (meta) => {
                    // Because Postgres only holds the metadata (author, tags, etc),
                    // we still need to grab the title/body from the CDN for each article ID!
                    const cdnContent = await getCdnArticleContent(meta.id);

                    // If the CDN fetch fails, provide some fallback text
                    const title = cdnContent ? cdnContent.title : `Article #${meta.id}`;
                    const body = cdnContent ? cdnContent.body : "Content unavailable.";

                    // Return an ArticleCard for each row in the database
                    return (
                        <ArticleCard
                            key={meta.id}
                            title={title}
                            body={body}
                            author={meta.author}
                            date={meta.date}
                            tags={meta.tags}
                        />
                    );
                })}

        </div>
    );
}
