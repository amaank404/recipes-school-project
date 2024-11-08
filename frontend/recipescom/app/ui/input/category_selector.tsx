'use client';

import clsx from "clsx"
import { useEffect, useState } from "react";

export function Category({children, selected}: {children: string, selected?: boolean}) {
    selected = selected || false
    return <div className={clsx(
        {
            "tracking-[0.2rem] cursor-pointer select-none px-4 py-2  uppercase transition-colors": true,
            "text-slate-700 hover:bg-slate-50": !selected,
            "text-white bg-pink-500 hover:bg-pink-400": selected
        })}>
        {children}
    </div>
}

export default function CategorySelector({cats, onData}: {cats: string[], onData?: (data: Set<string>) => any}) {
    let [selected, setSelected] = useState<Set<string>>(new Set());
    
    useEffect(() => {
        if (onData !== undefined) onData(selected);
    }, [selected])
    
    return <div className="bg-white w-full rounded-lg overflow-hidden max-w-[35rem]">
    {cats.map((cat: string) => 
        <div key={cat} onClick={
            () => setSelected(
                (sel) => {
                    var newSel = new Set<string>();
                    sel.forEach((selItem: string) => newSel.add(selItem));
                    newSel.has(cat) ? newSel.delete(cat) : newSel.add(cat);
                    return newSel;
                }
            )}>
                <Category selected={selected.has(cat)}>{cat}</Category>
        </div>
    )}
</div>
}