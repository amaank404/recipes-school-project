"use client";

import clsx from "clsx";
import { ChangeEvent, FocusEvent, useState } from "react";

export default function OutlinedInput({
  placeholder,
  className,
  multiline,
  initVal,
  onChange,
  onBlur: onBlurCallback,
  password,
}: {
  placeholder: string;
  className?: string;
  multiline?: boolean;
  initVal?: string;
  onChange?: (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (evt: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  password?: boolean;
}) {
  let v = initVal?.length;
  if (v === undefined) v = 0;

  let [empty, setEmpty] = useState<boolean>(v == 0);

  const onFocus = () => {
    setEmpty(false);
  };

  const onBlur = (evt: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = evt.target.value;

    setEmpty(val.length === 0);

    onBlurCallback?.(evt);
  };

  const inputClassName =
    "bg-transparent w-full outline-1 outline outline-slate-300 p-1 rounded-md focus:outline-2 focus:outline-pink-400 peer transition-color";

  return (
    <div className={className}>
      <div className="relative">
        {multiline ? (
          <textarea
            className={inputClassName + " min-h-20 max-h-56"}
            defaultValue={initVal}
            onBlur={onBlur}
            onFocus={onFocus}
            onChange={onChange}
          ></textarea>
        ) : (
          <input
            type={password ? "password" : "text"}
            className={inputClassName}
            onFocus={onFocus}
            onBlur={onBlur}
            defaultValue={initVal}
            onChange={onChange}
          />
        )}
        <div
          className={clsx(
            "absolute p-1 transition-all z-10 pointer-events-none select-none",
            {
              "text-slate-400 top-0 left-0": empty,
              "top-[-1rem] bg-white rounded-full text-xs left-2 font-bold peer-focus:text-pink-500 text-slate-400":
                !empty,
            }
          )}
        >
          {placeholder}
        </div>
      </div>
    </div>
  );
}
