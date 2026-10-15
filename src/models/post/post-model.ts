import type { PublicUserDto } from '@/src/lib/user/schemas';

export type PostModel = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImageUrl: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    author: string;
};

export type PostModelFromApi = Omit<PostModel, 'author'> & {
  author: PublicUserDto;
};