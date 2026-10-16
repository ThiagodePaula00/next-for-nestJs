'use server';

import { deleteLoginSession } from '@/src/lib/login/manage-login';
import { getPublicUserFromApi } from '@/src/lib/user/api/get-user';
import { authenticatedApiRequest } from '@/src/utils/authenticated-api-request';
import { redirect } from 'next/navigation';

type DeleteUserActionResult = {
  errors: string[];
  success: boolean;
};

export async function deleteUserAction(): Promise<DeleteUserActionResult> {
  const user = await getPublicUserFromApi();

  if (!user) {
    await deleteLoginSession();
    return {
      errors: ['Você precisa fazer login novamente'],
      success: false,
    };
  }

  const deleteResponse = await authenticatedApiRequest<unknown>('/user/me', {
    method: 'DELETE',
  });

  if (!deleteResponse.success) {
    return {
      errors: deleteResponse.errors,
      success: false,
    };
  }

  await deleteLoginSession();
  redirect('/');
}
