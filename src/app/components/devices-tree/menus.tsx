import { ActionIcon, Menu } from "@mantine/core";
import { KebabHorizontalIcon } from "@primer/octicons-react";

export const MenuTarget = () =>
    <Menu.Target>
        <ActionIcon
            className="opacity-30 hover:opacity-100"
            variant="transparent"
            color="gray"
            onClick={(e) => e.stopPropagation()}>
            <KebabHorizontalIcon />
        </ActionIcon>
    </Menu.Target>;

type TMenuItemProps = {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
}
export const MenuItem = (p: TMenuItemProps) =>
    <Menu.Item
        leftSection={p.icon}
        onClick={(e) => { e.stopPropagation(); p.onClick() }} >
        {p.label}
    </Menu.Item>;