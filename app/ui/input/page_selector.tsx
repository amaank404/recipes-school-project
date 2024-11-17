"use client";

import { useEffect, useState } from "react";

function toNum(a: string) {
  let i = "";
  for (let x of a) {
    if (!isNaN(parseInt(x))) {
      i += x;
    }
  }

  return parseInt(i);
}

export default function PageSelector({
  onPageChange,
  className,
  page: initPage,
}: {
  onPageChange?: (page: number) => void;
  className?: string;
  page?: number;
}) {
  let [page, setPage] = useState(initPage || 0);
  let [view, setView] = useState(page.toString());

  useEffect(() => {
    if (page !== (initPage || 0)) setPageVal(initPage || 0);
  }, [initPage]);

  function setPageVal(val: string | number) {
    let newPage: number;
    if (typeof val === "string") {
      newPage = toNum(val) || 0;
    } else {
      newPage = val;
    }

    newPage = Math.max(newPage, 0);

    setPage(newPage);
    setView(newPage.toString());

    if (newPage !== page) {
      onPageChange?.(newPage);
    }
  }

  const iconButtonClass =
    "material-symbols-rounded select-none hover:bg-slate-300 w-6 text-center active:bg-slate-400";

  return (
    <div className={className}>
      <div className="rounded-md bg-slate-100 overflow-hidden w-min">
        <div className="text-center text-[0.75rem] leading-none z-10 text-slate-500 mt-1">
          Page
        </div>
        <div className="flex">
          <div className={iconButtonClass} onClick={() => setPageVal(page - 1)}>
            chevron_left
          </div>
          <input
            className="max-w-10 text-center bg-transparent focus:outline text-sm"
            onBlur={(evt) => setPageVal(evt.target.value)}
            onChange={(evt) => setView(evt.target.value)}
            value={view}
          />
          <div className={iconButtonClass} onClick={() => setPageVal(page + 1)}>
            chevron_right
          </div>
        </div>
      </div>
    </div>
  );
}
