import { Button, DialogActions, DialogContent, DialogTitle, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { observer } from "mobx-react-lite";
import { useStore } from "@/app/stores";
import { TCommonModalStoreData } from "./common-dialog-store";

export type TConfirmationModalStoreData = TCommonModalStoreData & {
  text: string;
}

export const ConfirmationDialog = observer(() => {
  const modalStore = useStore().confirmationDialog;

  return modalStore.isOpen &&
    <Modal open={modalStore.isOpen} onClose={() => modalStore.onClose()} >
      <ModalDialog>
        <ModalClose />
        <DialogTitle>{modalStore.storeData.title}</DialogTitle>
        <DialogContent>
          <div>{modalStore.storeData.subtitle}</div>
          <div>{modalStore.storeData.text}</div>
        </DialogContent>
        <DialogActions>
          <Button variant="soft" color={modalStore.storeData.confirmButtonColor ?? "success"} onClick={() => modalStore.onConfirm()}>
            {modalStore.storeData.confirmLabel ?? 'Confirm'}
          </Button>
          <Button variant="soft" color={modalStore.storeData.cancelButtonColor ?? "neutral"} onClick={() => modalStore.onCancel()}>
            {modalStore.storeData.cancelLabel ?? 'Cancel'}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>;
});