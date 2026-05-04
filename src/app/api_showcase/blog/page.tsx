import AddBlogForm from '@/components/AddBlogForm';
import AddMember from '@/components/AddMember';

export const metadata = {
  title: 'Blog',
  description: 'Add a new blog post directly into your PostgreSQL database.',
};

export default function AddPage() {
  return (
    <main style={{ padding: '4rem 1rem', background: '#fafafa', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <AddMember />
      <AddBlogForm />
    </main>
  );
}
