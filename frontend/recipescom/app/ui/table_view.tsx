export function RecipeTableItem() {
    return <tr>
        <td></td>
    </tr>
}

export default function TableView({className}: {className?: string}) {
    return <div className={className}>
    <table className="border-collapse border w-full rounded-md overflow-hidden">
        <tbody>
        <tr className="bg-slate-300 *:py-3">
            <th>
                Timestamp
            </th>
            <th>
                Name
            </th>
            <th>
                Category
            </th>
            <th>
                Tags
            </th>
        </tr>
        </tbody>
    </table>
    </div>
}