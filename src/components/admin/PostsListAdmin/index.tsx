import { findAllPostAdmin } from "@/src/lib/post/queries/admin";
import Link from "next/link";
import { DelelePostButton } from "../PostDeleteButton";
import ErrorMessage from "../../ErrorMessage";


export default async function PostListAdmin() {
  const posts = await findAllPostAdmin();

    if (posts.length <= 0) return <ErrorMessage contentTitle="Ops!" content='Nenhum post foi criado' />

  return (
    <div className='mb-16'>
      {posts.map((post) => (
        <div
          className={`py-2 px-2 ${!post.published && "bg-slate-300"} flex gap-2 items-center justify-between`}
          key={post.id}
        >
          <Link href={`/admin/post/${post.id}`}>{post.title}</Link>

          {!post.published && <span className="text-xl text-slate-600 italic"> (Não publicado)</span>}

          <DelelePostButton id={post.id} title={post.title}/>
        </div>
      )
      )}

    </div>
  );
}