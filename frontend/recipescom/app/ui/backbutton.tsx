import { useRouter } from "next/navigation";

export default function BackButton () {
    let router = useRouter();

    return <div onClick={() => router.back()} className="z-50 cursor-pointer material-symbols-rounded absolute top-5 left-5 text-2xl bg-black text-white size-12 rounded-full flex items-center justify-center bg-opacity-50 hover:bg-opacity-75 backdrop-blur-sm">
        arrow_back
    </div>
}