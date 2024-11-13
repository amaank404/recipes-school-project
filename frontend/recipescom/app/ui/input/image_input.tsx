"use client";

import clsx from "clsx";
import { ChangeEvent, use, useCallback, useEffect, useState } from "react";

export default function ImageInput({
  className,
  prefetchData,
}: {
  className?: string;
  prefetchData?: string;
}) {
  const [preview, setPreview] = useState<string>();

  const getImgData = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function () {
      setPreview(this.result as string | undefined);
      evt.target.value = "";
    };
  }, []);

  useEffect(() => {
    function readBlob(b: Blob): Promise<string | undefined> {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader();

        reader.onloadend = function () {
          resolve(reader.result as string | undefined);
        };

        // TODO: hook up reject to reader.onerror somehow and try it

        reader.readAsDataURL(b);
      });
    }

    if (prefetchData !== undefined) {
      async function fetch_and_set(prefetchDat: string) {
        const blob = await (await fetch(prefetchDat)).blob();
        const content = await readBlob(blob);

        setPreview(content);
      }

      fetch_and_set(prefetchData);
    }
  }, [prefetchData]);

  return (
    <div className={className}>
      <div className="rounded-md bg-slate-100 h-full w-full overflow-hidden relative shadow-sm">
        <label className="w-full h-full block">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={getImgData}
          />
          <img
            src={preview}
            className={clsx("h-full w-full object-cover", {
              hidden: preview === undefined || preview?.length == 0,
            })}
          />
          <div
            className={clsx(
              "absolute top-0 left-0 w-full h-full z-10  flex flex-col items-center justify-center ",
              {
                "hover:opacity-100 opacity-0 hover:bg-black hover:bg-opacity-50 text-white":
                  preview !== undefined,
                "hover:bg-slate-200": preview === undefined,
              }
            )}
          >
            <div className="material-symbols-rounded text-6xl">
              add_photo_alternate
            </div>
            <div className="text-lg">Click to add an image</div>
          </div>
        </label>
      </div>
    </div>
  );
}
