import { modals } from "@mantine/modals";

type TContentProps = {
  subtitle: string;
  text: string;
}

const ConfirmationDialogContent = (props: TContentProps) => <>
  <div>{props.subtitle}</div>
  <div>{props.text}</div>
</>;

type TDialogProps = {
  title: string;
  subtitle: string;
  text: string;
  danger: boolean
}
export const openConfirmationDialog = (props: TDialogProps) =>
  new Promise<boolean>((res, rej) =>
    modals.openConfirmModal({
      title: props.title,
      children: <ConfirmationDialogContent subtitle={props.subtitle} text={props.text} />,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: props.danger ? "red" : "default" },
      onConfirm: () => res(true),
      onCancel: () => res(false),
    })
  );