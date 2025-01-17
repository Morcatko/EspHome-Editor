import { Home } from './home';
import { Flowers } from './flowers';
import { TPanel_Onboarding } from '@/app/stores/panels-store/types';

export const Onboarding = ({ panel }: { panel: TPanel_Onboarding }) => {
    const isHome = (!panel.step || (panel.step === "home"));
    return <div className='overflow-auto h-full'>
        {!isHome && <div>Breadcrumbs</div>}
        <div className="mx-auto py-8 px-2">
            <div className="max-w-3xl mx-auto space-y-6">
                {isHome && <Home />}
                {panel.step === "flowers" && <Flowers />}
            </div>
        </div>
    </div>;
}