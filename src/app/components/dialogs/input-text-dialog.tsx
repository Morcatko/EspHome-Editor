import { modals } from '@mantine/modals';
import { Flex, Select, TextInput } from '@mantine/core';

type TDialogProps = {
  title: string;
  subtitle: string;
  defaultValue: string;
}
export const openInputTextDialog = (props: TDialogProps) =>
  new Promise<string | null>((res) => {
    let value = props.defaultValue;
    const modalId = modals.openConfirmModal({
      title: props.title,
      children: <>
        <div>{props.subtitle}</div>
        <TextInput
          defaultValue={props.defaultValue}
          onChange={(e) => value = e.target.value}
          onKeyDown={(e) => { if (e.key === 'Enter') { modals.close(modalId); res(value); } }} />
      </>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => res(value),
      onCancel: () => res(null),
    });
  });


type TCreateFileDialogProps = TDialogProps & {
  defaultExtension: string;
};

export const openCreateFileDialog = (props: TCreateFileDialogProps) =>
  new Promise<string | null>((res) => {
    let fileName = props.defaultValue;
    let extension = props.defaultExtension;
    const onConfirm = () => res(`${fileName}${extension}`);
    const modalId = modals.openConfirmModal({
      title: props.title,
      children: <>
        <div>{props.subtitle}</div>
        <div className='flex'>
          <TextInput
            className='flex-1'
            defaultValue={props.defaultValue}
            onChange={(e) => fileName = e.target.value}
            onKeyDown={(e) => { if (e.key === 'Enter') { modals.close(modalId); onConfirm(); } }} />
          <Select
            className='w-32 flex-none'
            defaultValue={props.defaultExtension}
            placeholder='Select file type'
            data={[".yaml", ".eta", ".patch.yaml", ".patch.eta"]}
            onChange={(v) => extension = v!} />
        </div>
      </>,
      labels: { confirm: 'Create', cancel: 'Cancel' },
      onConfirm: onConfirm,
      onCancel: () => res(null),
    });
  });