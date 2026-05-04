import AddBlogForm from '@/components/AddBlogForm';
import AddMember from '@/components/AddMember';

export const metadata = {
  title: 'Blog',
  description: 'Add a new blog post directly into your PostgreSQL database.',
};

export default function AddPage() {
  return (
    <main className="flex flex-col md:flex-row justify-center justify-items-top p-4 gap-4">
      <div><AddMember /></div>
      <div><AddBlogForm /></div>
    </main>
  );
}
