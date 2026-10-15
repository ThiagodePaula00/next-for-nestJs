'use server';

import { createLoginSessionFromApi } from '@/src/lib/login/manage-login';
import { LoginSchema } from '@/src/lib/login/schemas';
import { apiRequest } from '@/src/utils/api-request';
import { asyncDelay } from "@/src/utils/async-delay";
import { getZodErrorMessages } from '@/src/utils/get-zod-error-message';
import { redirect } from 'next/navigation';

type LoginActionState = {
  email: string;
  errors: string[];
};

export async function loginAction(
  state: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const allowLogin = Boolean(Number(process.env.ALLOW_LOGIN));

  if (!allowLogin) {
    return {
      email: '',
      errors: ['O login não está habilitado'],
    };
  }

  await asyncDelay(5000); // Vou manter

  if (!(formData instanceof FormData)) {
    return {
      email: '',
      errors: ['Dados inválidos'],
    };
  }

  const formObj = Object.fromEntries(formData.entries());
  const formEmail = formObj.email?.toString() || '';
  const parsedFormData = LoginSchema.safeParse(formObj);

  if (!parsedFormData.success) {
    return {
      email: formEmail,
      errors: getZodErrorMessages(parsedFormData.error),
    };
  }

  const loginResponse = await apiRequest<{ accessToken: string }>(
    '/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsedFormData.data),
    },
  );

  if (!('data' in loginResponse)) {
    return {
      email: formEmail,
      errors: ['Erro ao efetuar login'],
    };
  }

  await createLoginSessionFromApi(loginResponse.data.accessToken);
  redirect('/admin/post');
}