import { PyAPIRepository } from "./pyapi_repository";
import { Recipe, RecipeData, SearchParams } from "./types";

let repository: PyAPIRepository;

export function initRepo() {
  if (repository === undefined) {
    repository = new PyAPIRepository(
      process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9422",
      localStorage.getItem("password") || ""
    );
  }
}

export async function get_list(category: string): Promise<Recipe[]> {
  return repository.get_list(category);
}

export async function get_recipe(id: string): Promise<RecipeData> {
  return repository.get_recipe(id);
}

export async function search(
  search: SearchParams,
  page: number = 0,
  abortSignal?: AbortSignal
): Promise<Recipe[]> {
  return repository.search(search, page, abortSignal);
}

export async function save_recipe(recipe: RecipeData): Promise<void> {
  return repository.save_recipe(recipe);
}

export async function get_all_tags(): Promise<string[]> {
  return repository.get_all_tags();
}

export async function get_all_categories(): Promise<string[]> {
  return repository.get_all_categories();
}

export async function gen_recipe(recipe: string): Promise<any> {
  return repository.gen_recipe(recipe);
}

export async function delete_recipe(recipe: string[]): Promise<any> {
  return repository.delete_recipe(recipe);
}

export async function try_auth() {
  repository.auth();
}
