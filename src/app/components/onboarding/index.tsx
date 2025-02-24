import { Home } from './home';
import { Flowers } from './flowers';
import { TPanel_Onboarding } from '@/app/stores/panels-store/types';
import { Breadcrumbs, Anchor } from '@mantine/core';
import { usePanelsStore } from '@/app/stores/panels-store';
import { ChevronRightIcon } from '@primer/octicons-react';

export const Onboarding = ({ panel }: { panel: TPanel_Onboarding }) => {
    const panelsStore = usePanelsStore();

    const isHome = (!panel.step || (panel.step === "home"));
    const isFlowers = (panel.step === "flowers");
    return <div className='overflow-auto h-full'>
        <Breadcrumbs m="sm" separator={<ChevronRightIcon />} aria-label="breadcrumbs">
            {isHome && <div>&nbsp;</div>}
            {!isHome &&
                <Anchor onClick={() => panelsStore.addPanel("default", { operation: "onboarding", step: "home" })} >
                    Home
                </Anchor>}
            {isFlowers && <div>Flowers</div>}
        </Breadcrumbs>
        <div className="mx-auto py-3 px-2">
            <div className="max-w-3xl mx-auto space-y-6">
                {isHome && <Home />}
                {isFlowers && <Flowers />}
            </div>
        </div>
    </div>;
}