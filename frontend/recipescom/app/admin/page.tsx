'use client';

import { useState } from "react";
import Button from "../ui/input/button";
import SearchSideBar from "../ui/input/search_side_bar";
import Popup from "../ui/popup";
import TableView from "../ui/table_view";

export default function Admin() {
    let [popup, setPopup] = useState();

    function addRecipe() {

    }

    function deleteRecipe() {

    }

    function editRecipe() {

    }

    return <div className="flex max-lg:flex-col">
        <SearchSideBar/>
        <div className="flex flex-col items-center w-full">
            <h1 className="text-4xl font-semibold text-slate-700 mt-4">Admin</h1>
            <div className="w-full max-lg:px-5 py-10 px-20">
                <div className="flex justify-between w-full">
                    <div className="flex gap-2">
                        <Button label="Delete" color="red" onClick={deleteRecipe}/>
                        <Button label="Add" color="green" onClick={addRecipe}/>
                    </div>
                    <Button label="Edit" color="pink" onClick={editRecipe}/>
                </div>
                <TableView className="mt-3"/>
            </div>
        </div>
    </div>
}