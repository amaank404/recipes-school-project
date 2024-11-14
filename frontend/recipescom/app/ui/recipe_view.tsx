"use client";

import React, { useEffect, useState } from "react";
import { get_recipe, initRepo } from "@/app/repository/repository";
import RichText from "./rich_text";
import "./recipe_view.css";
import BackButton from "./backbutton";
import LoadingIndicator from "./loading_indicator";
import LoadFailure from "./load_failure";
import Image from "next/image";
import { RecipeData } from "@/app/repository/types";
import Loader from "./loader";

function RecipeBanner({
  image_url,
  name,
  base,
  tags,
}: {
  image_url: string;
  name: string;
  base: string;
  tags: string[];
}) {
  let tags_elem = tags.map((tag) => {
    return (
      <div
        className="rounded-full bg-black px-4 uppercase tracking-widest text-sm"
        key={tag}
      >
        {tag}
      </div>
    );
  });

  return (
    <div className="w-full h-[100vh] relative flex flex-col px-5 sm:px-20 justify-center text-white items-center">
      <div className="absolute top-0 bottom-0 left-0 right-0 bg-slate-400 -z-10">
        <img
          src={image_url}
          alt="recipe image"
          width={1920}
          height={1080}
          className="w-full h-full object-cover object-center filter brightness-[0.60]"
        />
      </div>
      <div className="max-w-screen-lg w-full relative h-full flex flex-col justify-center max-sm:items-center">
        <div
          className={`text-5xl sm:text-7xl lg:text-8xl font-medium text_stroke_white lg:text_stroke_2px max-sm:text-center`}
        >
          {name}
        </div>
        <div className="mt-20 sm:mt-2 tracking-[0.5em] uppercase text-2xl sm:text-4xl lg:text-5xl font-normal">
          {base}
        </div>

        <div className="absolute bottom-8 sm:right-0 flex gap-2 max-w-[80%] flex-wrap justify-center sm:justify-end">
          {tags_elem}
        </div>
      </div>
    </div>
  );
}

export default function RecipeView({ id }: { id: string }) {
  let [status, setStatus] = useState("loading");
  let [data, setData] = useState<RecipeData>();
  let [err, setErr] = useState("");

  useEffect(() => {
    initRepo();
    get_recipe(id)
      .then((recipe) => {
        setData(recipe);
        setStatus("success");
      })
      .catch((err) => {
        setErr(err.message);
        setStatus("failed");
      });

    return () => {
      setStatus("loading");
    };
  }, [id]);

  if (status === "loading") {
    return <Loader />;
  } else if (status === "failed") {
    return <LoadFailure err={err} />;
  } else if (status === "success") {
    if (data === undefined) {
      throw new Error("Undefined data after status success");
    }

    return (
      <div className="flex flex-col items-center">
        <BackButton />
        <RecipeBanner
          image_url={data.recipe.image_url}
          name={data.recipe.name}
          base={data.recipe.base}
          tags={data.recipe.tags}
        />
        <RichText classList="p-4 max-w-screen-md" variableSize={true}>
          {data.content}
        </RichText>
      </div>
    );
  }
}
