"use client";
import { useQuery } from "@tanstack/react-query";
import Image from 'next/image';
import { IconButtonProps, TreeView } from "@primer/react";
import { TDevice, TLocalFileOrDirectory, TParent } from "@/server/devices/types";
import { BeakerIcon, CodeIcon, DownloadIcon, KebabHorizontalIcon, FileDirectoryIcon, GitCompareIcon, LightBulbIcon, LogIcon, UploadIcon, PencilIcon, FileCodeIcon, QuestionIcon, XIcon, PlusIcon } from "@primer/octicons-react";
import { color_esphome, color_gray, color_local, color_offline, color_online } from "../utils/const";
import etajsIcon from "@/assets/etajs-logo.svg";
import { api } from "../utils/api-client";
import { useDevicesStore } from "../stores/devices-store";
import { usePanelsStore } from "../stores/panels-store";
import { useDarkTheme } from "../utils/hooks";
import { ActionIcon, ActionIconProps, Divider, Menu, PolymorphicComponentProps, Tooltip } from "@mantine/core";

const FileTypeIcon = ({ fod }: { fod: TLocalFileOrDirectory }) => {
    if (fod.type === "directory")
        return <FileDirectoryIcon />
    switch (fod.compiler) {
        case "etajs":
            return <Image src={etajsIcon} width={16} alt="etajs template" />
        case "none":
            return <FileCodeIcon />;
        default:
            return <QuestionIcon />
    }
}

const ThreeDotProps: PolymorphicComponentProps<"button", ActionIconProps> = {
    variant: "transparent",
    color: "gray" as ActionIconProps["color"],
    className: "opacity-30 hover:opacity-100",
    onClick: (e) => e.stopPropagation()
};

const LocalFileOrDirectory = ({ device, fod }: { device: TDevice, fod: TLocalFileOrDirectory }) => {
    const panels = usePanelsStore();
    const devicesStore = useDevicesStore();
    const exp = devicesStore.expanded;

    return <TreeView.Item
        key={fod.path}
        id={fod.id}
        expanded={exp.get(`${device.id}/${fod.path}`)}
        onExpandedChange={(e) => exp.set(`${device.id}/${fod.path}`, e)}
        onSelect={
            (fod.type === "file")
                ? (e) => panels.addDevicePanel(e, device, "local_file", fod)
                : undefined} >
        <TreeView.LeadingVisual>
            <div style={{ opacity: "55%" }}>
                <FileTypeIcon fod={fod} />
            </div>
        </TreeView.LeadingVisual>
        <span className="text-(color:--foreground)">{fod.name}</span>
        <TreeView.TrailingVisual>
            <Menu width={150}>
                <Menu.Target>
                    <ActionIcon {...ThreeDotProps}>
                        <KebabHorizontalIcon />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    {(fod.type === "directory") && <>
                        <Menu.Item leftSection={<FileCodeIcon />} onClick={(e) => { devicesStore.localDevice_addFile(device, fod.path); e.stopPropagation(); }} >
                            New File...
                        </Menu.Item>
                        <Menu.Item leftSection={<FileDirectoryIcon />} onClick={(e) => { devicesStore.localDevice_addDirectory(device, fod.path); e.stopPropagation(); }}>
                            New Folder...
                        </Menu.Item>
                        <Menu.Divider />
                    </>
                    }
                    <Menu.Item leftSection={<PencilIcon />} onClick={(e) => { devicesStore.local_renameFoD(device, fod); e.stopPropagation(); }}>
                        Rename...
                    </Menu.Item>
                    <Menu.Item leftSection={<XIcon />} onClick={(e) => { devicesStore.local_deleteFoD(device, fod); e.stopPropagation(); }} variant="danger">
                        Delete...
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </TreeView.TrailingVisual>
        {fod.type === "directory"
            ? <TreeView.SubTree><LocalFiles device={device} parent={fod} /></TreeView.SubTree>
            : null}
    </TreeView.Item>;
};

const LocalFiles = ({ device, parent }: { device: TDevice, parent: TParent }) => {
    return <>
        {parent.files?.map((fod) => <LocalFileOrDirectory key={fod.path} device={device} fod={fod} />)}
    </>
}

