import { Box, Dialog, FormControl, TextInput } from "@primer/react"
import { TCommonModalStoreData } from "./common-dialog-store";
import { useTextInputDialogInternalStore } from "@/app/stores/dialogs-store";

export type TTextInputModalStoreData = TCommonModalStoreData & {
  defaultValue?: string;
}

export const InputTextDialog = () => {
  const store = useTextInputDialogInternalStore();

  return store.isOpen &&
    <Dialog
      title={store.modalContent.title}
      subtitle={store.modalContent.subtitle}
      onClose={() => store.onCancel()}
      footerButtons={[
        {
          buttonType: store.modalContent.confirmButtonType ?? 'default',
          content: store.modalContent.cancelLabel ?? 'Cancel',
          onClick: () => store.onCancel(),
        },
        {
          buttonType: store.modalContent.confirmButtonType ?? 'primary',
          content: store.modalContent.confirmLabel ?? 'Confirm',
          onClick: () => store.onConfirm()
        },
      ]}
    >

      <Box as="form">
        <FormControl>
          {/* <FormControl.Label>New name</FormControl.Label> */}
          <TextInput
            value={store.modalContent.value}
            onChange={(e) => store.setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && store.onConfirm()}
          />
        </FormControl>
      </Box>

    </Dialog>;
};