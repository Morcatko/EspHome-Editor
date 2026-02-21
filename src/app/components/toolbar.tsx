import React from "react";
import { ActionIcon, ActionIconGroup, ActionIconProps, Divider, TextInput, Tooltip } from "@mantine/core";
import { SearchIcon, XIcon } from "@primer/octicons-react";
import { type useStreamingStore } from "./panels/_utils/streaming-store";

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

type TFilterProps = {
    logStore: ReturnType<typeof useStreamingStore>;
}

export const ToolbarItem = {
    AllProps: allProps,
    Stretch: () => <ActionIcon.GroupSection {...allProps} w='100%' />,
    Divider: () => <ActionIcon.GroupSection {...allProps} ><Divider orientation="vertical" /></ActionIcon.GroupSection>,
    Button: <C = "button",>(p: TToolbarButtonProps<C>) => <ToolbarButton<C> {...p as any} />,  //Arrow functiuon needed because otherwise "component" prop is somehow lost
    HrefButton: (p: HrefButtonProps) => <ToolbarButton {...p} target="_blank" component="a" />,
    Filter: (p: TFilterProps) => {
            return <>
                <div className="w-32 text-right pr-1">
                {p.logStore.filter
                    ? `${p.logStore.filteredData.length} of ${p.logStore.allData.length}`
                    : `${p.logStore.allData.length}`}
            </div>
            <TextInput
                className="px-2 w-64"
                size="xs"
                value={p.logStore.filter}
                onChange={(e) => p.logStore.setFilter(e.currentTarget.value)}
                placeholder="Filter"
                leftSection={<SearchIcon />}
                leftSectionPointerEvents="none"
                rightSection={<ActionIcon variant="subtle" onClick={() => p.logStore.setFilter("")} ><XIcon /></ActionIcon>} />
            </>;
        }
};