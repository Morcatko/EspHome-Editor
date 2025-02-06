import { useDevicesStore } from "@/app/stores/devices-store";
import { usePanelsStore } from "@/app/stores/panels-store";
import { color_esphome, color_gray, color_local } from "@/app/utils/const";
import { useDarkTheme } from "@/app/utils/hooks";
import { TDevice } from "@/server/devices/types";
import { ActionIcon, ActionIconProps, Divider, Tooltip } from "@mantine/core";
import { BeakerIcon, CodeIcon, DownloadIcon, GitCompareIcon, LogIcon, UploadIcon } from "@primer/octicons-react";

export const DeviceToolbar = ({ device }: { device: TDevice }) => {
    const isDarkMode = useDarkTheme()
    const devicesStore = useDevicesStore();
    const panels = usePanelsStore()

    const hasLocalFiles = !!device.files;
    const hasESPHomeConfig = !!device.esphome_config;
    const hasBoth = hasLocalFiles && hasESPHomeConfig;

    const allProps = {
        variant: "subtle" as ActionIconProps["variant"],
        className: "opacity-80 hover:opacity-100",
    }

    const localProps: ActionIconProps = {
        ...allProps,
        color: color_local
    };

    const diffProps: ActionIconProps = {
        ...allProps,
        disabled: !hasBoth,
        color: (hasBoth)
            ? (isDarkMode ? "lightgrey" : color_gray)
            : (isDarkMode ? color_gray : "lightgrey")
    }

    const uploadCreates = !hasESPHomeConfig;
    const uploadProps: ActionIconProps = {
        ...allProps,
        color: (isDarkMode ? "lightgrey" : color_gray)
    };

    const espHomeProps: ActionIconProps = {
        ...allProps,
        disabled: !hasESPHomeConfig,
        color: hasESPHomeConfig ? color_esphome : "lightgrey",
    };

    return <div style={{ marginLeft: '0px' }}>
        <ActionIcon.Group>
            {hasLocalFiles
                ? <Tooltip label="Show local yaml configuration"><ActionIcon {...localProps} onAuxClick={(e) => panels.addDevicePanel(e, device, "local_device")} ><CodeIcon /></ActionIcon></Tooltip>
                : <Tooltip label="Import yaml configuration"><ActionIcon {...localProps} onAuxClick={(e) => devicesStore.localDevice_import(device)} ><DownloadIcon /></ActionIcon></Tooltip>
            }
            <ActionIcon.GroupSection {...allProps}> <Divider orientation="vertical" /></ActionIcon.GroupSection>
            <Tooltip label="Show local vs ESPHome diff"><ActionIcon {...diffProps} onAuxClick={(e) => panels.addDevicePanel(e, device, "diff")} ><GitCompareIcon /></ActionIcon></Tooltip>
            <Tooltip label={uploadCreates ? "Create device in ESPHome" : "Upload local to ESPHome"}><ActionIcon {...uploadProps} onAuxClick={() => devicesStore.espHome_upload(device)} ><UploadIcon /></ActionIcon></Tooltip>
            <ActionIcon.GroupSection {...allProps}> <Divider orientation="vertical" /></ActionIcon.GroupSection>
            <Tooltip label="Show ESPHome configuration"><ActionIcon  {...espHomeProps} onAuxClick={(e) => panels.addDevicePanel(e, device, "esphome_device")} ><CodeIcon /></ActionIcon></Tooltip>
            <Tooltip label="Compile ESPHome configuration"><ActionIcon  {...espHomeProps} onAuxClick={(e) => panels.addDevicePanel(e, device, "esphome_compile")} ><BeakerIcon /></ActionIcon></Tooltip>
            <Tooltip label="Install ESPHome configuration to device"><ActionIcon  {...espHomeProps} onAuxClick={(e) => panels.addDevicePanel(e, device, "esphome_install")} ><UploadIcon /></ActionIcon></Tooltip>
            <Tooltip label="Show ESPHome device logs"><ActionIcon  {...espHomeProps} onAuxClick={(e) => panels.addDevicePanel(e, device, "esphome_log")} ><LogIcon /></ActionIcon></Tooltip>
        </ActionIcon.Group>
    </div>;
};