import { DummyRepository } from "./dummy";

const repository = new DummyRepository();

export async function get_list(category: string): Promise<Recipe[]> {
    return repository.get_list(category);
}

export async function get_recipe(id: string): Promise<RecipeData> {
    return repository.get_recipe(id);
}