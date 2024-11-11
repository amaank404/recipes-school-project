"use client";

import { useSearchParams } from "next/navigation";
import RecipeView from "../../ui/recipe_view";
import { Suspense } from "react";

function RecipeSuspenseWrapper() {
  const params = useSearchParams();
  const id = params.get("id");
  if (id === null) {
    throw new Error("ID is null");
  }

  return (
    <>
      <RecipeView id={id} />
    </>
  );
}

export default function RecipePage() {
  return (
    <Suspense>
      <RecipeSuspenseWrapper />
    </Suspense>
  );
}
