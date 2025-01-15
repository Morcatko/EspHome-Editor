import { useState } from 'react';
import { Home } from './home';
import { Flowers } from './flowers';

export type TPage = "home" | "flowers";


export const Onboarding = () => {
    const [page, setPage] = useState<TPage>("home")

    return <div className='overflow-auto h-full'>
        {page !== "home" && <div>Breadcrumbs</div>}
        <div className="mx-auto py-8 px-2">
            <div className="max-w-3xl mx-auto space-y-6">
                {page === "home" && <Home onCLick={setPage} />}
                {page === "flowers" && <Flowers />}
            </div>
        </div>
    </div>;
}