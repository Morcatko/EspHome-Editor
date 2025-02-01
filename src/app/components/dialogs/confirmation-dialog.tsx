import { modals } from "@mantine/modals";

type TContentProps = {
  subtitle: string;
  text: string;
}
const ConfirmationDialogContent = (props: TContentProps) => <>
  <div>{props.subtitle}</div>
  <div>{props.text}</div>
</>;

export const openConfirmationDialog = (
  title: string,
  subtitle: string,
  text: string,
  danger: boolean = false
) =>
  new Promise<boolean>((res, rej) =>
    modals.openConfirmModal({
      title: title,
      children: <ConfirmationDialogContent subtitle={subtitle} text={text} />,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: danger ? "red" : "default" },
      onConfirm: () => res(true),
      onCancel: () => res(false),
    })
  );