"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Button from "../ui/input/button";
import SearchSideBar, { SearchData } from "../ui/input/search_side_bar";
import Popup from "../ui/popup";
import TableView from "../ui/table_view";
import EditView from "./editview";
import {
  delete_recipe,
  initRepo,
  search,
  try_auth,
} from "../repository/repository";
import { Recipe, SearchParams } from "../repository/types";
import Loader from "../ui/loader";
import LoadFailure from "../ui/load_failure";
import _ from "lodash";
import searchDataToQuery from "../utils/searchdata_to_query";
import PageSelector from "../ui/input/page_selector";
import Link from "next/link";

function RecipeTableLoader({
  className,
  onData,
  query,
  rerender,
}: {
  className?: string;
  onData?: (recipes: string[]) => void;
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
    initRepo();
    try_auth();
  }, []);

  useEffect(() => {
    if (state !== "success") onData?.([]);

    initRepo();

    const abortController = new AbortController();
    const signal = abortController.signal;

    search(query, page, signal)
      .then((data) => {
        setData(data);
        setState("success");
        setFirstLoad(false);
      })
      .catch((e) => {
        if (e.name === "AbortError") {
          console.log("Fetch Abortion");
          return;
        }
        setErr(e.message);
        setState("error");
        setFirstLoad(false);
      });

    return () => {
      abortController.abort();
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
          <TableView data={data as Recipe[]} onData={onData} />
          <PageSelector
            className="w-full mt-2 flex justify-end"
            page={page}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    );
  } else if (state === "error") {
    return <LoadFailure err={err} className={className} nobackbutton />;
  }
}

export default function Admin() {
  let [id, setId] = useState<string | null>(null);
  let [searchData, setSearchData] = useState<SearchData>();
  let [select, setSelect] = useState<string[]>([]);
  let [confirmationPopup, setConfirmationPopup] = useState(false);
  let [rerender, setRerender] = useState(true);

  const do_rerender = useCallback(function () {
    setRerender(!rerender);
  }, []);

  const query = searchDataToQuery(searchData);

  const setSelectData = useCallback((d: string[]) => {
    setSelect(d);
  }, []);

  function addRecipe() {
    setId("new");
  }

  function showDeletetionRecipe() {
    setConfirmationPopup(true);
  }

  async function deleteRecipe() {
    initRepo();
    await delete_recipe(select);
    setConfirmationPopup(false);
    do_rerender();
  }

  function editRecipe() {
    setId(select[0]);
  }

  return (
    <div className="flex max-lg:flex-col">
      <SearchSideBar onData={(d) => setSearchData(d)} />
      <div className="flex flex-col items-center min-w-0 w-full relative">
        <Link
          className="mt-5 w-full px-5 flex items-center text-blue-600 absolute left-2 lg:left-16 top-2"
          href="/"
        >
          <span className="material-symbols-rounded">arrow_back</span>
          <span
            className="hover:underline ml-2 cursor-pointer"
            onClick={undefined}
          >
            Home Page
          </span>
        </Link>
        <h1 className="text-4xl font-semibold text-slate-700 mt-4">Admin</h1>

        <div className="w-full max-lg:px-5 py-10 px-20">
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <Button
                label="Delete"
                color="red"
                onClick={showDeletetionRecipe}
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
            rerender={rerender}
          />
        </div>

        {id !== null ? (
          <Popup>
            <EditView
              id={id}
              onClose={() => {
                setId(null);
                do_rerender();
              }}
              nobackbutton
              className="w-full max-w-screen-lg bg-white p-3 rounded-md m-6"
            />
          </Popup>
        ) : (
          ""
        )}

        {confirmationPopup ? (
          <Popup>
            <div className="bg-white p-4 rounded-lg w-64">
              <h1 className="font-semibold text-lg">Confirm Deletion</h1>
              <div>
                Are you sure that you want to delete the selected items?
              </div>
              <div className="flex gap-2 mt-2 *:flex-grow">
                <Button
                  label="Delete"
                  color="red"
                  onClick={() => deleteRecipe()}
                />
                <Button
                  label="Cancel"
                  color="blue"
                  onClick={() => setConfirmationPopup(false)}
                />
              </div>
            </div>
          </Popup>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
