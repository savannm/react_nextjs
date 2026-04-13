interface CdnArticle {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export async function getCdnArticleContent(id: number): Promise<CdnArticle | null> {
  try {
    // using jsonplaceholder as a mock CDN database
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      next: { revalidate: 3600 } // cache for 1 hour
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching from CDN database:', error);
    return null;
  }
}
