import { Home } from './home';
import { Flowers } from './flowers';
import { TPanel_Onboarding } from '@/app/stores/panels-store/types';

export const Onboarding = ({ panel }: { panel: TPanel_Onboarding }) => {
    return <div className='overflow-auto h-full'>
        {panel.step && <div>Breadcrumbs</div>}
        <div className="mx-auto py-8 px-2">
            <div className="max-w-3xl mx-auto space-y-6">
                {!panel.step && <Home />}
                {panel.step === "flowers" && <Flowers />}
            </div>
        </div>
    </div>;
}