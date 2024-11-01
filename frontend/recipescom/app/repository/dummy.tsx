export class DummyRepository {
    async get_list(cagegory: string): Promise<Recipe[]> {
        switch (cagegory) {
            case "popular":
                return [
                    {
                        image_url: "/images/chowmein.webp",
                        name: "Tadka Chowmein",
                        base: "chowmein",
                        tags: ["Chinese", "Easy"],
                    },
                    {
                        image_url: "/images/carbonara.jpg",
                        name: "Carbonara",
                        base: "pasta",
                        tags: ["Italian", "Advanced"],
                    },
                    {
                        image_url: "/images/egg_fried_rice.jpg",
                        name: "Egg Fried Rice",
                        base: "rice",
                        tags: ["Chinese", "Easy", "Make-at-Home"],
                    },
                    {
                        image_url: "/images/apple_pecan_salad.jpg",
                        name: "Apple Pecan Salad",
                        base: "salad",
                        tags: ["Healthy", "Easy"],
                    },
                    {
                        image_url: "/images/alfredo.jpg",
                        name: "Alfredo",
                        base: "pasta",
                        tags: ["Italian", "Advanced"],
                    },
                ];
            case "easy":
                return [
                    {
                        image_url: "/images/apple_pecan_salad.jpg",
                        name: "Apple Pecan Salad",
                        base: "salad",
                        tags: ["Healthy", "Easy"],
                    },
                    {
                        image_url: "/images/chowmein.webp",
                        name: "Tadka Chowmein",
                        base: "chowmein",
                        tags: ["Chinese", "Easy"],
                    },
                    {
                        image_url: "/images/egg_fried_rice.jpg",
                        name: "Egg Fried Rice",
                        base: "rice",
                        tags: ["Chinese", "Easy", "Make-at-Home"],
                    },
                ];
        }

        throw new Error("Category not found");
    }
}