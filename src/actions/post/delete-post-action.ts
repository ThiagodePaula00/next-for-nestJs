'use server'

import { verifyLoginSession } from "@/src/lib/login/manage-login";
import { postRepository } from "@/src/repository/post";
import { revalidatePath, updateTag } from "next/cache";

export async function deletePostAction(id: string) {
    const isAuthenticated = await verifyLoginSession();

    if (!isAuthenticated) {
        return {
            error: 'Faça login novamente antes de excluir o post',
        };
    }

    if(!id || typeof id !== 'string') {
        return {
            error: 'Dados inválidos',
        };
    }

    let post;
    try {
        post = await postRepository.delete(id);
    } catch (e: unknown) {
        if (e instanceof Error) {
        return {
            error: e.message,
        };
        }

        return {
        error: 'Erro desconhecido',
        };
    }

    if (!post) {
        return {
            error: 'Post não encontrado',
        };
    }

    updateTag('posts');
    updateTag(`post-${post.slug}`);
    revalidatePath('/admin/post');

    return {
        error: '',
    };
}