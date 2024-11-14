"use client";

import { useEffect, useRef, useState } from "react";
import { RecipeData, genEmptyRecipeData } from "../repository/types";
import {
  gen_recipe,
  get_recipe,
  initRepo,
  save_recipe,
} from "../repository/repository";
import Loader from "../ui/loader";
import LoadFailure from "../ui/load_failure";
import BackButton from "../ui/backbutton";
import IconButton from "../ui/input/iconbutton";
import OutlinedInput from "../ui/input/outlined_input";
import RichText from "../ui/rich_text";
import Button from "../ui/input/button";
import _ from "lodash";
import ImageInput from "../ui/input/image_input";
import clsx from "clsx";
import Popup from "../ui/popup";
import LoadingIndicator from "../ui/loading_indicator";
import { gen_recipe_to_string } from "../utils/process_recipe";

export default function EditView({
  id,
  className,
  nobackbutton,
  onClose,
}: {
  id: string;
  className?: string;
  nobackbutton?: boolean;
  onClose?: () => void;
}) {
  const [data, setData] = useState<RecipeData>(genEmptyRecipeData());
  const [state, setState] = useState("loading");
  const [err, setError] = useState("");
  const [previewContent, setPreviewContent] = useState("");
  const [genRecipesIndicator, setGenRecipesIndicator] = useState(false);
  const prevRecipeContents = useRef<string>("");

  const updateRecipeContent = (v: string) => {
    const d = _.cloneDeep(data);
    d.content = v;
    prevRecipeContents.current = v;

    setData(d);
  };

  const setRecipeParam = (t: string, newData: string) => {
    switch (t) {
      case "name":
        setData({
          content: data.content,
          recipe: {
            ...data.recipe,
            name: newData,
          },
        });
        break;
      case "base":
        setData({
          content: data.content,
          recipe: {
            ...data.recipe,
            base: newData,
          },
        });
        break;
      case "tags":
        setData({
          content: data.content,
          recipe: {
            ...data.recipe,
            tags: newData.split(",").map((t) => t.trim()),
          },
        });
        break;
      case "image_url":
        setData({
          content: data.content,
          recipe: {
            ...data.recipe,
            image_url: newData,
          },
        });
    }
  };

  // Data fetching
  useEffect(() => {
    if (state !== "loading") return;

    initRepo();
    if (id != "new") {
      get_recipe(id)
        .then((data) => {
          setData(data);
          setState("success");
        })
        .catch((err) => {
          setError(err.message);
          setState("error");
        });
    } else {
      setData(genEmptyRecipeData());
      setState("success");
    }
  }, []);

  useEffect(() => {
    if (state !== "success") return;

    updateRecipeContent(data.content);

    const i = setInterval(
      (function m() {
        // Check if the new content is different
        if (prevRecipeContents.current != previewContent) {
          setPreviewContent(prevRecipeContents.current);
        }
        return m;
      })(),
      2000
    );

    return () => clearInterval(i);
  }, [state]);

  const saveData = () => {
    async function sData() {
      data.recipe.id = id;
      await save_recipe(data);
    }

    sData()
      .then(() => onClose?.())
      .catch((err) => {
        setError(err.message);
        setState("error");
      });
  };

  const genRecipe = async () => {
    setGenRecipesIndicator(true);

    let resp: any = null;

    try {
      resp = await gen_recipe(data.recipe.name);
    } catch (e: any) {
      setGenRecipesIndicator(false);
      alert("Recipe generation failed: " + e.message);
      throw e;
    }
    resp = gen_recipe_to_string(resp);

    updateRecipeContent(resp);

    setGenRecipesIndicator(false);
  };

  const crossButton = (
    <IconButton
      icon="close"
      className="absolute top-3 right-3"
      onClick={onClose}
    />
  );

  const containerClass = className + " relative" || "w-full h-full relative";

  if (state == "loading") {
    return <Loader className={className} nobackbutton={nobackbutton} />;
  } else if (state == "success") {
    return (
      <div className={containerClass}>
        {nobackbutton ? "" : <BackButton />}
        <div className="flex max-md:flex-col max-h-[90vh] no-scrollbar overflow-y-auto p-3 gap-8">
          <div className="w-full flex flex-col justify-between">
            <div>
              {/* <div className="bg-gray-300 w-full h-56 rounded-md"></div> */}
              <ImageInput
                className="w-full h-56"
                prefetchData={data.recipe.image_url || undefined}
                onFileChange={(data_uri) =>
                  setRecipeParam("image_url", data_uri)
                }
              />
              <OutlinedInput
                placeholder="Recipe Name"
                className="mt-7"
                initVal={data.recipe.name}
                onBlur={(evt) => setRecipeParam("name", evt.target.value)}
              />
              <OutlinedInput
                placeholder="Category"
                className="mt-7"
                initVal={data.recipe.base}
                onBlur={(evt) => setRecipeParam("base", evt.target.value)}
              />
              <OutlinedInput
                placeholder="Tags"
                className="mt-7"
                initVal={data.recipe.tags.join(", ")}
                onBlur={(evt) => setRecipeParam("tags", evt.target.value)}
              />
              <OutlinedInput
                placeholder="Contents"
                className="mt-7"
                multiline
                onChange={(evt) => updateRecipeContent(evt.target.value)}
                initVal={data.content}
              />
            </div>
            <div className="flex mt-5 justify-between">
              <div className="flex gap-2">
                <Button label="Save" color="green" onClick={saveData} />
                <Button
                  label="Generate"
                  color="pink"
                  onClick={genRecipe}
                  disabled={data.recipe.name.length === 0}
                  icon="attach_file"
                />
              </div>
              <Button label="Discard" color="red" onClick={onClose} />
            </div>
          </div>
          <div className="w-full">
            <RichText
              classList={clsx(
                "max-md:h-96 overflow-y-auto h-full no-scrollbar",
                { "text-slate-400": previewContent.length == 0 }
              )}
              fontSize={12}
            >
              {previewContent || "## Start Typing Content"}
            </RichText>
          </div>
        </div>
        {genRecipesIndicator ? (
          <Popup>
            <div className="rounded-md overflow-hidden bg-white p-10 flex items-center flex-col">
              <div className="material-symbols-rounded text-2xl mb-4">info</div>
              <div className="text-xl">Generating Recipe</div>
              <LoadingIndicator />
            </div>
          </Popup>
        ) : (
          ""
        )}
      </div>
    );
  } else {
    return (
      <div className={containerClass + " bg-white py-40"}>
        <LoadFailure
          err={err}
          nobackbutton={nobackbutton}
          className={"bg-transparent"}
        />
        {crossButton}
      </div>
    );
  }
}
