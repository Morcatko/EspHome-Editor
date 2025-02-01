import { atom, useAtom } from 'jotai';
import { DialogContent, DialogTitle, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { useStatusStore } from '@/app/stores/status-store';
import { LinkExternalIcon } from '@primer/octicons-react';
import { modals } from '@mantine/modals';

const AboutDialogContent = () => {
    const statusStore = useStatusStore();
    return <div className="space-y-2 mt-4">
        {statusStore.query.isSuccess && <>
            <div>Version: {statusStore.query.data?.version}</div>
            <div>
                <a className="underline text-blue-600 dark:text-blue-800 hover:text-blue-800" href={statusStore.query.data?.espHomeWebUrl} target="_blank">ESPHome <LinkExternalIcon className="inline" /></a>
            </div>
        </>}
        <div >
            <a className="underline text-blue-600 dark:text-blue-800 hover:text-blue-800" href="https://github.com/Morcatko/EspHome-Editor/issues" target="_blank">Provide Feedback <LinkExternalIcon className="inline" /></a>
        </div>
    </div>;
}
export const openAboutDialog = () =>
    modals.open({
        title: "Editor for ESPHome",
        children: <AboutDialogContent />
    })