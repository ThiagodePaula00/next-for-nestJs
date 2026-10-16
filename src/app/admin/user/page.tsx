import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SpinLoader } from '@/src/components/spinLoader';
import { UpdateUserForm } from '@/src/components/admin/UpdateUserForm';

export const metadata: Metadata = {
  title: 'Seus dados',
};

export default function AdminUserPage() {
  return (
    <Suspense fallback={<SpinLoader className='mb-16' />}>
      <UpdateUserForm />
    </Suspense>
  );
}
