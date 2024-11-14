import { Metadata } from "next";
import HomePageClient from "./page_client";

export const metadata: Metadata = {
  title: "Recipes.com",
};

export const dynamic = "force-dynamic";

function choose<T>(choices: T[]) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}
export default function HomePage() {
  let banner_imgs = [
    "beef.webp",
    "1.jpg",
    "2.webp",
    "3.jpg",
    "4.webp",
    "6.webp",
    "eggs.jpg",
    "pasta.jpg",
  ];

  const banner_img = choose(banner_imgs);

  return <HomePageClient img={banner_img} />;
}
