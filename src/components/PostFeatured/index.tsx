import { findAllPublicPostsFromApiCached } from '@/src/lib/post/queries/public';
import ErrorMessage from '../ErrorMessage';
import { PostCoverImage } from '../PostCoverImage';
import { PostSummary } from '../PostSummary';

export async function PostFeatured() {
    const postsResponse = await findAllPublicPostsFromApiCached();
    const noPostsFound = (
        <ErrorMessage
            contentTitle='Ops 😅'
            content='Ainda não criamos nenhum post.'
        />
    );

    if (!postsResponse.success) {
        return noPostsFound;
    }

    const posts = postsResponse.data;

    if (posts.length <= 0) {
        return noPostsFound;
    }

    const post = posts[0];
    const postLink = `/post/${post.slug}`;

    return (
        <section className='grid grid-cols-1 gap-8 mb-16 sm:grid-cols-2 group'>
            <PostCoverImage
                linkProps={{ href: postLink }}
                imageProps={{
                    width: 1200,
                    height: 700,
                    src: post.coverImageUrl,
                    alt: post.title,
                    priority: true,
                }}
            />

            <PostSummary
                postLink={postLink}
                postHeading='h1'
                createdAt={post.createdAt}
                excerpt={post.excerpt}
                title={post.title}
            />
        </section>
    );
}