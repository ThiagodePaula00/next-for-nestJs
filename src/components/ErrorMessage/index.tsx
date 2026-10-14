type ErrorMessageprops = {
    pageTitle?: string;
    contentTitle:string
    content: React.ReactNode;
}

export default function ErrorMessage({pageTitle='', contentTitle, content}: ErrorMessageprops) {
    return (
        <>
            {pageTitle && <title>{pageTitle}</title>}
            <div className='min-h[320px] bg-slate-900 text-slate-100 mb-16 p-8 rounded-xl flex items-center justify-center text-center'>
                <div>
                    <h1 className="text-7xl/normal mb-4 font-extrabold">{contentTitle}</h1>
                    <div>
                        {content}
                    </div>
                </div>
            </div>    
        </>
    );
}