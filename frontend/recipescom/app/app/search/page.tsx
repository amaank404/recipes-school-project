"use client";

import SearchSideBar, { SearchData } from "@/app/ui/input/search_side_bar";
import searchDataToQuery from "../../utils/searchdata_to_query";
import { useMemo, useState } from "react";
import GridDataViewLoader from "@/app/ui/grid_data_view";

export default function SearchPage() {
  let [searchData, setSearchData] = useState<SearchData>();

  let query = useMemo(() => searchDataToQuery(searchData), [searchData]);

  return (
    <div className="flex max-lg:flex-col">
      <SearchSideBar onData={setSearchData} backButton />
      <div className="flex-grow">
        <GridDataViewLoader
          className="mt-4 max-w-full px-10 py-4"
          query={query}
        />
      </div>
    </div>
  );
}
