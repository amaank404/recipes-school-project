"use client";

import { useEffect, useState } from "react";
import { RecipeData } from "../repository/types";
import { get_recipe } from "../repository/repository";
import Loader from "../ui/loader";
import LoadFailure from "../ui/load_failure";
import BackButton from "../ui/backbutton";
import IconButton from "../ui/input/iconbutton";
import OutlinedInput from "../ui/input/outlined_input";

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
  const [data, setData] = useState<RecipeData>();
  const [state, setState] = useState("loading");
  const [err, setError] = useState("");

  useEffect(() => {
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
        setData(undefined);
        setState("success");
      });
    }
  }, []);

  if (state == "loading") {
    return <Loader className={className} nobackbutton={nobackbutton} />;
  } else if (state == "success") {
    return (
      <div className={className + " relative" || "w-full h-full relative"}>
        {nobackbutton ? (
          <IconButton
            icon="close"
            className="absolute top-3 right-3"
            onClick={onClose}
          />
        ) : (
          <BackButton />
        )}
        <div className="flex max-md:flex-col p-6 gap-8">
          <div className="w-full">
            <div className="bg-gray-300 w-full h-56"></div>
            <OutlinedInput placeholder="Recipe Name" className="mt-7" />
            <OutlinedInput placeholder="Category" className="mt-7" />
            <OutlinedInput placeholder="Tags" className="mt-7" />
            <OutlinedInput placeholder="Tags" className="mt-7" multiline />
          </div>
          <div className="w-full">DEF</div>
        </div>
      </div>
    );
  } else {
    return (
      <LoadFailure
        err={err}
        className={className}
        nobackbutton={nobackbutton}
      />
    );
  }
}
