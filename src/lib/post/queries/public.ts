
import type { PostModelFromApi } from '@/src/models/post/post-model';
import { postRepository } from '@/src/repository/post';
import { apiRequest } from '@/src/utils/api-request';
import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';

export const findAllPublicPostsFromApiCached = cache(async () => {
  return apiRequest<PostModelFromApi[]>('/post', {
    next: {
      tags: ['posts'],
      revalidate: 86400,
    },
  });
});

export const findAllPublicPostsCached = cache(async () => {
  'use cache';
  cacheLife({ revalidate: 10 });
  cacheTag('posts');

  return postRepository.findAllPublic();
});

const findPostBySlugCachedData = async (slug: string) => {
  'use cache';
  cacheLife({ revalidate: 10 });
  cacheTag(`post-${slug}`);

  return postRepository.findBySlugPublic(slug).catch(() => undefined);
};

export const findPublicPostBySlugCached = cache(async (slug: string) => {
  const post = await findPostBySlugCachedData(slug);
  if (!post) notFound();

  return post;
});

export const findPublicPostBySlugFromApiCached = cache(
  async (slug: string) => {
    return apiRequest<PostModelFromApi>(`/post/${slug}`, {
      next: {
        tags: [`post-${slug}`],
        revalidate: 86400,
      },
    });
  },
);

export const findPostByIdCached = cache(
  async (id: string) => await postRepository.findById(id),
);