export default function IconButton({
  onClick,
  className,
  icon,
}: {
  onClick?: () => void;
  className?: string;
  icon: string;
}) {
  return (
    <div className={className}>
      <div
        onClick={() => onClick?.()}
        className="z-50 cursor-pointer material-symbols-rounded text-2xl bg-black text-white size-12 rounded-full flex items-center justify-center bg-opacity-50 hover:bg-opacity-75 backdrop-blur-sm select-none"
      >
        {icon}
      </div>
    </div>
  );
}
