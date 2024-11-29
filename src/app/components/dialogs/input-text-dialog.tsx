import { Box, Dialog, FormControl, TextInput } from "@primer/react"
import { observer } from "mobx-react-lite";
import { useStore } from "@/app/stores";
import { TCommonModalStoreData } from "./common-dialog-store";

export type TTextInputModalStoreData = TCommonModalStoreData & {
  defaultValue?: string;
}

export const InputTextDialog = observer(() => {
  const modalStore = useStore().inputTextDialog;

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

      <Box as="form">
        <FormControl>
          {/* <FormControl.Label>New name</FormControl.Label> */}
          <TextInput
            value={modalStore.value}
            onChange={(e) => modalStore.setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && modalStore.onConfirm()}
          />
        </FormControl>
      </Box>

    </Dialog>;
});