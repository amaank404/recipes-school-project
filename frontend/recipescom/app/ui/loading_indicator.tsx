import Image from "next/image";

export default function LoadingIndicator() {
    return <Image src="/loading_gif.gif" alt="loading_gif" width={100} height={100} className="size-80 object-contain" unoptimized/>
}