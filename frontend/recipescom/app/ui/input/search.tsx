export default function Search({onData}: {onData?: (value: string) => any}) {


    return <div className="flex rounded-full bg-white shadow-sm pl-3 pr-2 items-center overflow-hidden focus-within:ring-2 w-full">
        <div className="material-symbols-rounded text-slate-400 mr-2 text-xl mt-0.5">search</div>
        <input type="text" className="w-full focus:outline-none" placeholder="Search" onChange={onData !== undefined ? (e) => onData(e.target.value): undefined}/>
    </div>
}