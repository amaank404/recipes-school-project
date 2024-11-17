"use client";

import { useEffect, useState } from "react";
import CategorySelector from "./category_selector";
import Search from "./search";
import TagSelectors from "./tag_select";
import { get_all_categories, get_all_tags } from "@/app/repository/repository";
import clsx from "clsx";
import BackButton from "../backbutton";

function SideBarHeading({ children }: { children?: React.ReactNode }) {
  return <div className="text-slate-600 mt-4 text-xl mb-2">{children}</div>;
}

export type SearchData = {
  search: string;
  tags: Set<string>;
  categories: Set<string>;
  [key: string]: any;
};

export default function SearchSideBar({
  onData,
  backButton,
}: {
  onData?: (data: SearchData) => any;
  backButton?: boolean;
}) {
  const [tags, setTags] = useState<string[]>([]);
  const [cats, setCats] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const tags_promise = get_all_tags();
      const cats_promise = get_all_categories();

      const [tags1, cats1] = await Promise.all([tags_promise, cats_promise]);

      setTags(tags1);
      setCats(cats1);
    }

    fetchData();
  }, []);

  let [data, setData] = useState<SearchData>({
    search: "",
    tags: new Set(),
    categories: new Set(),
  });

  function setDataParam(prop: string, val: any) {
    let d = structuredClone(data);
    d[prop] = val;

    onData?.(d);
    setData(d);
  }

  return (
    <div
      className={clsx(
        "bg-slate-100 w-full lg:w-72 lg:min-h-screen p-5 flex flex-col items-center flex-shrink-0 group",
        { "pt-20": backButton }
      )}
    >
      {backButton ? <BackButton /> : ""}
      <Search onData={(d) => setDataParam("search", d)} />
      <SideBarHeading>Tags</SideBarHeading>
      <TagSelectors tags={tags} onData={(d) => setDataParam("tags", d)} />
      <SideBarHeading>Categories</SideBarHeading>
      <CategorySelector
        cats={cats}
        onData={(d) => setDataParam("categories", d)}
      />
    </div>
  );
}
