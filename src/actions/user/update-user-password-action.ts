'use server';

import { deleteLoginSession } from '@/src/lib/login/manage-login';
import { getPublicUserFromApi } from '@/src/lib/user/api/get-user';
import { UpdatePasswordSchema } from '@/src/lib/user/schemas';
import { authenticatedApiRequest } from '@/src/utils/authenticated-api-request';
import { getZodErrorMessages } from '@/src/utils/get-zod-error-message';
import { redirect } from 'next/navigation';

type UpdatePasswordActionState = {
  errors: string[];
  success: boolean;
};

export async function updatePasswordAction(
  state: UpdatePasswordActionState,
  formData: FormData,
): Promise<UpdatePasswordActionState> {
  const user = await getPublicUserFromApi();

  if (!user) {
    await deleteLoginSession();
    return {
      errors: ['Você precisa fazer login novamente'],
      success: false,
    };
  }

  if (!(formData instanceof FormData)) {
    return {
      errors: ['Dados inválidos'],
      success: false,
    };
  }

  const formObject = Object.fromEntries(formData.entries());
  const parsedFormData = UpdatePasswordSchema.safeParse(formObject);

  if (!parsedFormData.success) {
    return {
      errors: getZodErrorMessages(parsedFormData.error),
      success: false,
    };
  }

  const updatePasswordResponse = await authenticatedApiRequest<unknown>(
    '/user/me/password',
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsedFormData.data),
    },
  );

  if (!updatePasswordResponse.success) {
    return {
      errors: updatePasswordResponse.errors,
      success: false,
    };
  }

  await deleteLoginSession();
  redirect('/login?userChanged=1');
}
