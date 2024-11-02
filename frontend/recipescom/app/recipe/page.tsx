'use client';

import { useSearchParams } from "next/navigation";
import RecipeView from "../ui/recipe_view";

export default function RecipePage() {
    const params = useSearchParams();
    const id = params.get("id");
    if (id === null) {
        throw new Error("ID is null");
    }
    
    return <>
        <RecipeView id={id}/>
    </>
}