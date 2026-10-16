import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SpinLoader } from '@/src/components/spinLoader';

export const metadata: Metadata = {
  title: 'Trocar senha',
};

export default function AdminUserPasswordPage() {
  return (
    <Suspense fallback={<SpinLoader className='mb-16' />}>
      <h1>Atualizar senha</h1>
    </Suspense>
  );
}
