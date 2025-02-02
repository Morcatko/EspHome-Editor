import { modals } from '@mantine/modals';
import { TextInput } from '@mantine/core';

type TContentProps = {
  subtitle: string;
  defaultValue: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
}

const InputTextDialogContent = (props: TContentProps) => <>
  <div>{props.subtitle}</div>
  <TextInput
    defaultValue={props.defaultValue}
    onChange={(e) => props.onChange(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && props.onConfirm()} />
</>;

type TDialogProps = {
  title: string;
  subtitle: string;
  defaultValue: string;
}
export const openInputTextDialog = (props: TDialogProps) =>
  new Promise<string | null>((res, rej) => {
    let value = props.defaultValue;
    let modalId = modals.openConfirmModal({
      title: props.title,
      children: <InputTextDialogContent
        subtitle={props.subtitle}
        defaultValue={props.defaultValue}
        onChange={(v) => value = v}
        onConfirm={() => { modals.close(modalId); res(value); }} />,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => res(value),
      onCancel: () => res(null),
    });
  });