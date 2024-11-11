"use client";

import { useEffect, useRef, useState } from "react";
import { RecipeData, genEmptyRecipeData } from "../repository/types";
import { get_recipe, save_recipe } from "../repository/repository";
import Loader from "../ui/loader";
import LoadFailure from "../ui/load_failure";
import BackButton from "../ui/backbutton";
import IconButton from "../ui/input/iconbutton";
import OutlinedInput from "../ui/input/outlined_input";
import RichText from "../ui/rich_text";
import Button from "../ui/input/button";
import _ from "lodash";

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
  const prevRecipeContents = useRef<string>("");

  const updateRecipeContent = (v: string) => {
    const d = _.cloneDeep(data);
    d.content = v;
    prevRecipeContents.current = v;

    setData(d);
  };

  // Data fetching
  useEffect(() => {
    if (state !== "loading") return;

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
      new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
        setData(genEmptyRecipeData());
        setState("success");
      });
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
              <div className="bg-gray-300 w-full h-56 rounded-md"></div>
              <OutlinedInput
                placeholder="Recipe Name"
                className="mt-7"
                initVal={data.recipe.name}
              />
              <OutlinedInput
                placeholder="Category"
                className="mt-7"
                initVal={data.recipe.base}
              />
              <OutlinedInput
                placeholder="Tags"
                className="mt-7"
                initVal={data.recipe.tags.join(", ")}
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
              <Button label="Save" color="green" onClick={saveData} />
              <Button label="Discard" color="red" onClick={onClose} />
            </div>
          </div>
          <div className="w-full">
            <RichText
              classList="max-md:h-96 overflow-y-auto h-full no-scrollbar"
              fontSize={12}
            >
              {previewContent}
            </RichText>
          </div>
        </div>
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
