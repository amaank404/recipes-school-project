type Recipe = {
    id: string,
    image_url: string,
    name: string,
    base: string,
    tags: string[],
}

type SectionContent = {
    type: "para" | "list",
    data: string[],
}

type Section = {
    title: string,
    content: SectionContent[],
}

type RecipeData = {
    id: string,
    image_url: string,
    name: string,
    base: string,
    tags: string[],
    sections: Section[],
}