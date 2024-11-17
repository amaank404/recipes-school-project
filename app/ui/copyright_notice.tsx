"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CopyrightNoticeFooter() {
  let router = useRouter();

  return (
    <>
      <div className="h-10"></div>
      <div className="absolute bottom-1 w-full text-center text-xs px-5">
        CBSE Class 12 Boards Project. Licensed under the{" "}
        <Link href="/LICENSE.txt" className="hover:underline text-blue-500">
          GNU General Public License V3
        </Link>
        . Click{" "}
        <span
          className="hover:underline text-blue-500 cursor-pointer"
          onClick={() => {
            router.push("/about");
          }}
        >
          here
        </span>{" "}
        for more details.
      </div>
    </>
  );
}
