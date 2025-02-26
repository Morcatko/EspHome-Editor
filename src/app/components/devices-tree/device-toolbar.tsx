import { useDevicesStore } from "@/app/stores/devices-store";
import { usePanelsStore } from "@/app/stores/panels-store";
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
};

const DTB_Panel = (p: TDeviceToolbarButtonProps_Panel) => {
    const panelsStore = usePanelsStore();
    return <ToolbarItem.Button {...p}
        onClick={(e) =>
            panelsStore.addDevicePanel(
                (e.button === 1) ? "new_window" : "default",
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
    LocalShow: (p: TDeviceToolbarItemProps) => <DTB_Panel tooltip="Show local yaml configuration" icon={<CodeIcon />} operation="local_device" color={color_local} {...p} />,
    LocalImport: (p: TDeviceToolbarItemProps) => <DTB_Device tooltip="Import yaml configuration" icon={<DownloadIcon />} onClick={(ds) => ds.localDevice_import(p.device.id)} color={color_local} {...p} />,
    Diff: (p: TDeviceToolbarItemProps) => {
        const isDarkMode = useDarkTheme();
        const hasBoth = !!p.device.files && !!p.device.esphome_config;
        return <DTB_Panel tooltip="Show local vs ESPHome diff" icon={<GitCompareIcon />} operation="diff"
            disabled={!hasBoth}
            color={(hasBoth)
                ? (isDarkMode ? "lightgrey" : color_gray)
                : (isDarkMode ? color_gray : "lightgrey")} {...p} />;
    },
    ESPHomeUpload: (p: TDeviceToolbarItemProps) => { const d = useDarkTheme(); return <DTB_Device tooltip={"Upload local to ESPHome"} icon={<UploadIcon />} onClick={(ds) => ds.espHome_upload(p.device)} color={d ? "lightgrey" : color_gray} {...p} />; },
    ESPHomeCreate: (p: TDeviceToolbarItemProps) => { const d = useDarkTheme(); return <DTB_Device tooltip={"Create device in ESPHome"} icon={<UploadIcon />} onClick={(ds) => ds.espHome_upload(p.device)} color={d ? "lightgrey" : color_gray} {...p} />; },
    ESPHomeShow: (p: TDeviceToolbarItemProps) => { const hasEspHomeConfig = !!p.device.esphome_config; return <DTB_Panel tooltip="Show ESPHome configuration" icon={<CodeIcon />} operation="esphome_device" disabled={!hasEspHomeConfig} color={hasEspHomeConfig ? color_esphome : "lightgrey"}{...p} />; },
    ESPHomeCompile: (p: TDeviceToolbarItemProps) => { const hasEspHomeConfig = !!p.device.esphome_config; return <DTB_Panel tooltip="Compile ESPHome configuration" icon={<BeakerIcon />} operation="esphome_compile" disabled={!hasEspHomeConfig} color={hasEspHomeConfig ? color_esphome : "lightgrey"}{...p} />; },
    ESPHomeInstall: (p: TDeviceToolbarItemProps) => { const hasEspHomeConfig = !!p.device.esphome_config; return <DTB_Panel tooltip="Install ESPHome configuration to device" icon={<UploadIcon />} operation="esphome_install" disabled={!hasEspHomeConfig} color={hasEspHomeConfig ? color_esphome : "lightgrey"}{...p} />; },
    ESPHomeLog: (p: TDeviceToolbarItemProps) => { const hasEspHomeConfig = !!p.device.esphome_config; return <DTB_Panel tooltip="Show ESPHome device log" icon={<LogIcon />} operation="esphome_log" disabled={!hasEspHomeConfig} color={hasEspHomeConfig ? color_esphome : "lightgrey"} {...p} />; },
};

export const DeviceToolbar = ({ device }: { device: TDevice }) => {
    const hasLocalFiles = !!device.files;
    const hasESPHomeConfig = !!device.esphome_config;

    const uploadCreates = !hasESPHomeConfig;
    const props = {
        className: "opacity-80 hover:opacity-100",
        device: device
    }

    return <div style={{ marginLeft: '0px' }}>
        <ActionIcon.Group>
            {hasLocalFiles
                ? <DeviceToolbarItem.LocalShow {...props} />
                : <DeviceToolbarItem.LocalImport {...props} />
            }
            <ToolbarItem.Divider />
            <DeviceToolbarItem.Diff {...props} device={device} />
            {uploadCreates
                ? <DeviceToolbarItem.ESPHomeCreate {...props} />
                : <DeviceToolbarItem.ESPHomeUpload {...props} />
            }
            <ToolbarItem.Divider />
            <DeviceToolbarItem.ESPHomeShow {...props} />
            <DeviceToolbarItem.ESPHomeCompile {...props} />
            <DeviceToolbarItem.ESPHomeInstall {...props} />
            <DeviceToolbarItem.ESPHomeLog {...props} />
        </ActionIcon.Group>
    </div>;
};