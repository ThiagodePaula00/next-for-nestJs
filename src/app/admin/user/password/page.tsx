import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SpinLoader } from '@/src/components/spinLoader';
import { UpdatePasswordForm } from '@/src/components/admin/UpdateUserPassword';

export const metadata: Metadata = {
  title: 'Trocar senha',
};

export default function AdminUserPasswordPage() {
  return (
    <Suspense fallback={<SpinLoader className='mb-16' />}>
      <UpdatePasswordForm />
    </Suspense>
  );
}
