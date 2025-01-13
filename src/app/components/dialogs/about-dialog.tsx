import { atom, useAtom } from 'jotai';
import { Button, DialogActions, DialogContent, DialogTitle, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { useStatusStore } from '@/app/stores/status-store';
import { LinkExternalIcon } from '@primer/octicons-react';

const aboutDialogVisibleAtom = atom<boolean>(false);
export const useAboutDialogVisible = () => useAtom(aboutDialogVisibleAtom);


export const AboutDialog = () => {
    const [visible, setVisible] = useAboutDialogVisible();
    const statusStore = useStatusStore();

    return <Modal
        open={visible}
        onClose={() => setVisible(false)}>
        <ModalDialog>
            <ModalClose />
            <DialogTitle>Editor for ESPHome</DialogTitle>
            <DialogContent>
                <div className="space-y-2 mt-4">
                    {statusStore.query.isSuccess && <>
                        <div>Version: {statusStore.query.data?.version}</div>
                        <div>ESPHome: <a className="underline text-blue-600 dark:text-blue-800 hover:text-blue-800" href={statusStore.query.data?.espHomeWebUrl} target="_blank">{statusStore.query.data?.espHomeWebUrl} <LinkExternalIcon className="inline" /></a></div>
                    </>}
                    <div >
                        <a className="underline text-blue-600 dark:text-blue-800 hover:text-blue-800" href="https://github.com/Morcatko/EspHome-Editor/issues" target="_blank">Provide Feedback <LinkExternalIcon className="inline" /></a>
                    </div>
                </div>
            </DialogContent>
        </ModalDialog>
    </Modal>
}