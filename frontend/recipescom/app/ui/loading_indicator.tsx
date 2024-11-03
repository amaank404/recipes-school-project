import Image from "next/image";

export default function LoadingIndicator() {
    return <Image src="/loading_gif.gif" alt="loading_gif" className="size-80 object-contain" unoptimized/>
}