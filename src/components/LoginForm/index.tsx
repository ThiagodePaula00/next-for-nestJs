'use client';

import { loginAction } from '../../actions/login/login-action';
import { Button } from '../Button';
import { InputText } from '../InputText';
import clsx from 'clsx';
import { LogInIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { HoneypotInput } from '../HoneypotInput';

export function LoginForm() {
  const initialState = {
    email: '',
    errors: [],
  };
  const [state, action, isPending] = useActionState(loginAction, initialState);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userChanged = searchParams.get('userChanged');
  const created = searchParams.get('created');

  useEffect(() => {
    if (state.errors.length > 0) {
      toast.dismiss();
      state.errors.forEach(error => toast.error(error));
    }
  }, [state]);

  useEffect(() => {
    const url = new URL(window.location.href);
    let shouldReplaceUrl = false;

    if (userChanged === '1') {
      toast.dismiss();
      toast.success('Seu usuário foi modificado. Faça login novamente.');
      url.searchParams.delete('userChanged');
      shouldReplaceUrl = true;
    }

    if (created === '1') {
      toast.dismiss();
      toast.success('Seu usuário criado.');
      url.searchParams.delete('created');
      shouldReplaceUrl = true;
    }

    if (shouldReplaceUrl) {
      router.replace(`${url.pathname}${url.search}${url.hash}`);
    }
  }, [userChanged, created, router]);

  return (
    <div
      className={clsx(
        'flex items-center justify-center',
        'text-center max-w-sm mt-16 mb-32 mx-auto',
      )}
    >
      <form action={action} className='flex-1 flex flex-col gap-6'>
        <InputText
          type='email'
          name='email'
          labelText='E-mail'
          placeholder='Seu e-mail'
          disabled={isPending}
          defaultValue={state.email}
          required
        />

        <InputText
          type='password'
          name='password'
          labelText='Senha'
          placeholder='Sua senha'
          disabled={isPending}
          required
        />

        <HoneypotInput />

        <Button disabled={isPending} type='submit' className='mt-4'>
          <LogInIcon />
          Entrar
        </Button>

        <p className='text-sm/tight'>
          <Link href='/user/new'>Criar minha conta</Link>
        </p>
      </form>
    </div>
  );
}