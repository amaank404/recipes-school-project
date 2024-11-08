'use client';

import { useEffect, useState } from "react";
import { RecipeData } from "../repository/types";
import { get_recipe } from "../repository/repository";
import Loader from "../ui/loader";
import LoadFailure from "../ui/load_failure";

export default function EditView({id}: {id: string}) {
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
        return <Loader/>
    } else if (state == "success") {
        return <div></div>
    } else {
        return <LoadFailure err={err}/>
    }
}