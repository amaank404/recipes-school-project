import clsx from "clsx";
import BackButton from "./backbutton";

export default function LoadFailure({
  err,
  className,
  nobackbutton,
}: {
  err?: string;
  className?: string;
  nobackbutton?: boolean;
}) {
  return (
    <div className={className || "h-screen w-screen absolute top-0 left-0"}>
      <div className="h-full w-full flex items-center justify-center bg-white">
        {nobackbutton ? "" : <BackButton />}
        <div className="w-4/5 max-w-screen-sm bg-red-100 text-red-600 rounded-md text-center h-44 align-middle flex flex-col justify-center">
          <div className="material-symbols-rounded text-2xl">error</div>
          <div>
            Something went wrong <br /> Please reload the page{" "}
          </div>
          {err ? <div className="font-mono">Error: {err}</div> : <></>}
        </div>
      </div>
    </div>
  );
}
