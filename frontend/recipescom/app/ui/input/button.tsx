import { MouseEventHandler } from "react";

export default function Button({
  label,
  onClick,
  color,
  disabled,
  icon,
}: {
  label: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  color?: string;
  disabled?: boolean;
  icon?: string;
}) {
  color = color || "slate";
  const className = `bg-${color}-100 text-${color}-500 hover:bg-${color}-500 hover:text-white active:bg-${color}-800 active:text-white active:ring-${color}-800`;

  return (
    <div
      className={`rounded-md px-6 py-2 select-none transition-all font-semibold flex gap-1 ${
        disabled
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : className + " cursor-pointer active:ring ring-offset-2"
      } text-center`}
      onClick={disabled ? undefined : onClick}
    >
      {icon ? (
        <span className="material-symbols-rounded font-normal">{icon}</span>
      ) : (
        ""
      )}
      {label}
    </div>
  );
}
