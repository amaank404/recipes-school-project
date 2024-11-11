export interface Recipe {
  id: string;
  image_url: string;
  name: string;
  base: string;
  tags: string[];
  date_added?: string;
}

export interface RecipeData {
  recipe: Recipe;
  content: string;
}

export interface APIError {
  code: number;
  error: string;
  msg: string;
}

export interface SearchParams {
  query: (string | number)[][];
}

export function isRecipe(obj: any): obj is Recipe {
  return (
    obj.id !== undefined &&
    obj.image_url !== undefined &&
    obj.name !== undefined &&
    obj.base !== undefined &&
    obj.tags !== undefined
  );
}

export function isRecipeData(obj: any): obj is RecipeData {
  return isRecipe(obj.recipe) && obj.content !== undefined;
}

export function isAPIError(obj: any): obj is APIError {
  return (
    obj.code !== undefined && obj.error !== undefined && obj.msg !== undefined
  );
}

export function checkAPIError(obj: any) {
  if (isAPIError(obj)) {
    console.error(obj.code, obj.error, obj.msg);
    throw new Error(`${obj.code} ${obj.error} ${obj.msg}`);
  }
}

export function checkType(obj: any, type_checker: (arg0: any) => boolean) {
  if (!type_checker(obj)) {
    console.error(
      "Object of incorrect type: ",
      obj,
      "had type checker",
      type_checker
    );
    throw new Error("Runtime Type Check failed");
  }
}

export function genEmptyRecipeData(): RecipeData {
  return {
    content: "",
    recipe: {
      id: "",
      image_url: "",
      name: "",
      base: "",
      tags: [],
      date_added: "",
    },
  };
}
