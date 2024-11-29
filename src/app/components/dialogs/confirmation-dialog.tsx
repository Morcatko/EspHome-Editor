import { Dialog } from "@primer/react"
import { observer } from "mobx-react-lite";
import { useStore } from "@/app/stores";
import { TCommonModalStoreData } from "./common-dialog-store";

export type TConfirmationModalStoreData = TCommonModalStoreData & {
  text: string;
}

export const ConfirmationDialog = observer(() => {
  const modalStore = useStore().confirmationDialog;

  return modalStore.isOpen &&
    <Dialog
      title={modalStore.storeData.title}
      subtitle={modalStore.storeData.subtitle}
      onClose={() => modalStore.onClose()}
      footerButtons={[
        {
          buttonType: modalStore.storeData.confirmButtonType ?? 'default',
          content: modalStore.storeData.cancelLabel ?? 'Cancel',
          onClick: () => modalStore.onCancel(),
        },
        {
          buttonType: modalStore.storeData.confirmButtonType ?? 'primary',
          content: modalStore.storeData.confirmLabel ?? 'Confirm',
          onClick: () => modalStore.onConfirm()
        },
      ]}
    >
      {modalStore.storeData.text}
    </Dialog>;
});