
import { postRepository } from '@/src/repository/post';
import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';

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

export const findPostByIdCached = cache(
  async (id: string) => await postRepository.findById(id),
);