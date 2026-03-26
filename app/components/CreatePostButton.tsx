"use client";

import { useRouter } from "next/navigation";

export default function CreatePostButton() {
  const router = useRouter();

  const handleCreate = async () => {
    const res = await fetch("/api/posts", { method: "POST" });
    router.refresh();
  };

  return (
    <button
      onClick={handleCreate}
      className="p-4 mt-4 rounded-lg bg-black w-full cursor-pointer text-white"
    >
      Create Post
    </button>
  );
}
