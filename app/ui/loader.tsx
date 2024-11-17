import BackButton from "./backbutton";
import LoadingIndicator from "./loading_indicator";

export default function Loader({
  className,
  nobackbutton,
}: {
  className?: string;
  nobackbutton?: boolean;
}) {
  return (
    <div className={className || "absolute top-0 left-0 h-screen w-screen"}>
      <div className="flex items-center justify-center h-full w-full bg-white">
        {nobackbutton ? "" : <BackButton />}
        <LoadingIndicator />
      </div>
    </div>
  );
}
