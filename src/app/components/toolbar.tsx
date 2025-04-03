import { ActionIcon, ActionIconGroup, ActionIconProps, Divider, Tooltip } from "@mantine/core";
import React from "react";

const allProps: Pick<ActionIconProps, "variant"> =
{
    variant: "subtle",
}

export type TToolbarButtonProps<C = "button"> = Parameters<typeof ActionIcon<C>>[0] & {
    tooltip: string;
    icon: React.ReactNode;
}

const ToolbarButton = <C, >(p: TToolbarButtonProps<C>) => {
    const { tooltip, icon, ...x } = p;

    const restProps = x as any;
    if (restProps.onClick)
        restProps.onAuxClick = restProps.onClick;

    return <Tooltip label={p.tooltip} withinPortal={false} >
        <ActionIcon<C>
            {...allProps}
            {...restProps} >
            {p.icon}
        </ActionIcon>
    </Tooltip>;
}

export const Toolbar = ActionIconGroup;

type HrefButtonProps = Pick<TToolbarButtonProps<"a">, "href" | "tooltip" | "icon">;

export const ToolbarItem = {
    AllProps: allProps,
    Stretch: () => <ActionIcon.GroupSection {...allProps} w='100%' />,
    Divider: () => <ActionIcon.GroupSection {...allProps} ><Divider orientation="vertical" /></ActionIcon.GroupSection>,
    Button: <C = "button",>(p: TToolbarButtonProps<C>) => <ToolbarButton<C> {...p as any} />,  //Arrow functiuon needed because otherwise "component" prop is somehow lost
    HrefButton: (p: HrefButtonProps) => <ToolbarButton {...p} target="_blank" component="a" />,
};