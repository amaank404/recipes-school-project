import BackButton from "./backbutton";
import LoadingIndicator from "./loading_indicator";


export default function Loader() {
    return <div className="absolute top-0 left-0 flex items-center justify-center h-screen w-screen bg-white">
        <BackButton/>
        <LoadingIndicator/>
    </div>
}