import { ActionIcon, ActionIconGroup, ActionIconProps, Anchor, Divider, MantineColor, Tooltip } from "@mantine/core";
import { useDevice } from "../stores/devices-store";
import { DeviceToolbarItem } from "./devices-tree/device-toolbar";
import { SyncIcon } from "@primer/octicons-react";
import { Fragment } from "react";
import { PanelTarget } from "../stores/panels-store";

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

type TOperation = keyof typeof DeviceToolbarItem | "LocalShowOrImport" | "ESPHomeCreateOrUpload" | "ESPHome";

type TDeviceToolbarOperationsProps = {
    className?: string;
    device_id: string;
    panelTarget?: PanelTarget;
    current_tab?: TOperation;
    operations: TOperation[];
}

export const DeviceToolbarOperations = (p: TDeviceToolbarOperationsProps) => {
    const device = useDevice(p.device_id)!;
    const hasLocalFiles = !!device.files;
    const hasESPHomeConfig = !!device.esphome_config;
    const uploadCreates = !hasESPHomeConfig;

    const props = {
        ...allProps,
        device: device,
        panelTarget: p.panelTarget,
    }

    return <>
        {p.operations.map(op => {
            const extraProps = (p.current_tab === op)
                ? { ...props, icon: <SyncIcon />, tooltip: "Refresh" }
                : props;

            switch (op) {
                case "LocalShowOrImport": return <Fragment key={op}>
                    {hasLocalFiles
                        ? <DeviceToolbarItem.LocalShow {...props} />
                        : <DeviceToolbarItem.LocalImport {...props} />
                    }
                    <ToolbarItem.Divider />
                </Fragment>;
                case "Diff": return <DeviceToolbarItem.Diff key={op} {...props} />;
                case "ESPHomeCreateOrUpload": return <Fragment key={op}>
                    {
                        uploadCreates
                            ? <DeviceToolbarItem.ESPHomeCreate {...props} />
                            : <DeviceToolbarItem.ESPHomeUpload {...props} />
                    }

                    <ToolbarItem.Divider />
                </Fragment>;
                case "ESPHomeShow": return <DeviceToolbarItem.ESPHomeShow key={op} {...props} />
                case "ESPHomeCompile": return <DeviceToolbarItem.ESPHomeCompile key={op} {...extraProps} />;
                case "ESPHomeInstall": return <DeviceToolbarItem.ESPHomeInstall key={op} {...extraProps} />;
                case "ESPHomeLog": return <DeviceToolbarItem.ESPHomeLog key={op} {...extraProps} />;
                case "ESPHome": return <Fragment key={op}>
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
                </Fragment>;
                default: throw new Error(`Unknown operation: ${op}`);
            }
        })}
    </>
}