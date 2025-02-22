import { useDevicesStore } from "@/app/stores/devices-store";
import { PanelMode, usePanelsStore } from "@/app/stores/panels-store";
import { color_esphome, color_gray, color_local } from "@/app/utils/const";
import { useDarkTheme } from "@/app/utils/hooks";
import { TDevice } from "@/server/devices/types";
import { ActionIcon } from "@mantine/core";
import { BeakerIcon, CodeIcon, DownloadIcon, GitCompareIcon, LogIcon, UploadIcon } from "@primer/octicons-react";
import { ToolbarItem, TToolbarButtonProps } from "../toolbar";
import { TPanel_Device } from "@/app/stores/panels-store/types";

type TDeviceToolbarItemProps =
    Pick<TToolbarButtonProps, "color"> &
    Pick<TToolbarButtonProps, "disabled"> &
    Pick<TToolbarButtonProps, "className"> & {
        device: TDevice;
        panelMode?: PanelMode;
        icon?: TToolbarButtonProps["icon"];
        tooltip?: TToolbarButtonProps["tooltip"];
    };

type TDeviceToolbarButtonProps_Base =
    Pick<TToolbarButtonProps, "color"> &
    Pick<TToolbarButtonProps, "disabled"> &
    Pick<TToolbarButtonProps, "className"> &
    Pick<TToolbarButtonProps, "tooltip"> &
    Pick<TToolbarButtonProps, "icon">;

type TDeviceToolbarButtonProps_Panel = TDeviceToolbarButtonProps_Base & {
    device: TDevice;
    operation: TPanel_Device["operation"];
    panelMode?: PanelMode;
};

const DTB_Panel = (p: TDeviceToolbarButtonProps_Panel) => {
    const panelsStore = usePanelsStore();
    return <ToolbarItem.Button {...p}
        onClick={(e) =>
            panelsStore.addDevicePanel(
                ((e.button === 1) ? "new_window" : p.panelMode) ?? "default",
                p.device.id,
                p.operation)}
    />;
};


type TDeviceToolbarButtonProps_Device = TDeviceToolbarButtonProps_Base & {
    onClick: (ds: ReturnType<typeof useDevicesStore>) => void;
};

const DTB_Device = (p: TDeviceToolbarButtonProps_Device) => {
    const devicesStore = useDevicesStore();
    return <ToolbarItem.Button {...p} onClick={() => p.onClick(devicesStore)} />;
}

export const DeviceToolbarItem = {
    LocalShow: (p: TDeviceToolbarItemProps) => <DTB_Panel tooltip="Show local yaml configuration" icon={<CodeIcon />} operation="local_device" {...p} />,
    LocalImport: (p: TDeviceToolbarItemProps) => <DTB_Device tooltip="Import yaml configuration" icon={<DownloadIcon />} onClick={(ds) => ds.localDevice_import(p.device.id)} {...p} />,
    Diff: (p: TDeviceToolbarItemProps) => <DTB_Panel tooltip="Show local vs ESPHome diff" icon={<GitCompareIcon />} operation="diff" {...p} />,
    ESPHomeUpload: (p: TDeviceToolbarItemProps) => <DTB_Device tooltip={"Upload local to ESPHome"} icon={<UploadIcon />} onClick={(ds) => ds.espHome_upload(p.device)} {...p} />,
    ESPHomeCreate: (p: TDeviceToolbarItemProps) => <DTB_Device tooltip={"Create device in ESPHome"} icon={<UploadIcon />} onClick={(ds) => ds.espHome_upload(p.device)} {...p} />,
    ESPHomeShow: (p: TDeviceToolbarItemProps) => <DTB_Panel tooltip="Show ESPHome configuration" icon={<CodeIcon />} operation="esphome_device" {...p} />,
    ESPHomeCompile: (p: TDeviceToolbarItemProps) => <DTB_Panel tooltip="Compile ESPHome configuration" icon={<BeakerIcon />} operation="esphome_compile" {...p} />,
    ESPHomeInstall: (p: TDeviceToolbarItemProps) => <DTB_Panel tooltip="Install ESPHome configuration to device" icon={<UploadIcon />} operation="esphome_install" {...p} />,
    ESPHomeLog: (p: TDeviceToolbarItemProps) => <DTB_Panel tooltip="Show ESPHome device log" icon={<LogIcon />} operation="esphome_log" {...p} />,
};

export const DeviceToolbar = ({ device }: { device: TDevice }) => {
    const isDarkMode = useDarkTheme()

    const hasLocalFiles = !!device.files;
    const hasESPHomeConfig = !!device.esphome_config;
    const hasBoth = hasLocalFiles && hasESPHomeConfig;

    const allProps = {
        className: "opacity-80 hover:opacity-100",
    }

    const localProps = {
        ...allProps,
        color: color_local
    };

    const diffProps = {
        ...allProps,
        disabled: !hasBoth,
        color: (hasBoth)
            ? (isDarkMode ? "lightgrey" : color_gray)
            : (isDarkMode ? color_gray : "lightgrey")
    }

    const uploadCreates = !hasESPHomeConfig;
    const uploadProps = {
        ...allProps,
        color: (isDarkMode ? "lightgrey" : color_gray)
    };

    const espHomeProps = {
        ...allProps,
        disabled: !hasESPHomeConfig,
        color: (hasESPHomeConfig ? color_esphome : "lightgrey")
    };

    return <div style={{ marginLeft: '0px' }}>
        <ActionIcon.Group>
            {hasLocalFiles
                ? <DeviceToolbarItem.LocalShow {...localProps} device={device} />
                : <DeviceToolbarItem.LocalImport {...localProps} device={device} />
            }
            <ToolbarItem.Divider />
            <DeviceToolbarItem.Diff {...diffProps} device={device} />
            {uploadCreates
                ? <DeviceToolbarItem.ESPHomeCreate {...uploadProps} device={device} />
                : <DeviceToolbarItem.ESPHomeUpload {...uploadProps} device={device} />
            }
            <ToolbarItem.Divider />
            <DeviceToolbarItem.ESPHomeShow {...espHomeProps} device={device} />
            <DeviceToolbarItem.ESPHomeCompile {...espHomeProps} device={device} />
            <DeviceToolbarItem.ESPHomeInstall {...espHomeProps} device={device} />
            <DeviceToolbarItem.ESPHomeLog {...espHomeProps} device={device} />
        </ActionIcon.Group>
    </div>;
};