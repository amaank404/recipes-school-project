import BackButton from "./backbutton";

export default function LoadFailure({err}: {err?: string}) {
    return <div className="absolute top-0 left-0 flex items-center justify-center h-screen w-screen bg-white">
        <BackButton/>
        <div className="w-4/5 max-w-screen-sm bg-red-100 text-red-600 rounded-md text-center h-44 align-middle flex flex-col justify-center">
            <div className="material-symbols-rounded text-2xl">error</div>
            <div>Something went wrong <br/> Please reload the page </div>
            {err ? <div className="font-mono">Error: {err}</div>: <></>}
        </div>
    </div>
}