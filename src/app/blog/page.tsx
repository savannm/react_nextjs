import AddBlogForm from '@/components/AddBlogForm';

export const metadata = {
  title: 'Publish New Entry | Next.js App',
  description: 'Add a new blog post directly into your PostgreSQL database.',
};

export default function AddPage() {
  return (
    <main style={{ padding: '4rem 1rem', background: '#fafafa', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <AddBlogForm />
    </main>
  );
}
