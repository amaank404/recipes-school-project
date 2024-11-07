'use client';
import clsx from "clsx";

import { useState } from "react";

export function Tag({children, selected}: {children: React.ReactNode, selected?: boolean}) {
    selected = selected || false;
    return <div className={clsx({
        "rounded-full px-4 py-0.5 text-sm cursor-pointer select-none": true,
        "text-blue-500 bg-blue-100": !selected, 
        "text-white bg-blue-500": selected,
    })}>
        {children}
    </div>
}

export default function TagSelectors({tags}: {tags: string[]}) {
    let [selected, setSelected] = useState<Set<string>>(new Set());

    console.log(selected);

    return <div className="flex flex-wrap gap-1 justify-center">
        {tags.map((tag: string) => 
            <div key={tag} onClick={
                () => setSelected(
                    (sel) => {
                        var newSel = new Set<string>();
                        sel.forEach((selItem: string) => newSel.add(selItem));
                        newSel.has(tag) ? newSel.delete(tag) : newSel.add(tag);
                        return newSel;
                    }
                )}>
                    <Tag selected={selected.has(tag)}>{tag}</Tag>
            </div>
        )}
    </div>
}