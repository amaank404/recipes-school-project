"use server";

import {
  AuthAction,
  checkAPIError,
  checkType,
  isRecipe,
  isRecipeData,
  Recipe,
  RecipeData,
  SearchParams,
} from "./types";

let api_base: string = process.env.API_BASE || "http://localhost:9422/";

export async function auth(
  password: string,
  tokenInitial?: string
): Promise<AuthAction> {
  let token = tokenInitial || "";
  if (await check_valid_token(token)) {
    return { type: "token", value: token };
  }

  let payload = new FormData();
  payload.append("password", password);
  let response = await (
    await fetch(api_base + "/admin/auth", {
      body: payload,
      method: "POST",
    })
  ).json();

  try {
    checkAPIError(response);
  } catch (error) {
    return { type: "href", value: "/admin/login" };
  }

  return { type: "token", value: response.token };
}

export async function check_valid_token(token: string): Promise<boolean> {
  try {
    let response = await (
      await fetch(api_base + "/admin/token_check?token=" + token)
    ).json();
    checkAPIError(response);
    return true;
  } catch (e) {
    return false;
  }
}

export async function get_list(category: string): Promise<Recipe[]> {
  let response = await (
    await fetch(api_base + "/api/v1/recipes/cat/" + category)
  ).json();
  checkAPIError(response);
  for (let x of response) {
    checkType(x, isRecipe);
  }

  return response;
}

export async function get_recipe(id: string): Promise<RecipeData> {
  let response = await (
    await fetch(api_base + "/api/v1/recipes/get/" + id)
  ).json();
  checkAPIError(response);
  checkType(response, isRecipeData);

  return response;
}

export async function search(
  s: SearchParams,
  page: number = 0
): Promise<Recipe[]> {
  let response = await (
    await fetch(api_base + `/api/v1/recipes/search?page=${page}`, {
      method: "POST",
      body: JSON.stringify(s),
      headers: { "Content-Type": "application/json" },
    })
  ).json();

  checkAPIError(response);
  for (let x of response) {
    checkType(x, isRecipe);
  }

  return response;
}

export async function save_recipe(recipe: RecipeData, token: string) {
  let formData = new FormData();

  let recipeFinal = {
    ...recipe.recipe,
    image_url: "",
    recipe: recipe.content,
  };

  const b = await fetch(recipe.recipe.image_url);

  formData.append("recipe_data", JSON.stringify(recipeFinal));
  formData.append("image", await b.blob(), "image");
  formData.append("token", token);

  let response = await (
    await fetch(api_base + "/admin/recipes/add", {
      method: "POST",
      body: formData,
    })
  ).json();

  checkAPIError(response);
}

export async function get_all_tags(): Promise<string[]> {
  let response = await (await fetch(api_base + "/api/v1/get_all_tags")).json();

  checkAPIError(response);

  return response;
}

export async function get_all_categories(): Promise<string[]> {
  let response = await (
    await fetch(api_base + "/api/v1/get_all_categories")
  ).json();

  checkAPIError(response);

  return response;
}

export async function gen_recipe(recipe: string, token: string): Promise<any> {
  let response = await (
    await fetch(
      api_base +
        "/admin/gen_recipe/" +
        encodeURIComponent(recipe) +
        "?token=" +
        encodeURIComponent(token)
    )
  ).json();

  checkAPIError(response);

  return response;
}

export async function delete_recipe(
  ids: string[],
  token: string
): Promise<any> {
  const payload = JSON.stringify(ids);

  let response = await await fetch(
    api_base + `/admin/recipes/remove?token=${token}`,
    {
      method: "POST",
      body: payload,
      headers: { "Content-Type": "application/json" },
    }
  );

  checkAPIError(response);
}
