'use client';

function NavBarItem ({label, action, icon}: {label?: string, action?: Function, icon?: string}) {
    let label_content: string = label || "Unknown";
    let new_action = action || defaultAction;
    return <div className="px-3 py-2 sm:px-8 sm:py-3 bg-black bg-opacity-0 hover:bg-opacity-50 text-nowrap cursor-pointer flex flex-nowrap gap-1 items-center max-sm:flex-grow justify-center" onClick={new_action()}>
        {typeof icon === undefined ? (<></>) : (<div className="material-symbols-rounded text-xl select-none"> {icon} </div>)}
        {label_content}
    </div>
}

function defaultAction() {}

export default function NavBar() {
   
    return <div className="z-10 fixed max-sm:w-full top-0 sm:top-5 sm:-translate-x-1/2 sm:-translatey-1/2 sm:left-1/2 text-white backdrop-blur-sm sm:rounded-full overflow-hidden flex bg-black bg-opacity-25">
        <NavBarItem label="Categories" icon="category"/>
        <NavBarItem label="Latest" icon="bolt"/>
        <NavBarItem label="Search" icon="search"/>
    </div>
}