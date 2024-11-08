import { MouseEventHandler } from "react";

export default function Button({label, onClick, color}: {label: string, onClick?: MouseEventHandler<HTMLDivElement>, color?: string}) {
    color = color || "slate";
    const className = `bg-${color}-100 text-${color}-500 hover:bg-${color}-500 hover:text-white active:bg-${color}-800 active:text-white active:ring-${color}-800`;
    
    return <div className={`rounded-md px-8 py-2 select-none cursor-pointer transition-all font-semibold ${className} text-center active:ring ring-offset-2`} onClick={onClick}>
        {label}
    </div>
}