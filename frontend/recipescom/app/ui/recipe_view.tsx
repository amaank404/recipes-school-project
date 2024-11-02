"use client";

import React, { useEffect, useState } from "react";
import { get_recipe } from "@/app/repository/repository";
import RichText from "./rich_text";
import "./recipe_view.css";
import BackButton from "./backbutton";
import LoadingIndicator from "./loading_indicator";

function RecipePlaceholder() {
    return <div className="absolute top-0 left-0 flex items-center justify-center h-screen w-screen bg-white">
        <BackButton/>
        <LoadingIndicator/>
    </div>
}

function RecipeLoadFailure({err}: {err?: string}) {
    return <div className="absolute top-0 left-0 flex items-center justify-center h-screen w-screen bg-white">
        <BackButton/>
        <div className="w-4/5 max-w-screen-sm bg-red-100 text-red-600 rounded-md text-center h-44 align-middle flex flex-col justify-center">
            <div className="material-symbols-rounded text-2xl">error</div>
            <div>Something went wrong <br/> Please reload the page </div>
            {err ? <div className="font-mono">Error: {err}</div>: <></>}
        </div>
    </div>
}

function RecipeBanner({image_url, name, base, tags}: {image_url: string, name: string, base: string, tags: string[]}) {
    let tags_elem = tags.map((tag) => {
        return <div className="rounded-full bg-black px-4 uppercase tracking-widest text-sm" key={tag}>
            {tag}
        </div>
    })

    return <div className="w-full h-[100vh] relative flex flex-col px-5 sm:px-20 justify-center text-white items-center">
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-slate-400 -z-10">
            <img src={image_url} alt="recipe image" className="w-full h-full object-cover object-center filter brightness-[0.60]"/>
        </div>
        <div className="max-w-screen-lg w-full relative h-full flex flex-col justify-center max-sm:items-center">
            <div className={`text-5xl sm:text-7xl lg:text-8xl font-medium text_stroke_white lg:text_stroke_2px max-sm:text-center`}>
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
}

export default function RecipeView({id}: {id: string}) {
    let [status, setStatus] = useState("loading");
    let [data, setData] = useState<RecipeData>();
    let [err, setErr] = useState("");

    useEffect(() => {
        get_recipe(id).then(recipe => {
            setData(recipe);
            setStatus("success");
        }).catch(err => {
            setErr(err.message);
            setStatus("failed");
        })
    }, [])

    if (status === "loading") {
        return <RecipePlaceholder />;
    } else if (status === "failed") {
        return <RecipeLoadFailure err={err} />;
    } else if (status === "success") {
        if (data === undefined) {
            throw new Error("Undefined data after status success");
        }

        return <div className="flex flex-col items-center">
            <BackButton/>
            <RecipeBanner image_url={data.image_url} name={data.name} base={data.base} tags={data.tags}/>
            <RichText content={data.sections} classList="p-4 max-w-screen-md"/>
        </div>
    }
}