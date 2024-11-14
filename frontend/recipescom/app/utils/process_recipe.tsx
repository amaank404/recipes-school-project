function extend_arr(arr: string[], arr2: string[], join = "\n") {
  arr.push(arr2.join(join));
}

export function gen_recipe_to_string(recipe: any): string {
  let contents: string[] = [];

  for (let [x, j] of [
    ["DESCRIPTION", "\n\n"],
    ["INGREDIENTS", "\n"],
    ["INSTRUCTIONS", "\n\n"],
    ["TIPS_AND_VARIATIONS", "\n\n"],
    ["NUTRITION_INFORMATION", "\n"],
    ["CONCLUSION", "\n\n"],
  ]) {
    if (recipe[x] === undefined) {
      console.error(`undefined field ${x} on`, recipe);
      continue;
    }
    try {
      extend_arr(contents, recipe[x], j);
    } catch (e) {
      console.error(
        "extend arr problem, gen_recipe_to_string: ",
        e,
        x,
        recipe,
        recipe[x],
        typeof recipe[x]
      );
    }
  }

  return contents.join("\n\n");
}
