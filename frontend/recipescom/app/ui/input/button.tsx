import { MouseEventHandler } from "react";

export default function Button({label, onClick, color, disabled}: {label: string, onClick?: MouseEventHandler<HTMLDivElement>, color?: string, disabled?: boolean}) {
    color = color || "slate";
    const className = `bg-${color}-100 text-${color}-500 hover:bg-${color}-500 hover:text-white active:bg-${color}-800 active:text-white active:ring-${color}-800`;
    
    return <div className={`rounded-md px-8 py-2 select-none transition-all font-semibold ${disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : className + " cursor-pointer active:ring ring-offset-2"} text-center`} onClick={disabled ? undefined : onClick}>
        {label}
    </div>
}