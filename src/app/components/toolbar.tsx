import { ActionIcon, ActionIconGroup, ActionIconProps, Divider, MantineColor, Tooltip } from "@mantine/core";

const allProps = {
        variant: "subtle" as ActionIconProps["variant"],
    }

export type TToolbarButtonProps = {
    tooltip: string;
    className?: string;
    color?: MantineColor;
    disabled?: boolean;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
    icon: React.ReactNode;
}

const ToolbarButton = (p: TToolbarButtonProps) => {
    return <Tooltip label={p.tooltip}>
        <ActionIcon
            {...allProps}
            color={p.color}
            disabled={p.disabled}
            className={p.className}
            onClick={p.onClick}
            onAuxClick={p.onClick} >
            {p.icon}
        </ActionIcon>
    </Tooltip>;
}

export const Toolbar = ActionIconGroup;

export const ToolbarItem = {
    AllProps: allProps,
    Stretch: () => <ActionIcon.GroupSection {...allProps} w='100%' />,
    Divider: () => <ActionIcon.GroupSection {...allProps} ><Divider orientation="vertical" /></ActionIcon.GroupSection>,
    Button: ToolbarButton
};