const DeviceToolbar = ({ device }: { device: TDevice }) => {
    const isDarkMode = useDarkTheme()
    const devicesStore = useDevicesStore();
    const panels = usePanelsStore()

    const hasLocalFiles = !!device.files;
    const hasESPHomeConfig = !!device.esphome_config;
    const hasBoth = hasLocalFiles && hasESPHomeConfig;

    const allProps = {
        variant: "subtle" as IconButtonProps["variant"],
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
                ? <Tooltip label="Show local yaml configuration"><ActionIcon {...localProps} onClick={(e) => panels.addDevicePanel(e, device, "local_device")} ><CodeIcon /></ActionIcon></Tooltip>
                : <Tooltip label="Import yaml configuration"><ActionIcon {...localProps} onClick={(e) => devicesStore.localDevice_import(device)} ><DownloadIcon /></ActionIcon></Tooltip>
            }
            <ActionIcon.GroupSection {...allProps}> <Divider orientation="vertical" /></ActionIcon.GroupSection>
            <Tooltip label="Show local vs ESPHome diff"><ActionIcon {...diffProps} onClick={(e) => panels.addDevicePanel(e, device, "diff")} ><GitCompareIcon /></ActionIcon></Tooltip>
            <Tooltip label={uploadCreates ? "Create device in ESPHome" : "Upload local to ESPHome"}><ActionIcon {...uploadProps} onClick={() => devicesStore.espHome_upload(device)} ><UploadIcon /></ActionIcon></Tooltip>
            <ActionIcon.GroupSection {...allProps}> <Divider orientation="vertical" /></ActionIcon.GroupSection>
            <Tooltip label="Show ESPHome configuration"><ActionIcon  {...espHomeProps} onClick={(e) => panels.addDevicePanel(e, device, "esphome_device")} ><CodeIcon /></ActionIcon></Tooltip>
            <Tooltip label="Compile ESPHome configuration"><ActionIcon  {...espHomeProps} onClick={(e) => panels.addDevicePanel(e, device, "esphome_compile")} ><BeakerIcon /></ActionIcon></Tooltip>
            <Tooltip label="Install ESPHome configuration to device"><ActionIcon  {...espHomeProps} onClick={(e) => panels.addDevicePanel(e, device, "esphome_install")} ><UploadIcon /></ActionIcon></Tooltip>
            <Tooltip label="Show ESPHome device logs"><ActionIcon  {...espHomeProps} onClick={(e) => panels.addDevicePanel(e, device, "esphome_log")} ><LogIcon /></ActionIcon></Tooltip>
        </ActionIcon.Group>
    </div>;
};

export const DevicesTreeView = () => {
    const devicesStore = useDevicesStore();
    const exp = devicesStore.expanded;

    const pingQuery = useQuery({
        queryKey: ['ping'],
        refetchInterval: 1000,
        queryFn: api.getPing,
    });

    const getDeviceColor = (d: TDevice) =>
        d.esphome_config
            ? pingQuery?.data?.[d.esphome_config]
                ? color_online
                : color_offline
            : color_gray;

    return (
        <TreeView>
            <TreeView.Item
                key="add_device"
                id="add_device"
                onSelect={() => devicesStore.localDevice_create()}
            >
                <span className="font-semibold text-(color:--foreground)">New Device</span>
                <TreeView.LeadingVisual>
                    <PlusIcon />
                </TreeView.LeadingVisual>

            </TreeView.Item>
            {devicesStore.query.data?.map((d) => {
                const isLib = d.name == ".lib";

                return <TreeView.Item
                    key={d.id}
                    id={d.id}
                    expanded={exp.get(d.id)}
                    onExpandedChange={(e) => exp.set(d.id, e)}
                >
                    <span className="font-semibold text-(color:--foreground)">{d.name}</span>
                    <TreeView.LeadingVisual>
                        {(isLib)
                            ? <FileDirectoryIcon />
                            : <LightBulbIcon fill={getDeviceColor(d)} />
                        }
                    </TreeView.LeadingVisual>
                    <TreeView.SubTree>
                        {(!isLib) && <TreeView.Item className="opacity-30 hover:opacity-100" id={`toolbar_${d.id}`} ><DeviceToolbar device={d} /></TreeView.Item>}
                        <LocalFiles device={d} parent={d} />
                    </TreeView.SubTree>
                    <TreeView.TrailingVisual >
                        <Menu width={150}>
                            <Menu.Target>
                                <ActionIcon {...ThreeDotProps}>
                                    <KebabHorizontalIcon />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item leftSection={<FileCodeIcon />} onClick={(e) => { devicesStore.localDevice_addFile(d, "/"); e.stopPropagation(); }} >
                                    New File...
                                </Menu.Item>
                                <Menu.Item leftSection={<FileDirectoryIcon />} onClick={(e) => { devicesStore.localDevice_addDirectory(d, "/"); e.stopPropagation(); }} >
                                    New Folder...
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </TreeView.TrailingVisual>
                </TreeView.Item>;
            })
            }
        </TreeView>);
};