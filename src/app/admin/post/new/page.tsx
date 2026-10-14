import { ManagePostForm } from '@/src/components/admin/ManagePostForm';
import { SpinLoader } from '@/src/components/spinLoader';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Criar post',
};

export default async function AdminPostNewPage() {
  return (
    <div className='flex flex-col gap-6'>
      <h1 className='text-xl font-extrabold'>Criar post</h1>
      <Suspense fallback={<SpinLoader className='min-h-20 mb-16' />}>
        <ManagePostForm mode='create' />
      </Suspense>
    </div>
  );
}