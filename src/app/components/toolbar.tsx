import { ActionIcon, ActionIconGroup, ActionIconProps, Anchor, Divider, MantineColor, Tooltip } from "@mantine/core";
import { useDevice } from "../stores/devices-store";
import { DeviceToolbarItem } from "./devices-tree/device-toolbar";
import { SyncIcon } from "@primer/octicons-react";

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


const ToolbarTooltip = (p: { label: string, children: React.ReactNode }) =>
    <Tooltip label={p.label} withinPortal={false} >
        {p.children}
    </Tooltip>;

const ToolbarButton = (p: TToolbarButtonProps) =>
    <ToolbarTooltip label={p.tooltip} >
        <ActionIcon
            {...allProps}
            color={p.color}
            disabled={p.disabled}
            className={p.className}
            onClick={p.onClick}
            onAuxClick={p.onClick} >
            {p.icon}
        </ActionIcon>
    </ToolbarTooltip>;

export const Toolbar = ActionIconGroup;

export const ToolbarItem = {
    AllProps: allProps,
    Stretch: () => <ActionIcon.GroupSection {...allProps} w='100%' />,
    Divider: () => <ActionIcon.GroupSection {...allProps} ><Divider orientation="vertical" /></ActionIcon.GroupSection>,
    Button: ToolbarButton
};

type TOperation = keyof typeof DeviceToolbarItem | "ESPHome";

type TDeviceToolbarOperationsProps = {
    device_id: string;
    current_tab?: TOperation;
    operations: TOperation[];

}

export const DeviceToolbarOperations = (p: TDeviceToolbarOperationsProps) => {
    const device = useDevice(p.device_id)!;
    return <>
        {p.operations.map(op => {
            const extraProps = (p.current_tab === op)
                ? { icon: <SyncIcon />, tooltip: "Refresh" }
                : {};

            switch (op) {
                case "LocalShow": return <><DeviceToolbarItem.LocalShow device={device} panelTarget="floating" /><ToolbarItem.Divider /></>;
                case "Diff": return <DeviceToolbarItem.Diff device={device} panelTarget="floating" />;
                case "ESPHomeUpload": return <><DeviceToolbarItem.ESPHomeUpload device={device} panelTarget="floating" /><ToolbarItem.Divider /></>;
                case "ESPHomeShow": return <DeviceToolbarItem.ESPHomeShow device={device} panelTarget="floating" />
                case "ESPHomeCompile": return <DeviceToolbarItem.ESPHomeCompile device={device} panelTarget="floating" {...extraProps} />;
                case "ESPHomeInstall": return <DeviceToolbarItem.ESPHomeInstall device={device} panelTarget="floating" {...extraProps} />;
                case "ESPHomeLog": return <DeviceToolbarItem.ESPHomeLog device={device} panelTarget="floating" {...extraProps} />;
                case "ESPHome": return <>
                    <ToolbarItem.Divider />
                    <ToolbarTooltip label="Open ESPHome Builder" >
                        <ActionIcon
                            {...allProps}
                            component="a"
                            href={`https://esphome`}
                            target="_blank"
                            {...p} >
                            <img src="./esphome_logo.png"
                                style={{ width: "inherit", height: "inherit" }}
                                className="p-1" />
                        </ActionIcon>
                    </ToolbarTooltip>
                </>;
                default: throw new Error(`Unknown operation: ${op}`);
            }
        })}
    </>
}