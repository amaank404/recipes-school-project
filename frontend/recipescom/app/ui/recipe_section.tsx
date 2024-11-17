"use client";

import RecipeItem from "./recipe_item";
import React, { useEffect, useState } from "react";
import { get_list } from "@/app/repository/repository";
import clsx from "clsx";
import { Recipe } from "../repository/types";

// 192x172 px
// 12x10.75 rem
function RecipePlaceHolderItem() {
  return (
    <div className="shadow-sm rounded-md overflow-hidden w-48 p-1.5 bg-white mb-1 h-44">
      <div className="w-full h-24 rounded-md object-cover bg-slate-100"> </div>
      <div className="h-4 mt-2 w-28 bg-slate-100"></div>
      <div className="text-xs h-3 w-20 mt-1 bg-slate-100"></div>
    </div>
  );
}

function RecipesPlaceHolder() {
  let elems = [];
  for (let x = 0; x < 10; x++) {
    elems.push(<RecipePlaceHolderItem key={x} />);
  }

  return (
    <div className="flex *:flex-shrink-0 overflow-x-hidden gap-3">
      {" "}
      {elems}{" "}
    </div>
  );
}

function RecipesEmptyPlaceHolder() {
  return (
    <div className="w-full bg-slate-100 text-slate-400 rounded-md text-center h-44 align-middle flex flex-col justify-center">
      <div className="material-symbols-rounded text-2xl">info</div>
      <h1 className="text-xl font-semibold">Nothing Here</h1>
      <div>Check in sometime later!</div>
    </div>
  );
}

function RecipeLoadFailure({ error_data }: { error_data?: string }) {
  return (
    <div className="w-full bg-red-100 text-red-600 rounded-md text-center h-44 align-middle flex flex-col justify-center">
      <div className="material-symbols-rounded text-2xl">error</div>
      <div>
        Something went wrong <br /> Please reload the page{" "}
      </div>
      {error_data ? (
        <div className="font-mono">Error: {error_data}</div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default function RecipeSection({
  title,
  fetch,
}: {
  title: string;
  fetch: string;
}) {
  const [state, setState] = useState("loading");
  const [data, setData] = useState<Recipe[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    get_list(fetch)
      .then((recipes) => {
        setData(recipes);
        setState("success");
      })
      .catch((err) => {
        setState("failed");
        setError(err.message);
      });

    return () => {
      setState("loading");
    };
  }, [fetch]);

  let elems: React.ReactNode[] = [];
  if (state === "success") {
    for (let x of data) {
      elems.push(
        <RecipeItem
          id={x.id}
          image_url={x.image_url}
          name={x.name}
          base={x.base}
          tags={x.tags}
          key={x.id}
        />
      );
    }
  }

  return (
    <div className="sm:px-20 px-4">
      <div
        className={clsx(
          "text-3xl font-semibold mb-2",
          state === "loading" && "text-gray-400"
        )}
      >
        {title}
      </div>
      {state === "loading" ? (
        <RecipesPlaceHolder />
      ) : state === "failed" ? (
        <RecipeLoadFailure error_data={error} />
      ) : elems.length === 0 ? (
        <RecipesEmptyPlaceHolder />
      ) : (
        <div className="flex *:flex-shrink-0 overflow-x-auto gap-3 no-scrollbar">
          {elems}
        </div>
      )}
    </div>
  );
}
