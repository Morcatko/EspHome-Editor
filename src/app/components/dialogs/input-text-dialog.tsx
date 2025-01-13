import { Button, DialogActions, DialogContent, DialogTitle, FormControl, Input, Modal, ModalClose, ModalDialog } from '@mui/joy';
import { observer } from "mobx-react-lite";
import { useStore } from "@/app/stores";
import { TCommonModalStoreData } from "./common-dialog-store";

export type TTextInputModalStoreData = TCommonModalStoreData & {
  defaultValue?: string;
}

export const InputTextDialog = observer(() => {
  const modalStore = useStore().inputTextDialog;

  return modalStore.isOpen &&
    <Modal open={modalStore.isOpen} onClose={() => modalStore.onClose()} >
      <ModalDialog>
        <ModalClose />
        <DialogTitle>{modalStore.storeData.title}</DialogTitle>
        <DialogContent>
          <div>{modalStore.storeData.subtitle}</div>
          <FormControl>
            <Input
              value={modalStore.value}
              onChange={(e) => modalStore.setValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && modalStore.onConfirm()} />
          </FormControl>
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
    </Modal>
});