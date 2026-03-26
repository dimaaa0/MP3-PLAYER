import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import CreatePostButton from "../../components/CreatePostButton"; 

export async function Prisma() {
  const user = await getCurrentUser();
  const userId = user.id;

  const posts = await prisma.post.findMany({ where: { userId } });

  return (
    <div className="mx-4 my-6 max-w-5xl">
      <div className="mb-4 border-b border-slate-300 pb-2">
        <h2 className="text-2xl font-semibold">Prisma Data</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-xs text-slate-500">ID: {post.id}</div>
            <h3 className="mt-1 text-base font-medium text-slate-800">
              {post.name || "Untitled post"}
            </h3>
            <h5 className="text-sm text-slate-500">
              Date: {post.createdAt?.toLocaleDateString()}
            </h5>
            <p className="text-stone-800">Author ID: {post.userId}</p>
          </article>
        ))}
      </div>
      <CreatePostButton/>
      <Link href="/">Home</Link>
    </div>
  );
}

export default Prisma;
