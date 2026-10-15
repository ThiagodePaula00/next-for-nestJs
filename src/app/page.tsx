import { Suspense } from "react";
import { SpinLoader } from "../components/spinLoader";
import { PostsList } from "../components/PostsList";
import { PostFeatured } from "../components/PostFeatured";

export default async function homePage() {

  return (
    <>
        <Suspense fallback={<SpinLoader className="min-h-20 mb-16" />}>
          <PostFeatured/>
          <PostsList />
        </Suspense>
    </>

  );
}