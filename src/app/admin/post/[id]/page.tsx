import { ManagePostForm } from '@/src/components/admin/ManagePostForm';
import { findPostByIdFromApiAdmin } from '@/src/lib/post/queries/admin';
import { PublicPostForApiSchema } from '@/src/lib/post/schemas';
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
  const postResponse = await findPostByIdFromApiAdmin(id);

  if (!postResponse.success) {
    notFound();
  }

  const publicPost = PublicPostForApiSchema.parse(postResponse.data);

  return (
    <div className='flex flex-col gap-6'>
      <h1 className='text-xl font-extrabold'>Editar post</h1>
      <ManagePostForm mode='update' publicPost={publicPost} />
    </div>
  );
}