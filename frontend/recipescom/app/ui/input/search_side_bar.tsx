import { useState } from "react";
import CategorySelector from "./category_selector";
import Search from "./search";
import TagSelectors from "./tag_select";

function SideBarHeading({children}: {children?: React.ReactNode}) {
    return <div className="text-slate-600 mt-4 text-xl mb-2">
        {children}
    </div>
}

export type SearchData = {
    search: string,
    tags: Set<string>,
    categories: Set<string>
    [key: string]: any
}

export default function SearchSideBar({onData}: {onData?: (data: SearchData) => any}) {
    const tags = ["Easy", "Hard", "Italian", "Advanced", "Make-it-at-Home", "Chinese", "Rice", "Chowmein", "Indian", "Asian", "5-mins"]
    const cats = ["Pasta", "Chowmein", "Chinese", "Salads", "Idli", "Dosa"];

    let [data, setData] = useState<SearchData>({
        search: "", tags: new Set(), categories: new Set()
    });

    function setDataParam(prop: string, val: any) {
        let d = structuredClone(data);
        d[prop] = val;

        onData?.(d);
        setData(d);
    }

    return <div className="bg-slate-100 w-full lg:w-72 lg:min-h-screen h-full p-5 flex flex-col items-center flex-shrink-0 group">
        <Search onData={(d) => setDataParam("search", d)}/>
            <SideBarHeading>Tags</SideBarHeading>
            <TagSelectors tags={tags} onData={(d) => setDataParam("tags", d)}/>
            <SideBarHeading>Categories</SideBarHeading>
            <CategorySelector cats={cats} onData={(d) => setDataParam("categories", d)}/>
    </div>
}