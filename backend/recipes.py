import logging
import requests
import json
import dotenv
from pathlib import Path
import os
from pprint import pprint

dotenv.load_dotenv(Path(__file__).parent / ".env", override=True)

ARLIAI_API_KEY = os.getenv("ARLIAI_API_KEY")


recipe_prompt = """
Write the recipe for \"{recipe}\" in as much detail as you can while following the desired format completely.

desired format

~BEGIN_SEP_IDENTIFIER~
<recipe name>
~RECIPE_NAME_SEP_IDENTIFIER~

Servings: <number of people it can serve>
Prep Time: <time required to prepare in minutes>
Cook Time: <time required to cook in minutes>
Total Time: <total time required including prepation and cooking in minutes>
~INFO_SEP_IDENTIFIER~

# Description
<description of the dish>
~DESCRIPTION_SEP_IDENTIFIER~

# Ingredients
- <ingridients as a list>
...
~INGREDIENTS_SEP_IDENTIFIER~

# Instructions
<instructions as a list of paragraphs>
...
~INSTRUCTIONS_SEP_IDENTIFIER~

# Tips and Variations
- <tips and variations the user can do>
...
~TIPS_AND_VARIATIONS_SEP_IDENTIFIER~

# Nutrition Information (per serving):
- <nutrition parameter>: <value of the parameter>
...
~NUTRITION_INFORMATION_SEP_IDENTIFIER~

<conclusion>
~CONCLUSION_SEP_IDENTIFIER~
""".strip()


def get_recipe(recipe: str):
    url = "https://api.arliai.com/v1/chat/completions"

    payload = json.dumps(
        {
            "model": "Meta-Llama-3.1-8B-Instruct",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a helpful assistant that writes recipes for the user in desired format, you will not use any other format, replace your content within < and >, ... indictes you can repeat the above template line",
                },
                {"role": "user", "content": recipe_prompt.format(recipe=recipe)},
            ],
            "repetition_penalty": 1.1,
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 40,
            "max_tokens": 3000,
            "stream": True,
        }
    )
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {ARLIAI_API_KEY}",
    }

    response = requests.post(url, headers=headers, data=payload, stream=True)

    msg = ""

    for line in response.iter_lines(decode_unicode=True, delimiter="\n\n"):
        line = line.removeprefix("data: ")

        if not line.strip():
            continue

        if line == "[DONE]":
            break

        d = json.loads(line)
        if d["object"] == "chat.completion.chunk":
            delta = d["choices"][0]["delta"]
            if "content" in delta:
                msg += delta["content"]
                print(delta["content"], end="", flush=True)

    return msg


def process_data(msg: str):
    sections = {}

    buff = ""
    for x in msg.splitlines():
        x = x.strip()
        if x.startswith("~") and x.endswith("_SEP_IDENTIFIER~"):
            section = x.removeprefix("~").removesuffix("_SEP_IDENTIFIER~")
            sections[section] = buff.strip().split("\n")
            buff = ""
        else:
            buff += x + "\n"

    return sections


# msg = get_recipe("Carbonara")
# with open("file.txt", "w") as f:
#     f.write(msg)

recipes = [
    "aroma",
    "bagel",
    "batter",
    "beans",
    "beer",
    "biscuit",
    "bread",
    "broth",
    "burger",
    "burrito",
    "butter",
    "cake",
    "candy",
    "caramel",
    "caviar",
    "cheese",
    "chili",
    "chimichanga",
    "chocolate",
    "cider",
    "cobbler",
    "cocoa",
    "coffee",  # Done till here
    "cookie",
    "cream",
    "croissant",
    "crumble",
    "cuisine",
    "curd",
    "dessert",
    "dish",
    "drink",
    "eggs",
    "empanada",
    "enchilada",
    "entree",
    "filet",
    "fish",
    "flour",
    "foie gras",
    "food",
    "glaze",
    "grill",
    "hamburger",
    "ice",
    "juice",
    "ketchup",
    "kitchen",
    "lard",
    "liquor",
    "margarine",
    "marinade",
    "mayo",
    "mayonnaise",
    "meat",
    "milk",
    "mousse",
    "muffin",
    "mushroom",
    "noodle",
    "nut",
    "oil",
    "olive",
    "omelette",
    "pan",
    "pasta",
    "paste",
    "pastry",
    "pie",
    "pizza",
    "plate",
    "pot",
    "poutine",
    "pudding",
    "queso",
    "raclette",
    "recipe",
    "rice",
    "salad",
    "salsa",
    "sandwich",
    "sauce",
    "seasoning",
    "skillet",
    "soda",
    "sopapillas",
    "soup",
    "soy",
    "spice",
    "steak",
    "stew",
    "syrup",
    "taco",
    "taquito",
    "tartar",
    "taste",
    "tea",
    "toast",
    "tostada",
    "vinegar",
    "waffle",
    "water",
    "wheat",
    "wine",
    "wok",
    "yeast",
    "yogurt",
]

for x in recipes:
    try:
        data = get_recipe(x)
        with open(f"{x}.txt", "w") as f:
            f.write(data)
    except:
        print("PASSING", x)
        raise

msg = open("file.txt").read()
pprint(process_data(msg))
