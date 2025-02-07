import { ActionIcon, Divider, MantineColor, Tooltip } from "@mantine/core";

export type TToolbarButtonProps = {
    tooltip: string;
    className?: string;
    color?: MantineColor;
    disabled?: boolean;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
    icon: React.ReactNode;
}

export const ToolbarButton = (p: TToolbarButtonProps) => {
    return <Tooltip label={p.tooltip}>
        <ActionIcon
            variant="subtle"
            color={p.color}
            disabled={p.disabled}
            className={p.className}
            onClick={p.onClick}
            onAuxClick={p.onClick} >
            {p.icon}
        </ActionIcon>
    </Tooltip>;
}

export const ToolbarDivider = () =>
    <ActionIcon.GroupSection variant="subtle"><Divider orientation="vertical" /></ActionIcon.GroupSection>
