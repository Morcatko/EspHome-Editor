import { Home } from './home';

export const Onboarding = () => {
    return <div className='overflow-auto h-full'>
        <div className="mx-auto py-8 px-2">
            <div className="max-w-3xl mx-auto space-y-6">
                <Home />
            </div>
        </div>
    </div>;
}