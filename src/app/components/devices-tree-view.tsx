"use client";
import { useQuery } from "@tanstack/react-query";
import Image from 'next/image';
import { ActionBar, ActionList, ActionMenu, ButtonBaseProps, IconButton, IconButtonProps, TreeView } from "@primer/react";
import { TDevice, TLocalFileOrDirectory, TParent } from "@/server/devices/types";
import { BeakerIcon, CodeIcon, DownloadIcon, KebabHorizontalIcon, FileDirectoryIcon, GitCompareIcon, LightBulbIcon, LogIcon, UploadIcon, PencilIcon, FileCodeIcon, QuestionIcon, XIcon } from "@primer/octicons-react";
import { color_esphome, color_gray, color_local, color_offline, color_online } from "../utils/const";
import etajsIcon from "../etajs-logo.svg";
import { api } from "../utils/api-client";
import { useDevicesStore } from "../stores/devices-store";
import { usePanelsStore } from "../stores/panels-store";
import { useDarkTheme } from "../utils/hooks";

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

const ThreeDotProps = {
    variant: ("invisible" as ButtonBaseProps["variant"]),
    className: "opacity-30 hover:opacity-100",
    "aria-label": ""
}

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
                ? (e) => panels.handleClick(e, device, "local_file", fod)
                : undefined} >
        <TreeView.LeadingVisual>
            <div style={{ opacity: "55%" }}>
                <FileTypeIcon fod={fod} />
            </div>
        </TreeView.LeadingVisual>
        <span className="text-[color:--foreground]">{fod.name}</span>
        <TreeView.TrailingVisual>
            <ActionMenu>
                <ActionMenu.Anchor>
                    <IconButton {...ThreeDotProps} icon={KebabHorizontalIcon} onClick={(e) => e.stopPropagation()} />
                </ActionMenu.Anchor>
                <ActionMenu.Overlay width="auto">
                    <ActionList>
                        {(fod.type === "directory") && <>
                            <ActionList.Item onSelect={(e) => { devicesStore.localDevice_addFile(device, fod.path); e.stopPropagation(); }} >
                                <ActionList.LeadingVisual>
                                    <FileCodeIcon />
                                </ActionList.LeadingVisual>
                                New File...
                            </ActionList.Item>
                            <ActionList.Item onSelect={(e) => { devicesStore.localDevice_addDirectory(device, fod.path); e.stopPropagation(); }}>
                                <ActionList.LeadingVisual>
                                    <FileDirectoryIcon />
                                </ActionList.LeadingVisual>
                                New Folder...
                            </ActionList.Item>
                            <ActionList.Divider />
                        </>
                        }
                        <ActionList.Item onSelect={(e) => { devicesStore.local_renameFoD(device, fod); e.stopPropagation(); }}>
                            <ActionList.LeadingVisual>
                                <PencilIcon />
                            </ActionList.LeadingVisual>
                            Rename
                        </ActionList.Item>
                        <ActionList.Item onSelect={(e) => { devicesStore.local_deleteFoD(device, fod); e.stopPropagation(); }} variant="danger">
                            <ActionList.LeadingVisual>
                                <XIcon />
                            </ActionList.LeadingVisual>
                            Delete
                        </ActionList.Item>
                    </ActionList>
                </ActionMenu.Overlay>
            </ActionMenu>
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
        tooltipDirection: "n" as (IconButtonProps["tooltipDirection"]),
    }

    const localProps = { ...allProps };
    const bothProps = {
        ...allProps,
        disabled: !hasBoth,
        sx: {
            color: (hasBoth)
                ? (isDarkMode ? "lightgrey" : color_gray)
                : (isDarkMode ? color_gray : "lightgrey")
        },
    }

    const espHomeProps = {
        ...allProps,
        disabled: !hasESPHomeConfig,
        sx: { color: hasESPHomeConfig ? color_esphome : "lightgrey" },
    };

    return <div style={{ marginLeft: '-16px' }}>
        <ActionBar aria-label="Device tools" size="small">
            {hasLocalFiles
                ? <ActionBar.IconButton key="show_local" {...localProps} sx={{ color: color_local }} icon={CodeIcon} onClick={(e) => panels.handleClick(e, device, "local_device")} aria-label="Show local yaml configuration" />
                : <ActionBar.IconButton key="create_local"  {...localProps} sx={{ color: color_local }} icon={DownloadIcon} onClick={() => devicesStore.localDevice_import(device)} aria-label="Import yaml configuration" />
            }
            <ActionBar.Divider key="div1" />
            <ActionBar.IconButton key="diff" {...bothProps} icon={GitCompareIcon} onClick={(e) => panels.handleClick(e, device, "diff")} aria-label="Show local vs ESPHome diff" />
            <ActionBar.IconButton key="upload" {...bothProps} icon={UploadIcon} onClick={() => devicesStore.espHome_upload(device)} aria-label="Upload local to ESPHome" />
            <ActionBar.Divider key="div2" />
            <ActionBar.IconButton key="show_esphome" {...espHomeProps} icon={CodeIcon} onClick={(e) => panels.handleClick(e, device, "esphome_device")} aria-label="Show ESPHome configuration" />
            <ActionBar.IconButton key="compile" {...espHomeProps} icon={BeakerIcon} onClick={(e) => panels.handleClick(e, device, "esphome_compile")} aria-label="Compile ESPHome configuration" />
            <ActionBar.IconButton key="install" {...espHomeProps} icon={UploadIcon} onClick={(e) => panels.handleClick(e, device, "esphome_install")} aria-label="Install ESPHome configuration to device" />
            <ActionBar.IconButton key="log" {...espHomeProps} icon={LogIcon} onClick={(e) => panels.handleClick(e, device, "esphome_log")} aria-label="Show ESPHome device logs" />
        </ActionBar>
    </div>;
}

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
            {devicesStore.query.data?.map((d) => {
                const isLib = d.name == ".lib";

                return <TreeView.Item
                    key={d.id}
                    id={d.id}
                    expanded={exp.get(d.id)}
                    onExpandedChange={(e) => exp.set(d.id, e)}
                >
                    <span className="font-semibold text-[color:--foreground]">{d.name}</span>
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
                        <ActionMenu>
                            <ActionMenu.Anchor>
                                <IconButton {...ThreeDotProps} icon={KebabHorizontalIcon} onClick={(e) => e.stopPropagation()} />
                            </ActionMenu.Anchor>
                            <ActionMenu.Overlay width="auto" >
                                <ActionList>
                                    <ActionList.Item onSelect={(e) => { devicesStore.localDevice_addFile(d, "/"); e.stopPropagation(); }} >
                                        <ActionList.LeadingVisual>
                                            <FileCodeIcon />
                                        </ActionList.LeadingVisual>
                                        New File...
                                    </ActionList.Item>
                                    <ActionList.Item onSelect={(e) => { devicesStore.localDevice_addDirectory(d, "/"); e.stopPropagation(); }}>
                                        <ActionList.LeadingVisual>
                                            <FileDirectoryIcon />
                                        </ActionList.LeadingVisual>
                                        New Folder...
                                    </ActionList.Item>
                                </ActionList>
                            </ActionMenu.Overlay>
                        </ActionMenu>
                    </TreeView.TrailingVisual>
                </TreeView.Item>;
            })
            }
        </TreeView>);
};