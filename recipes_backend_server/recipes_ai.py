import requests
import json
import os

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

~INGREDIENTS_SEP_IDENTIFIER~

# Instructions
<instructions as a list of paragraphs>

~INSTRUCTIONS_SEP_IDENTIFIER~

# Tips and Variations
- <tips and variations the user can do as a list>

~TIPS_AND_VARIATIONS_SEP_IDENTIFIER~

## Nutrition Information (per serving):
- <nutrition parameter>: <value of the parameter>

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
                    "content": "You are a helpful assistant that writes recipes for the user in desired format, you will not use any other format, replace your content within < and >",
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

        try:
            d = json.loads(line)
        except:
            print(line)
            raise
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
        if x.upper().startswith("~") and x.upper().endswith("_SEP_IDENTIFIER~"):
            section = x.upper().removeprefix("~").removesuffix("_SEP_IDENTIFIER~")
            sections[section] = buff.strip().split("\n")
            buff = ""
        else:
            buff += x + "\n"

    sections.setdefault("CONCLUSION", buff.strip().split("\n"))

    return sections
