"use client";

import { useRouter } from "next/navigation";

export default function RecipeItem({
  id,
  image_url,
  name,
  base,
  tags,
}: {
  id: string;
  image_url: string;
  name: string;
  base: string;
  tags: string[];
}) {
  let router = useRouter();

  return (
    <span onClick={() => router.push(`/app/recipe?id=${id}`)}>
      <div className="shadow-sm rounded-md overflow-hidden w-48 p-1.5 bg-white mb-1 group cursor-pointer">
        <img
          src={image_url + ".jpg"}
          alt="recipe image"
          width={300}
          height={200}
          className="w-full h-24 rounded-md object-cover"
        />
        <div className="group-hover:underline">{name}</div>
        <div className="uppercase tracking-[0.2em] text-xs text-gray-500 font-semibold">
          {base}
        </div>
        <div className="flex *:flex-shrink-0 overflow-x-auto gap-1 mt-2 no-scrollbar">
          {tags.map((tag) => (
            <div
              key={tag}
              className="text-xs rounded-full bg-pink-100 text-pink-700 px-2"
            >
              {" "}
              {tag}
            </div>
          ))}
        </div>
      </div>
    </span>
  );
}
