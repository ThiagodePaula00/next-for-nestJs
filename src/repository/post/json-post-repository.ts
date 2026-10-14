
import { PostModel } from '@/src/models/post/post-model';
import { PostRepository } from './post-repository';
import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises'

const simulateWaitMs = Number(process.env.SIMULATE_WAIT_IN_MS) || 0;

const ROOT_DIR = process.cwd();
const JSON_POSTS_FILE_PATH = resolve(ROOT_DIR, 'src', 'db','seed', 'posts.json');

export class JsonPostRepository implements PostRepository {
  private async simulateWait() {
    if (simulateWaitMs <= 0) return;

    await new Promise(resolve => setTimeout(resolve, simulateWaitMs));
  }

  private async readFromDisk(): Promise<PostModel[]> {
    const jsonContent = await readFile(JSON_POSTS_FILE_PATH, 'utf-8');
    const parsedJson = JSON.parse(jsonContent);
    const { posts } = parsedJson;
    return posts;
  }

  private async writeToDisk(posts: PostModel[]): Promise<void> {
    await writeFile(
      JSON_POSTS_FILE_PATH,
      JSON.stringify({ posts }, null, 2) + '\n',
      'utf-8',
    );
  }

  async findAllPublic(): Promise<PostModel[]> {
    await this.simulateWait();

    const posts = await this.readFromDisk();
    return posts.filter(post => post.published);
  }

  async findAll(): Promise<PostModel[]> {
    await this.simulateWait();

    const posts = await this.readFromDisk();
    return posts;
  }

  async findById(id: string): Promise<PostModel | undefined> {
      const posts = await this.findAll();
      return posts.find(post => post.id === id);
  }

  async deleteById(id: string): Promise<PostModel | undefined> {
      const jsonContent = await readFile(JSON_POSTS_FILE_PATH, 'utf-8');
      const { posts }: { posts: PostModel[] } = JSON.parse(jsonContent);
      const postIndex = posts.findIndex(post => post.id === id);

      if (postIndex === -1) return undefined;

      const [post] = posts.splice(postIndex, 1);
      await writeFile(JSON_POSTS_FILE_PATH, JSON.stringify({ posts }, null, 2) + '\n', 'utf-8');

      return post;
  }

  async findBySlugPublic(slug: string): Promise<PostModel> {
      const posts = await this.findAllPublic()
      const post = posts.find(post => post.slug === slug);

      if(!post) throw new Error('Post não encontrado para slug');

      return post;
  }

  async create(post: PostModel): Promise<PostModel> {
    const posts = await this.findAll();

    if (!post.id || !post.slug) {
      throw new Error('Post sem ID ou Slug');
    }

    const existingPost = posts.find(
      savedPost => savedPost.id === post.id || savedPost.slug === post.slug,
    );

    if (existingPost) {
      throw new Error('ID ou Slug devem ser únicos');
    }

    posts.push(post);
    await this.writeToDisk(posts);
    return post;
  }

  async delete(id: string): Promise<PostModel> {
    const post = await this.deleteById(id);

    if (!post) {
      throw new Error('Post não existe');
    }

    return post;
  }

  async update(
    id: string,
    newPostData: Omit<PostModel, 'id' | 'slug' | 'createdAt' | 'updatedAt'>,
  ): Promise<PostModel> {
    const posts = await this.findAll();
    const postIndex = posts.findIndex(post => post.id === id);

    if (postIndex < 0) {
      throw new Error('Post não existe');
    }

    const updatedPost: PostModel = {
      ...posts[postIndex],
      ...newPostData,
      updatedAt: new Date().toISOString(),
    };

    posts[postIndex] = updatedPost;
    await this.writeToDisk(posts);
    return updatedPost;
  }
}