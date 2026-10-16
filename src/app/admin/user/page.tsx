import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SpinLoader } from '@/src/components/spinLoader';
import { UpdateUser } from '@/src/components/admin/UpdateUser';

export const metadata: Metadata = {
  title: 'Seus dados',
};

export default function AdminUserPage() {
  return (
    <Suspense fallback={<SpinLoader className='mb-16' />}>
      <UpdateUser />
    </Suspense>
  );
}
