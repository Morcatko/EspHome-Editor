import { useStatusStore } from '@/app/stores/status-store';
import { LinkExternalIcon } from '@primer/octicons-react';
import { modals } from '@mantine/modals';
import { Anchor } from '@mantine/core';

const AboutDialogContent = () => {
    const statusStore = useStatusStore();
    return <div className="space-y-2 mt-4">
        {statusStore.query.isSuccess && <>
            <div>
                Version: <Anchor href="https://github.com/Morcatko/EspHome-Editor/releases" target="_blank">{statusStore.query.data?.version} <LinkExternalIcon className="inline" /></Anchor>
            </div>
            <div>
                <Anchor href={statusStore.query.data?.espHomeWebUrl} target="_blank">ESPHome <LinkExternalIcon className="inline" /></Anchor>
            </div>
        </>}
        <div >
            <Anchor href="https://github.com/Morcatko/EspHome-Editor/issues" target="_blank">Provide Feedback <LinkExternalIcon className="inline" /></Anchor>
        </div>
    </div>;
}
export const openAboutDialog = () =>
    modals.open({
        title: <Anchor href="https://editor-4-esphome.github.io/" target="_blank">Editor for ESPHome</Anchor>,
        children: <AboutDialogContent />
    })