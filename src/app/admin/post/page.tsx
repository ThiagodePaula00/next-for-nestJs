import { Metadata } from "next";
import { Suspense } from "react";
import { SpinLoader } from "../../../components/spinLoader";
import PostListAdmin from "@/src/components/admin/PostsListAdmin";


export const metadata: Metadata = {
    title: 'Post Admin',
};

export default function adminPostPage() {
  return (
    <Suspense fallback={<SpinLoader className="mb-16" />}>
      <PostListAdmin />
    </Suspense>
  );
}