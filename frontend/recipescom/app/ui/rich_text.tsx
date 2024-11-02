export default function RichText({content, classList}: {content: Section[], classList?: string}) {
    let data: React.ReactNode[] = [];
    
    let i = 0;
    for (let x of content) {
        data.push(<h1 key={i++} className="text-3xl mb-3 mt-5">{x.title}</h1>);
        
        for (let y of x.content) {
            if (y.type === "para") {
                y.data.forEach(txt => {
                    data.push((<p key={i++} className="mb-5">{txt}</p>));
                });
            } else {
                data.push(
                    <ul key={i++} className="list-disc list-outside pl-8">
                        {y.data.map(txt => {
                            return <li key={i++}>{txt}</li>
                        })}
                    </ul> 
                )
            }
        }
    }

    return <div className={classList}>
        {data}
    </div>
}