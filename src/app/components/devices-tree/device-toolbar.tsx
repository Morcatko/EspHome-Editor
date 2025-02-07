import { useDevicesStore } from "@/app/stores/devices-store";
import { usePanelsStore } from "@/app/stores/panels-store";
import { color_esphome, color_gray, color_local } from "@/app/utils/const";
import { useDarkTheme } from "@/app/utils/hooks";
import { TDevice } from "@/server/devices/types";
import { ActionIcon } from "@mantine/core";
import { BeakerIcon, CodeIcon, DownloadIcon, GitCompareIcon, LogIcon, UploadIcon } from "@primer/octicons-react";
import { ToolbarButton, ToolbarDivider, TToolbarButtonProps } from "../toolbar";

type TDeviceToolbarButtonProps =
    Pick<TToolbarButtonProps, "color"> &
    Pick<TToolbarButtonProps, "disabled"> &
    Pick<TToolbarButtonProps, "className"> &
    Pick<TToolbarButtonProps, "onClick">;

export const DeviceToolbarButtons = {
    LocalShow: (p: TDeviceToolbarButtonProps) => <ToolbarButton tooltip="Show local yaml configuration" icon={<CodeIcon />} {...p} />,
    LocalImport: (p: TDeviceToolbarButtonProps) => <ToolbarButton tooltip="Import yaml configuration" icon={<DownloadIcon />} {...p} />,
    Diff: (p: TDeviceToolbarButtonProps) => <ToolbarButton tooltip="Show local vs ESPHome diff" icon={<GitCompareIcon />}{...p} />,
    ESPHomeUpload: (p: TDeviceToolbarButtonProps) => <ToolbarButton tooltip={"Upload local to ESPHome"} icon={<UploadIcon />} {...p} />,
    ESPHomeCreate: (p: TDeviceToolbarButtonProps) => <ToolbarButton tooltip={"Create device in ESPHome"} icon={<UploadIcon />} {...p} />,
    ESPHomeShow: (p: TDeviceToolbarButtonProps) => <ToolbarButton tooltip="Show ESPHome configuration" icon={<CodeIcon />}  {...p} />,
    ESPHomeCompile: (p: TDeviceToolbarButtonProps) => <ToolbarButton tooltip="Compile ESPHome configuration" icon={<BeakerIcon />}  {...p} />,
    ESPHomeInstall: (p: TDeviceToolbarButtonProps) => <ToolbarButton tooltip="Install ESPHome configuration to device" icon={<UploadIcon />} {...p} />,
    ESPHomeLog: (p: TDeviceToolbarButtonProps) => <ToolbarButton tooltip="Show ESPHome device log" icon={<LogIcon />} {...p} />,

};

export const DeviceToolbar = ({ device }: { device: TDevice }) => {
    const isDarkMode = useDarkTheme()
    const devicesStore = useDevicesStore();
    const panels = usePanelsStore()

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
                ? <DeviceToolbarButtons.LocalShow {...localProps} onClick={(e) => panels.addDevicePanel(e, device, "local_device")} />
                : <DeviceToolbarButtons.LocalImport {...localProps} onClick={(e) => devicesStore.localDevice_import(device)} />
            }
            <ToolbarDivider />
            <DeviceToolbarButtons.Diff {...diffProps} onClick={(e) => panels.addDevicePanel(e, device, "diff")} />
            {uploadCreates
                ? <DeviceToolbarButtons.ESPHomeCreate {...uploadProps} onClick={(e) => devicesStore.espHome_upload(device)} />
                : <DeviceToolbarButtons.ESPHomeUpload {...uploadProps} onClick={(e) => devicesStore.espHome_upload(device)} />
            }
            <ToolbarDivider />
            <DeviceToolbarButtons.ESPHomeShow {...espHomeProps} onClick={(e) => panels.addDevicePanel(e, device, "esphome_device")} />
            <DeviceToolbarButtons.ESPHomeCompile {...espHomeProps} onClick={(e) => panels.addDevicePanel(e, device, "esphome_compile")} />
            <DeviceToolbarButtons.ESPHomeInstall {...espHomeProps} onClick={(e) => panels.addDevicePanel(e, device, "esphome_install")} />
            <DeviceToolbarButtons.ESPHomeLog {...espHomeProps} onClick={(e) => panels.addDevicePanel(e, device, "esphome_log")} />
        </ActionIcon.Group>
    </div>;
};