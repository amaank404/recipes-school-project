"use client";

import clsx from "clsx";
import { FocusEvent, useState } from "react";

export default function OutlinedInput({
  placeholder,
  className,
  multiline,
}: {
  placeholder: string;
  className?: string;
  multiline?: boolean;
}) {
  let [empty, setEmpty] = useState(true);

  const onFocus = () => {
    setEmpty(false);
  };

  const onBlur = (evt: FocusEvent<HTMLInputElement>) => {
    const val = evt.target.value;

    setEmpty(val.length === 0);
  };

  return (
    <div className={className}>
      <div className="relative">
        {multiline ? (
          <textarea></textarea>
        ) : (
          <input
            className="bg-transparent w-full outline-1 outline outline-slate-300 p-1 rounded-md focus:outline-2 focus:outline-pink-400 peer transition-color"
            onFocus={onFocus}
            onBlur={onBlur}
          />
        )}
        <div
          className={clsx(
            "absolute p-1 transition-all z-10 pointer-events-none select-none",
            {
              "text-slate-400 top-0 left-0": empty,
              "top-[-1.3rem] text-xs left-1 font-bold peer-focus:text-pink-500 text-slate-400":
                !empty,
            },
          )}
        >
          {placeholder}
        </div>
      </div>
    </div>
  );
}
