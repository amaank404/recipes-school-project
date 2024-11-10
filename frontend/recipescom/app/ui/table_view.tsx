'use client';

import { useState } from "react";
import { Recipe, RecipeData } from "../repository/types"

export function RecipeTableItem({recipe, className, onData, checked}: {recipe: Recipe, className?: string, onData?: (id: string, checked: boolean ) => void, checked?: boolean}) {
    return <tr className={className}>
        <td><input type="checkbox" onChange={(elem) => {
            onData?.(recipe.id, elem.target.checked);
        }} checked={checked}></input></td>
        <td>{recipe.date_added || "Unknown"}</td>
        <td>{recipe.name}</td>
        <td>{recipe.base}</td>
        <td>{recipe.tags.join(", ")}</td>
    </tr>
}

function NoRowsPlaceholder() {
    return <div className="w-full h-full flex items-center flex-col text-slate-400 py-20">
        <div className="material-symbols-rounded text-2xl">info</div>
        <h1 className="text-2xl"> Nothing Here </h1>
        <div>Try fiddling with the search</div>
    </div>
}

export default function TableView({className, data, onData}: {className?: string, data: Recipe[], onData?: (checked_items: string[]) => void}) {
    let [checkedItems, setCheckedItems] = useState<string[]>([]);
    
    const setAll = (v: boolean) => {
        const q = v ? data.map(recipe => recipe.id) : [];
        setCheckedItems(q);
        onData?.(q);
    }

    const setCheck = (id: string, v: boolean) => {
        let q: string[] = []
        if (v) {
            q = [...checkedItems, id];
            setCheckedItems(q)
        } else {
            q = checkedItems.filter(item => item !== id);
            setCheckedItems(q);
        }
        onData?.(q);
    }

    let rows = data.map(
        (recipe: Recipe) => 
            <RecipeTableItem
                recipe={recipe} 
                key={recipe.id} 
                className="odd:bg-pink-50 *:px-3 *:py-3"
                checked={checkedItems.includes(recipe.id)}
                onData={setCheck}/>
    );

    return <div className={className + " overflow-x-auto no-scrollbar"}>
    <div className="rounded-md overflow-hidden w-min border min-w-full">
        <table className="border-collapse min-w-full">
            <tbody className="*:text-nowrap">
                <tr className="bg-pink-600 text-white *:py-3 *:px-3 text-left">
                    <th>
                        <input type="checkbox" disabled={rows.length == 0} onChange={evt => {setAll(evt.target.checked)}}></input>
                    </th>
                    <th>
                        Timestamp
                    </th>
                    <th>
                        Name
                    </th>
                    <th>
                        Category
                    </th>
                    <th>
                        Tags
                    </th>
                </tr>
                {rows.length ? rows : ""}
            </tbody>
        </table>
        {rows.length ? "" : <NoRowsPlaceholder/>}
    </div>
</div>
}