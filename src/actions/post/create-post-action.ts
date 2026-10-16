'use server'

import { getLoginSessionForApi } from '@/src/lib/login/manage-login';
import {
  CreatePostForApiSchema,
  PublicPostForApiSchema,
  type PublicPostForApiDto,
} from '@/src/lib/post/schemas';
import { authenticatedApiRequest } from '@/src/utils/authenticated-api-request';
import { getZodErrorMessages } from '@/src/utils/get-zod-error-message';
import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';

type CreatePostActionState = {
  formState: PublicPostForApiDto;
  errors: string[];
  success?: string;
};

export async function createPostAction(
  prevState: CreatePostActionState,
  formData: FormData,
): Promise<CreatePostActionState> {
  const isAuthenticated = await getLoginSessionForApi();

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ['Dados inválidos'],
    };
  }

  const formDataToObj = Object.fromEntries(formData.entries());
  const zodParseObj = CreatePostForApiSchema.safeParse(formDataToObj);

  if (!isAuthenticated) {
    return {
      formState: PublicPostForApiSchema.parse(formDataToObj),
      errors: ['Faça login em outra aba antes de salvar.'],
    };
  }

  if (!zodParseObj.success) {
    return {
      errors: getZodErrorMessages(zodParseObj.error),
      formState: PublicPostForApiSchema.parse(formDataToObj),
    };
  }

  const createPostResponse =
    await authenticatedApiRequest<PublicPostForApiDto>('/post/me', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(zodParseObj.data),
    });

  if (!createPostResponse.success) {
    return {
      formState: PublicPostForApiSchema.parse(formDataToObj),
      errors: createPostResponse.errors,
    };
  }

  updateTag('posts');
  redirect(`/admin/post/${createPostResponse.data.id}?created=1`);
}