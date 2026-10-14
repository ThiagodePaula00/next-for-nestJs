'use server';

import { PostUpdateSchema } from '@/src/lib/post/validation';
import {
  makeParticialPublicPost,
  makePublicPostFromDb,
  type PublicPost,
} from '@/src/dto/post/dto';
import { verifyLoginSession } from '@/src/lib/login/manage-login';
import { updateTag } from 'next/cache';
import { getZodErrorMessages } from '@/src/utils/get-zod-error-message';
import { makeRandomString } from '@/src/utils/make-random-string';
import { postRepository } from '@/src/repository/post';

type UpdatePostActionState = {
  formState: PublicPost;
  errors: string[];
  success?: string;
};

export async function updatePostAction(
  prevState: UpdatePostActionState,
  formData: FormData,
): Promise<UpdatePostActionState> {
  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ['Dados inválidos'],
    };
  }

  const id = formData.get('id');

  if (typeof id !== 'string' || !id) {
    return {
      formState: prevState.formState,
      errors: ['ID inválido'],
    };
  }

  const formDataToObj = Object.fromEntries(formData.entries());
  const zodParsedObj = PostUpdateSchema.safeParse(formDataToObj);

  const isAuthenticated = await verifyLoginSession();

  if (!isAuthenticated) {
    return {
      formState: makeParticialPublicPost(formDataToObj),
      errors: ['Faça login novamente antes de salvar.'],
    };
  }

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error);
    return {
      errors,
      formState: makeParticialPublicPost(formDataToObj),
    };
  }

  const validPostData = zodParsedObj.data;
  const newPost = {
    ...validPostData,
  };

  let post;
  try {
    post = await postRepository.update(id, newPost);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        formState: makeParticialPublicPost(formDataToObj),
        errors: [e.message],
      };
    }

    return {
      formState: makeParticialPublicPost(formDataToObj),
      errors: ['Erro desconhecido'],
    }
  }

  updateTag('posts');
  updateTag(`post-${post.slug}`);

  return {
    formState: makePublicPostFromDb(post),
    errors: [],
    success: makeRandomString(),
  };
}