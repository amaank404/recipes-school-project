import { DummyRepository } from "./dummy";
import { PyAPIRepository } from "./pyapi_repository";
import { Recipe, RecipeData, SearchParams } from "./types";

// const repository = new PyAPIRepository("http://localhost:9422");
const repository = new DummyRepository();

export async function get_list(category: string): Promise<Recipe[]> {
    return repository.get_list(category);
}

export async function get_recipe(id: string): Promise<RecipeData> {
    return repository.get_recipe(id);
}

export async function search(search: SearchParams): Promise<Recipe[]> {
    return repository.search(search);
}