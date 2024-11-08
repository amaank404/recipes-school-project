'use client';
import clsx from "clsx";

import { useEffect, useState } from "react";

export function Tag({children, selected}: {children: React.ReactNode, selected?: boolean}) {
    selected = selected || false;
    return <div className={clsx({
        "rounded-full px-4 py-0.5 text-sm cursor-pointer select-none transition-colors": true,
        "text-pink-500 bg-pink-100 hover:bg-pink-200": !selected, 
        "text-white bg-pink-500 hover:bg-pink-400": selected,
    })}>
        {children}
    </div>
}

export default function TagSelectors({tags, onData}: {tags: string[], onData?: (data: Set<string>) => any}) {
    let [selected, setSelected] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (onData !== undefined) onData(selected);
    }, [selected])

    return <div className="flex flex-wrap gap-1 justify-center">
        {tags.map((tag: string) => 
            <div key={tag} onClick={
                () => {
                    setSelected(
                        (sel) => {
                            var newSel = new Set<string>();
                            sel.forEach((selItem: string) => newSel.add(selItem));
                            newSel.has(tag) ? newSel.delete(tag) : newSel.add(tag);
                            
                            
                            return newSel;
                        }
                    );

                }}>
                    <Tag selected={selected.has(tag)}>{tag}</Tag>
            </div>
        )}
    </div>
}