'use server'

import { makeParticialPublicPost, type PublicPost } from '@/src/dto/post/dto';
import { verifyLoginSession } from '@/src/lib/login/manage-login';
import { PostCreateSchema } from '@/src/lib/post/validation';
import type { PostModel } from '@/src/models/post/post-model';
import { postRepository } from '@/src/repository/post';
import { makeSlugFromText } from '@/src/utils/make-slug-from-texts';
import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { v7 as uuidv7 } from 'uuid';

type CreatePostActionState = {
  formState: PublicPost;
  errors: string[];
  success?: string;
};

export async function createPostAction(
  prevState: CreatePostActionState,
  formData: FormData,
): Promise<CreatePostActionState> {
  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ['Dados inválidos'],
    };
  }

  const formDataToObj = Object.fromEntries(formData.entries());
  const zodParseObj = PostCreateSchema.safeParse(formDataToObj);

  const isAuthenticated = await verifyLoginSession();

  if (!isAuthenticated) {
    return {
      formState: makeParticialPublicPost(formDataToObj),
      errors: ['Faça login novamente antes de salvar.'],
    };
  }

  if (!zodParseObj.success) {
    return {
      errors: zodParseObj.error.issues.map(issue => issue.message),
      formState: makeParticialPublicPost(formDataToObj),
    };
  }

  const validPostData = zodParseObj.data;
  const newPost: PostModel = {
    ...validPostData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: uuidv7(),
    slug: makeSlugFromText(validPostData.title),
  };

  try {
    await postRepository.create(newPost);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        formState: newPost,
        errors: [e.message],
      };
    }

    return {
      formState: newPost,
      errors: ['Erro desconhecido'],
    };
  }

  updateTag('posts');
  redirect(`/admin/post/${newPost.id}?created=1`);
}