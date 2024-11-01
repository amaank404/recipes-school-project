'use client';

function NavBarItem ({label, action, icon}: {label?: string, action?: Function, icon?: string}) {
    let label_content: string = label || "Unknown";
    let new_action = action || defaultAction;
    return <div className="px-8 py-3 bg-black bg-opacity-0 hover:bg-opacity-50 text-nowrap cursor-pointer flex flex-nowrap gap-1 items-center" onClick={new_action()}>
        {typeof icon === undefined ? (<></>) : (<div className="material-symbols-rounded text-xl select-none"> {icon} </div>)}
        {label_content}
    </div>
}

function defaultAction() {}

export default function NavBar() {
   
    return <div className="z-10 fixed top-5 -translate-x-1/2 -translatey-1/2 left-1/2 text-white backdrop-blur-sm rounded-full overflow-hidden flex bg-black bg-opacity-25">
        <NavBarItem label="Top Recipes" icon="star"/>
        <NavBarItem label="Latest" icon="bolt"/>
        <NavBarItem label="Search" icon="search"/>
    </div>
}