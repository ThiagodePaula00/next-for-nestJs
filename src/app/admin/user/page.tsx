import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SpinLoader } from '@/src/components/spinLoader';

export const metadata: Metadata = {
  title: 'Seus dados',
};

export default function AdminUserPage() {
  return (
    <Suspense fallback={<SpinLoader className='mb-16' />}>
      <h1>Atualizar dados do usuário</h1>
    </Suspense>
  );
}
