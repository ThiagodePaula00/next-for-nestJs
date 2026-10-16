import { findPublicPostBySlugFromApiCached } from '@/src/lib/post/queries/public';
import { normalizeUploadedImageSrc } from '@/src/utils/normalize-uploaded-image-src';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PostHeading } from '../PostHeading';
import { PostDate } from '../PostDate';
import { SafeMarkdown } from '../SafeMarkdown';

type SinglePostProps = {
  slug: string;
};

export async function SinglePost({ slug }: SinglePostProps) {
  const postResponse = await findPublicPostBySlugFromApiCached(slug);

  if (!postResponse.success) {
    notFound();
  }

  const post = postResponse.data;

  return (
    <article className='mb-16'>
      <header className='group flex flex-col gap-4 mb-4'>
        <Image
          className='roudend-xl'
          src={normalizeUploadedImageSrc(post.coverImageUrl)}
          width={1200}
          height={720}
          alt={post.title}
        />

        <PostHeading url={`/post/${post.slug}`}>{post.title}</PostHeading>

        <p>
          {post.author.name} | <PostDate dateTime={post.createdAt} />
        </p>
      </header>

      <p className='text-xl mb-4 text-slate-600'>{post.excerpt}</p>

      <SafeMarkdown markdown={post.content} />
    </article>
  );
}