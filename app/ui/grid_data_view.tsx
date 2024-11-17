"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Recipe, SearchParams } from "../repository/types";
import { search } from "../repository/repository";
import Loader from "./loader";
import PageSelector from "./input/page_selector";
import LoadFailure from "./load_failure";
import _ from "lodash";
import { useRouter } from "next/navigation";

function GridDataViewItem({ recipe }: { recipe: Recipe }) {
  let router = useRouter();

  let [opacity, setOpacity] = useState(0);

  return (
    <span onClick={() => router.push(`/app/recipe?id=${recipe.id}`)}>
      <div className="shadow-sm rounded-md overflow-hidden w-full bg-white mb-1 group cursor-pointer flex">
        <img
          src={recipe.image_url + ".jpg"}
          alt="recipe image"
          width={300}
          height={200}
          className="w-48 h-36 object-cover bg-slate-100 transition-opacity flex-shrink-0"
          style={{ opacity: opacity }}
          onLoad={() => setOpacity(1)}
        />
        <div className="p-4 flex flex-col justify-center">
          <div className="group-hover:underline text-2xl">{recipe.name}</div>
          <div className="uppercase tracking-[0.2em] text-gray-500 font-semibold">
            {recipe.base}
          </div>
          <div className="flex *:flex-shrink-0 overflow-x-auto gap-1 mt-2 no-scrollbar">
            {recipe.tags.map((tag) => (
              <div
                key={tag}
                className="text-sm rounded-full bg-pink-100 text-pink-600 px-2"
              >
                {" "}
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </span>
  );
}

export function GridDataView({ data }: { data: Recipe[] }) {
  let items = [];

  for (let x of data) {
    items.push(<GridDataViewItem recipe={x} key={x.id} />);
  }

  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
      }}
    >
      {items}
    </div>
  );
}

export default function GridDataViewLoader({
  className,
  query,
  rerender,
}: {
  className?: string;
  query: SearchParams;
  rerender?: boolean;
}) {
  let [data, setData] = useState<Recipe[]>();
  let [state, setState] = useState("loading");
  let [err, setErr] = useState("");
  let [firstLoad, setFirstLoad] = useState(true);
  let [page, setPage] = useState(0);
  const currentQuery = useRef(query);

  useEffect(() => {
    setState("loading");
    setPage(0);
  }, [rerender]);

  useEffect(() => {
    const reqState = {
      update: true,
    };

    search(query, page)
      .then((data) => {
        if (!reqState.update) return;

        setData(data);
        setState("success");
        setFirstLoad(false);
      })
      .catch((e) => {
        setErr(e.message);
        setState("error");
        setFirstLoad(false);
      });

    return () => {
      reqState.update = false;
    };
  }, [state]);

  const onPageChange = useCallback(function (page: number) {
    setPage(page);
    setState("loading");
  }, []);

  if (!_.isEqual(currentQuery.current, query)) {
    onPageChange(0);
    currentQuery.current = query;
  }

  if (state === "loading" && firstLoad) {
    return <Loader className={className} nobackbutton />;
  } else if (state === "success" || (state === "loading" && !firstLoad)) {
    return (
      <div className={className}>
        <div className="flex flex-col">
          <PageSelector
            className="w-full mb-2 flex justify-end"
            page={page}
            onPageChange={onPageChange}
          />
          <GridDataView data={data as Recipe[]} />
        </div>
      </div>
    );
  } else if (state === "error") {
    return <LoadFailure err={err} className={className} nobackbutton />;
  }
}
