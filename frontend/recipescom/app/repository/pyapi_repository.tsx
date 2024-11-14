"use client";

import {
  checkAPIError,
  checkType,
  isAPIError,
  isRecipe,
  isRecipeData,
  Recipe,
  RecipeData,
  SearchParams,
} from "./types";

export class PyAPIRepository {
  private api_base: string;
  private token: string = "";
  private password: string;

  constructor(api_base: string, password: string) {
    this.password = password;
    this.api_base = api_base;
  }

  async auth() {
    this.token = localStorage.getItem("token") || "";
    await this.check_valid_token();

    if (this.token) return;

    let payload = new FormData();
    payload.append("password", this.password);
    let response = await (
      await fetch(this.api_base + "/admin/auth", {
        body: payload,
        method: "POST",
      })
    ).json();

    try {
      checkAPIError(response);
    } catch (error) {
      window.location.href = "/admin/login";
    }

    localStorage.setItem("token", response.token);
    this.token = response.token;
  }

  async check_valid_token(): Promise<boolean> {
    try {
      let response = await (
        await fetch(this.api_base + "/admin/token_check?token=" + this.token)
      ).json();
      checkAPIError(response);
      return true;
    } catch (e) {
      this.token = "";
      return false;
    }
  }

  async get_list(category: string): Promise<Recipe[]> {
    let response = await (
      await fetch(this.api_base + "/api/v1/recipes/cat/" + category)
    ).json();
    checkAPIError(response);
    for (let x of response) {
      checkType(x, isRecipe);
    }

    return response;
  }

  async get_recipe(id: string): Promise<RecipeData> {
    let response = await (
      await fetch(this.api_base + "/api/v1/recipes/get/" + id)
    ).json();
    checkAPIError(response);
    checkType(response, isRecipeData);

    return response;
  }

  async search(s: SearchParams): Promise<Recipe[]> {
    let response = await (
      await fetch(this.api_base + "/api/v1/recipes/search", {
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

  async save_recipe(recipe: RecipeData) {
    await this.auth();

    let formData = new FormData();

    let recipeFinal = {
      ...recipe.recipe,
      image_url: "",
      recipe: recipe.content,
    };

    const b = await fetch(recipe.recipe.image_url);

    formData.append("recipe_data", JSON.stringify(recipeFinal));
    formData.append("image", await b.blob(), "image");
    formData.append("token", this.token);

    let response = await (
      await fetch(this.api_base + "/admin/recipes/add", {
        method: "POST",
        body: formData,
      })
    ).json();

    checkAPIError(response);
  }

  async get_all_tags(): Promise<string[]> {
    let response = await (
      await fetch(this.api_base + "/api/v1/get_all_tags")
    ).json();

    checkAPIError(response);

    return response;
  }

  async get_all_categories(): Promise<string[]> {
    let response = await (
      await fetch(this.api_base + "/api/v1/get_all_categories")
    ).json();

    checkAPIError(response);

    return response;
  }

  async gen_recipe(recipe: string): Promise<any> {
    let response = await (
      await fetch(
        this.api_base + "/api/v1/gen_recipe/" + encodeURIComponent(recipe)
      )
    ).json();

    checkAPIError(response);

    return response;
  }
}
