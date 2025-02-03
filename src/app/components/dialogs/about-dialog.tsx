import { useStatusStore } from '@/app/stores/status-store';
import { LinkExternalIcon } from '@primer/octicons-react';
import { modals } from '@mantine/modals';
import { Anchor } from '@mantine/core';

const AboutDialogContent = () => {
    const statusStore = useStatusStore();
    return <div className="space-y-2 mt-4">
        {statusStore.query.isSuccess && <>
            <div>Version: {statusStore.query.data?.version}</div>
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
        title: "Editor for ESPHome",
        children: <AboutDialogContent />
    })