import { ManagePostForm } from '@/src/components/admin/ManagePostForm';
import { makePublicPostFromDb } from '@/src/dto/post/dto';
import { findPostByIdAdmin } from '@/src/lib/post/queries/admin';
import { SpinLoader } from '@/src/components/spinLoader';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Editar post',
};

type AdminPostIdPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function adminPostIdPage({ params }: AdminPostIdPageProps) {
  return (
    <Suspense fallback={<SpinLoader className='min-h-20 mb-16' />}>
      <PostEditContent params={params} />
    </Suspense>
  );
}

async function PostEditContent({ params }: AdminPostIdPageProps) {
  const { id } = await params;
  const post = await findPostByIdAdmin(id);

  if (!post) notFound();

  const publicPost = makePublicPostFromDb(post);

  return (
    <div className='flex flex-col gap-6'>
      <h1 className='text-xl font-extrabold'>Editar post</h1>
      <ManagePostForm mode='update' publicPost={publicPost} />
    </div>
  );
}