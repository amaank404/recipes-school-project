'use client';

import { useEffect, useState } from "react";
import { RecipeData } from "../repository/types";
import { get_recipe } from "../repository/repository";
import Loader from "../ui/loader";
import LoadFailure from "../ui/load_failure";
import BackButton from "../ui/backbutton";
import IconButton from "../ui/input/iconbutton";

export default function EditView({id, className, nobackbutton, onClose}: {id: string, className?: string, nobackbutton?: boolean, onClose?: () => void}) {
    const [data, setData] = useState<RecipeData>();
    const [state, setState] = useState("loading");
    const [err, setError] = useState("");

    useEffect(() => {
        if (id != "new") {
            get_recipe(id)
                .then(data => {
                    setData(data);
                    setState("success");
                })
                .catch((err) => {
                    setError(err.message)
                    setState("error");
                });
        } else {
            setData(undefined);
            setState("success");
        }
    }, []);

    if (state == "loading") {
        return <Loader className={className} nobackbutton={nobackbutton}/>
    } else if (state == "success") {
        return <div className={className + " relative" || "w-full h-full relative"}>
            {nobackbutton ? <IconButton icon="close" className="absolute top-3 right-3"/> : <BackButton/>}
        </div>
    } else {
        return <LoadFailure err={err} className={className} nobackbutton={nobackbutton}/>
    }
}