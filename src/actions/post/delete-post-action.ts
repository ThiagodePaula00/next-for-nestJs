'use server'

import { getLoginSessionForApi } from '@/src/lib/login/manage-login';
import type { PublicPostForApiDto } from '@/src/lib/post/schemas';
import { authenticatedApiRequest } from '@/src/utils/authenticated-api-request';
import { revalidatePath, updateTag } from "next/cache";

export async function deletePostAction(id: string) {
    const isAuthenticated = await getLoginSessionForApi();

    if (!isAuthenticated) {
        return {
            error: 'Faça login novamente antes de excluir o post',
        };
    }

    if (!id || typeof id !== 'string') {
        return {
            error: 'Dados inválidos',
        };
    }

    const postResponse = await authenticatedApiRequest<PublicPostForApiDto>(
      `/post/me/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!postResponse.success) {
      return {
        error: postResponse.errors.join(', '),
      };
    }

    const deletePostResponse = await authenticatedApiRequest<PublicPostForApiDto>(
      `/post/me/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!deletePostResponse.success) {
        return {
            error: deletePostResponse.errors.join(', '),
        };
    }

    updateTag('posts');
    updateTag(`post-${postResponse.data.slug}`);
    revalidatePath('/admin/post');

    return {
        error: '',
    };
}