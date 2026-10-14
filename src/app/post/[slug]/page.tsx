import { SinglePost } from '../../../components/SinglePost';
import { SpinLoader } from '../../../components/spinLoader';
import { findPublicPostBySlugCached } from '../../../lib/post/queries/public';
import { Metadata } from 'next';
import { Suspense } from 'react';

type PostSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PostSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPublicPostBySlugCached(slug);

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function PostSlugPage({ params }: PostSlugPageProps) {
  return (
    <Suspense fallback={<SpinLoader className='min-h-20 mb-16' />}>
      <PostContent params={params} />
    </Suspense>
  );
}

async function PostContent({ params }: PostSlugPageProps) {
  const { slug } = await params;
  return <SinglePost slug={slug} />;
}