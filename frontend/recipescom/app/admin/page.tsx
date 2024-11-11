"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Button from "../ui/input/button";
import SearchSideBar, { SearchData } from "../ui/input/search_side_bar";
import Popup from "../ui/popup";
import TableView from "../ui/table_view";
import EditView from "./editview";
import { search } from "../repository/repository";
import { Recipe, SearchParams } from "../repository/types";
import Loader from "../ui/loader";
import LoadFailure from "../ui/load_failure";
import _ from "lodash";

function RecipeTableLoader({
  className,
  onData,
  query,
}: {
  className?: string;
  onData?: (recipes: string[]) => void;
  query: SearchParams;
}) {
  let [data, setData] = useState<Recipe[]>();
  let [state, setState] = useState("loading");
  let [err, setErr] = useState("");
  const currentQuery = useRef(query);

  if (!_.isEqual(currentQuery.current, query)) {
    setState("loading");
    currentQuery.current = query;
  }

  useEffect(() => {
    if (state !== "success") onData?.([]);

    search(query)
      .then((data) => {
        setData(data);
        setState("success");
      })
      .catch((e) => {
        setErr(e.message);
        setState("error");
      });
  }, [state]);

  if (state === "loading") {
    return <Loader className={className} nobackbutton />;
  } else if (state === "success") {
    return (
      <TableView
        className={className}
        data={data as Recipe[]}
        onData={onData}
      />
    );
  } else if (state === "error") {
    return <LoadFailure err={err} className={className} nobackbutton />;
  }
}

export default function Admin() {
  let [id, setId] = useState<string | null>(null);
  let [searchData, setSearchData] = useState<SearchData>();
  let [select, setSelect] = useState<string[]>([]);

  let query: SearchParams = {
    query: [],
  };

  if (searchData) {
    let catArr = [];
    for (let x of searchData.categories) {
      catArr.push(x.toLowerCase());
    }

    if (catArr.length)
      query.query.push(["contains", "recipes.base", ...catArr]);
    if (searchData.tags.size)
      query.query.push(["contains", "tags.tag", ...searchData.tags]);
    if (searchData.search.trim().length)
      query.query.push(["search", "recipes.name", searchData.search.trim()]);
  }

  const setSelectData = useCallback((d: string[]) => {
    setSelect(d);
  }, []);

  function addRecipe() {
    setId("new");
  }

  function deleteRecipe() {
    console.error("Deletion not implemented yet");
  }

  function editRecipe() {
    setId(select[0]);
  }

  return (
    <div className="flex max-lg:flex-col">
      <SearchSideBar onData={(d) => setSearchData(d)} />
      <div className="flex flex-col items-center min-w-0 w-full">
        <h1 className="text-4xl font-semibold text-slate-700 mt-4">Admin</h1>
        <div className="w-full max-lg:px-5 py-10 px-20">
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <Button
                label="Delete"
                color="red"
                onClick={deleteRecipe}
                disabled={select.length === 0}
              />
              <Button label="Add" color="green" onClick={addRecipe} />
            </div>
            <Button
              label="Edit"
              color="pink"
              onClick={editRecipe}
              disabled={select.length !== 1}
            />
          </div>
          <RecipeTableLoader
            className="mt-4 max-w-full"
            query={query}
            onData={setSelectData}
          />
        </div>

        {id !== null ? (
          <Popup>
            <EditView
              id={id}
              onClose={() => setId(null)}
              nobackbutton
              className="w-full max-w-screen-lg bg-white p-3 rounded-md m-6"
            />
          </Popup>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
