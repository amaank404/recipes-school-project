"use client";

import {
  checkAPIError,
  checkType,
  isAPIError,
  isRecipe,
  Recipe,
  RecipeData,
} from "./types";

export class PyAPIRepository {
  private api_base: string;

  constructor(api_base: string) {
    this.api_base = api_base;
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
    checkType(response, isRecipe);

    return response;
  }
}
