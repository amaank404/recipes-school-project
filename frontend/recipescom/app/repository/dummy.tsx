import { Recipe, RecipeData } from "./types";

export class DummyRepository {
    async get_list(cagegory: string): Promise<Recipe[]> {
        // await new Promise(resolve => setTimeout(resolve, 2000));
        switch (cagegory) {
            case "popular":
                return [
                    {
                        id: "c12",
                        image_url: "/images/chowmein.webp",
                        name: "Tadka Chowmein",
                        base: "chowmein",
                        tags: ["Chinese", "Easy"],
                    },
                    {
                        id: "c122",
                        image_url: "/images/carbonara.jpg",
                        name: "Carbonara",
                        base: "pasta",
                        tags: ["Italian", "Advanced"],
                    },
                    {
                        id: "c22",
                        image_url: "/images/egg_fried_rice.jpg",
                        name: "Egg Fried Rice",
                        base: "rice",
                        tags: ["Chinese", "Easy", "Make-at-Home"],
                    },
                    {
                        id: "c23",
                        image_url: "/images/apple_pecan_salad.jpg",
                        name: "Apple Pecan Salad",
                        base: "salad",
                        tags: ["Healthy", "Easy"],
                    },
                    {
                        id: "cas2",
                        image_url: "/images/alfredo.jpg",
                        name: "Alfredo",
                        base: "pasta",
                        tags: ["Italian", "Advanced"],
                    },
                ];
            case "easy":
                return [
                    {
                        id: "c23",
                        image_url: "/images/apple_pecan_salad.jpg",
                        name: "Apple Pecan Salad",
                        base: "salad",
                        tags: ["Healthy", "Easy"],
                    },
                    {
                        id: "c12",
                        image_url: "/images/chowmein.webp",
                        name: "Tadka Chowmein",
                        base: "chowmein",
                        tags: ["Chinese", "Easy"],
                    },
                    {
                        id: "c22",
                        image_url: "/images/egg_fried_rice.jpg",
                        name: "Egg Fried Rice",
                        base: "rice",
                        tags: ["Chinese", "Easy", "Make-at-Home"],
                    },
                ];
        }

        throw new Error("Category not found");
    }

    async get_recipe(id: string): Promise<RecipeData> {
        // await new Promise(resolve => setTimeout(resolve, 2000));
        switch (id) {
            case "c122":
                return {
                    recipe: {
                        id: "c122",
                        image_url: "/images/carbonara.jpg",
                        name: "Carbonara", // from the Italian Village of Pisa",
                        base: "pasta",
                        tags: ["Italian", "Advanced"]
                    },
                    content: `
# Ingredients:

* 1 pound spaghetti
* 4 large eggs
* 1 cup grated Pecorino Romano cheese
* 4 ounces guanciale (or pancetta)
* 1/4 cup pasta water
* Salt and freshly ground black pepper

# Instructions:


**Cook the pasta:** Bring a large pot of salted water to a boil. Add the spaghetti and cook according to package instructions until al dente. Reserve 1/4 cup of the pasta water.

**Prepare the guanciale:** Cut the guanciale into small cubes. Cook in a large skillet over medium heat until crispy and rendered.

**Create the sauce:** In a large bowl, whisk together the eggs and Pecorino Romano cheese until smooth.

**Combine the pasta and sauce:** Drain the pasta and add it directly to the bowl with the egg mixture. Toss to coat evenly. 

**Finish the dish:** Add the rendered guanciale and the reserved pasta water to the pasta mixture. Toss quickly until the sauce is creamy and coats the pasta. Season with salt and pepper to taste.

**Serve immediately:** Serve the Carbonara hot with additional grated Pecorino Romano cheese, if desired.
`
                }
        }

        throw new Error("Recipe not found");
    }
}