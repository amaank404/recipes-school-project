import { DummyRepository } from "./dummy";

let repository = new DummyRepository();

export async function get_list(category: string): Promise<Recipe[]> {
    return repository.get_list(category);
}