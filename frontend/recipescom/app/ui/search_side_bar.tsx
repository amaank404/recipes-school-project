import Search from "./search";
import TagSelectors from "./tag_select";

function SideBarHeading({children}: {children?: React.ReactNode}) {
    return <div className="text-slate-600 mt-4 text-xl mb-2">
        {children}
    </div>
}

export default function SearchSideBar() {
    const tags = ["Easy", "Hard", "Italian", "Advanced", "Make-it-at-Home", "Chinese", "Rice", "Chowmein", "Indian", "Asian", "5-mins"]

    return <div className="bg-slate-100 w-72 min-h-screen h-full p-5 flex flex-col items-center">
        <Search/>
        <SideBarHeading>Tags</SideBarHeading>
        <TagSelectors tags={tags}/>
    </div>
}