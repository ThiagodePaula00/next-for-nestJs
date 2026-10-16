'use server';

import { deleteLoginSession } from '@/src/lib/login/manage-login';
import { getPublicUserFromApi } from '@/src/lib/user/api/get-user';
import {
  PublicUserSchema,
  UpdateUserSchema,
  type PublicUserDto,
} from '@/src/lib/user/schemas';
import { authenticatedApiRequest } from '@/src/utils/authenticated-api-request';
import { getZodErrorMessages } from '@/src/utils/get-zod-error-message';
import { redirect } from 'next/navigation';

type UpdateUserActionState = {
  user: PublicUserDto;
  errors: string[];
  success: boolean;
};

export async function updateUserAction(
  state: UpdateUserActionState,
  formData: FormData,
): Promise<UpdateUserActionState> {
  const currentUser = await getPublicUserFromApi();

  if (!currentUser) {
    await deleteLoginSession();

    return {
      user: state.user,
      errors: ['Você precisa fazer login novamente'],
      success: false,
    };
  }

  if (!(formData instanceof FormData)) {
    return {
      user: state.user,
      errors: ['Dados inválidos'],
      success: false,
    };
  }

  const formObject = Object.fromEntries(formData.entries());
  const parsedFormData = UpdateUserSchema.safeParse(formObject);

  if (!parsedFormData.success) {
    return {
      user: PublicUserSchema.parse(formObject),
      errors: getZodErrorMessages(parsedFormData.error),
      success: false,
    };
  }

  const updateResponse = await authenticatedApiRequest<PublicUserDto>(
    '/user/me',
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsedFormData.data),
    },
  );

  if (!updateResponse.success) {
    return {
      user: PublicUserSchema.parse(formObject),
      errors: updateResponse.errors,
      success: false,
    };
  }

  const updatedUser = PublicUserSchema.parse(updateResponse.data);

  if (currentUser.email !== updatedUser.email) {
    await deleteLoginSession();
    redirect('/login?userChanged=1');
  }

  return {
    user: updatedUser,
    errors: [],
    success: true,
  };
}
