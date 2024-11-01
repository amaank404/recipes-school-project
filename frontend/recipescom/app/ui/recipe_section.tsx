'use client';

import RecipeItem from "./recipe_item";
import React, { Suspense, useEffect, useState } from "react";
import { get_list } from "@/app/repository/repository";

// 192x172
// 12x10.75
function RecipePlaceHolderItem () {
    return <div className="shadow-sm rounded-md overflow-hidden w-48 p-1.5 bg-white mb-1 h-44"> 
    <div className="w-full h-24 rounded-md object-cover bg-slate-100"> </div>
    <div className="h-4 mt-2 w-28 bg-slate-100"></div>
    <div className="text-xs h-3 w-20 mt-1 bg-slate-100"></div>
</div>
}

function RecipesPlaceHolder () {
    let elems = [];
    for (let x = 0; x < 10; x++) {
        elems.push(<RecipePlaceHolderItem key={x}/>);
    }

    return (<div className="flex *:flex-shrink-0 overflow-x-hidden gap-3"> {elems} </div>);
}

export default function RecipeSection({children, title, fetch}: {children?: React.ReactNode, title: string, fetch: string}) {
    const [state, setState] = useState("loading");
    const [data, setData] = useState<Recipe[]>([]);

    useEffect(() => {
        get_list(fetch).then((recipes) => {
            setData(recipes);
            setState("success");
        }).catch(() => {
            setState("failed");
        });

        return () => {};
    }, []);

    let elems: React.ReactNode[] = [];
    if (state === "success") {
        for (let x of data) {
            elems.push(<RecipeItem image_url={x.image_url} name={x.name} base={x.base} tags={x.tags} key={x.name}/>)
        }
    }

    return (
        <div className="px-12">
            <div className="text-3xl font-semibold mb-2">{title}</div>
            {state === "loading" ? <RecipesPlaceHolder/> : 
                <div className="flex *:flex-shrink-0 overflow-x-auto gap-3 no-scrollbar">
                    {elems}
                </div>
            }
        </div>
    );
}