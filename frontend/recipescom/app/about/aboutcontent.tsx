"use client";

import { useRouter } from "next/navigation";

export default function AboutContent() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="mt-5 w-full px-5 flex items-center text-blue-600">
        <span className="material-symbols-rounded">arrow_back</span>
        <span
          className="hover:underline ml-2 cursor-pointer"
          onClick={() => router.back()}
        >
          Back
        </span>
      </div>
      <div className="max-w-screen-md w-full p-4">
        <h1 className="text-6xl mb-3"> About </h1>
        <p>
          This Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Doloribus deleniti ex consequatur tempore voluptas, odio eum labore
          quos, ipsum quibusdam consectetur error est explicabo totam eligendi
          aut fuga porro pariatur.
        </p>
      </div>
    </div>
  );
}
