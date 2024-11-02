export class DummyRepository {
    async get_list(cagegory: string): Promise<Recipe[]> {
        await new Promise(resolve => setTimeout(resolve, 2000));
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
        await new Promise(resolve => setTimeout(resolve, 2000));
        switch (id) {
            case "c122":
                return {
                    id: "c122",
                    image_url: "/images/carbonara.jpg",
                    name: "Carbonara", // from the Italian Village of Pisa",
                    base: "pasta",
                    tags: ["Italian", "Advanced"],
                    sections: [
                        {title: "Ingridients",
                        content: [
                            {type: "list",
                            data: [
                                "Pasta: 400g spaghetti or fettuccine",
                                "Pancetta or Guanciale: 150g, diced",
                                "Eggs: 3 large",
                                "Parmesan Cheese: 100g, grated (or Pecorino Romano for a more traditional flavor)",
                                "Garlic: 1 clove, minced (optional)",
                                "Black Pepper: Freshly ground, to taste",
                                "Salt: For pasta water",
                                "Olive Oil: 1 tablespoon (optional)",
                            ]}
                        ]},
                        {title: "Instructions", 
                        content: [
                            {type: "para",
                            data: [
                                "To begin, fill a large pot with water and add a generous amount of salt before bringing it to a boil. Once the water is boiling, add the spaghetti or fettuccine and cook according to the package instructions until it reaches al dente. Before draining the pasta, reserve about one cup of the pasta water for later use.",
                                "While the pasta is cooking, heat a large skillet over medium heat and add the diced pancetta or guanciale. Cook it until it becomes crispy, which should take about 5 to 7 minutes. If you like, you can add minced garlic in the last minute of cooking for extra flavor. In a separate bowl, whisk together the eggs and grated cheese until they are well combined. Don’t forget to add freshly ground black pepper to taste.",
                                "Once the pasta is cooked and drained, add it directly to the skillet with the crispy pancetta or guanciale. It’s important to remove the skillet from heat at this point to prevent scrambling the eggs. Quickly pour the egg and cheese mixture over the hot pasta, tossing vigorously to create a creamy sauce. If you find that the sauce is too thick, gradually add some of the reserved pasta water until you achieve your desired consistency.",
                                "Finally, divide the carbonara into serving bowls and garnish each portion with additional grated cheese and freshly cracked black pepper. Enjoy your homemade carbonara—buon appetito!"
                            ]}
                        ]}
                    ]
                }
        }

        throw new Error("Recipe not found");
    }
}