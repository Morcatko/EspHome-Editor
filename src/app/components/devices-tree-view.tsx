"use client";
import { observer } from "mobx-react-lite";
import Image from 'next/image';
import { ActionBar, ActionList, ActionMenu, IconButton, TreeView } from "@primer/react";
import { useStore } from "../stores";
import { TDevice, TLocalFileOrDirectory, TParent } from "@/server/devices/types";
import { BeakerIcon, CodeIcon, DownloadIcon, KebabHorizontalIcon, FileDirectoryIcon, GitCompareIcon, LightBulbIcon, LogIcon, PlusIcon, UploadIcon, PencilIcon, FileCodeIcon, QuestionIcon, XIcon } from "@primer/octicons-react";
import { color_esphome, color_local } from "../utils/const";
import etajsIcon from "../etajs-logo.svg";

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
    variant: "invisible",
    className: "opacity-30 hover:opacity-100",
    "aria-label": ""
}

const LocalFileOrDirectory = ({ device, fod }: { device: TDevice, fod: TLocalFileOrDirectory }) => {
    const store = useStore();
    const panels = store.panels;
    const devices = store.devices;
    const exp = devices.expanded;

    return <TreeView.Item
        key={fod.path}
        id={fod.id}
        expanded={exp.get(`${device.id}/${fod.path}`)}
        onExpandedChange={(e) => exp.set(`${device.id}/${fod.path}`, e)}
        onSelect={
            (fod.type === "file")
                ? () => panels.add_localFile(device, fod)
                : undefined} >
        <TreeView.LeadingVisual>
            <div style={{ opacity: "55%" }}>
                <FileTypeIcon fod={fod} />
            </div>
        </TreeView.LeadingVisual>
        <span>{fod.name}</span>
        <TreeView.TrailingVisual>
            <ActionMenu>
                <ActionMenu.Anchor>
                    <IconButton {...ThreeDotProps} icon={KebabHorizontalIcon} onClick={(e) => e.stopPropagation()} />
                </ActionMenu.Anchor>
                <ActionMenu.Overlay width="auto">
                    <ActionList>
                        {(fod.type === "directory") && <>
                            <ActionList.Item onSelect={(e) => { devices.localDevice_addFile(device, fod.path); e.stopPropagation(); }} >
                                <ActionList.LeadingVisual>
                                    <FileCodeIcon />
                                </ActionList.LeadingVisual>
                                New File...
                            </ActionList.Item>
                            <ActionList.Item onSelect={(e) => { devices.localDevice_addDirectory(device, fod.path); e.stopPropagation(); }}>
                                <ActionList.LeadingVisual>
                                    <FileDirectoryIcon />
                                </ActionList.LeadingVisual>
                                New Folder...
                            </ActionList.Item>
                            <ActionList.Divider />
                        </>
                        }
                        <ActionList.Item onSelect={(e) => { devices.local_renameFoD(device, fod); e.stopPropagation(); }}>
                            <ActionList.LeadingVisual>
                                <PencilIcon />
                            </ActionList.LeadingVisual>
                            Rename
                        </ActionList.Item>
                        <ActionList.Item onSelect={(e) => { devices.local_deleteFoD(device, fod); e.stopPropagation(); }} variant="danger">
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
    const store = useStore();
    const devices = store.devices;
    const panels = store.panels;

    const hasLocalFiles = !!device.files;
    const hasESPHomeConfig = !!device.esphome_config;
    const hasBoth = hasLocalFiles && hasESPHomeConfig;

    const bothProps = {
        disabled: !hasBoth,
        sx: { color: hasBoth ? undefined : "lightgrey" },
    }

    const espHomeProps = {
        disabled: !hasESPHomeConfig,
        sx: { color: hasESPHomeConfig ? color_esphome : "lightgrey" },
    };

    return <div style={{ marginLeft: '-16px' }}>
        <ActionBar aria-label="Device tools" size="small">
            {hasLocalFiles
                ? <ActionBar.IconButton sx={{ color: color_local }} icon={CodeIcon} onClick={() => panels.add_localDevice(device)} aria-label="Show local yaml configuration" />
                : <ActionBar.IconButton sx={{ color: color_local }} icon={DownloadIcon} onClick={() => devices.localDevice_import(device)} aria-label="Import yaml configuration" />
            }
            <ActionBar.Divider />
            <ActionBar.IconButton {...bothProps} icon={GitCompareIcon} onClick={() => panels.add_diff(device)} aria-label="Show local vs ESPHome diff" />
            <ActionBar.IconButton {...bothProps} icon={UploadIcon} onClick={() => devices.espHome_upload(device)} aria-label="Upload local to ESPHome" />
            <ActionBar.Divider />
            <ActionBar.IconButton {...espHomeProps} icon={CodeIcon} onClick={() => panels.add_espHomeDevice(device)} aria-label="Show ESPHome configuration" />
            <ActionBar.IconButton {...espHomeProps} icon={BeakerIcon} onClick={() => panels.add_espHomeCompile(device)} aria-label="Compile ESPHome configuration" />
            <ActionBar.IconButton {...espHomeProps} icon={UploadIcon} onClick={() => panels.add_espHomeInstall(device)} aria-label="Install ESPHome configuration to device" />
            <ActionBar.IconButton {...espHomeProps} icon={LogIcon} onClick={() => panels.add_espHomeLog(device)} aria-label="Show ESPHome device logs" />
        </ActionBar>
    </div>;
}

export const DevicesTreeView = observer(() => {
    const devices = useStore().devices;
    const exp = devices.expanded;

    return (
        <TreeView>
            {devices.devices.map((d) =>
                { 
                    const isLib = d.name == ".lib";
                
                    return <TreeView.Item
                        key={d.id}
                        id={d.id}
                        expanded={exp.get(d.id)}
                        onExpandedChange={(e) => exp.set(d.id, e)}
                    >
                        <span className="font-semibold">{d.name}</span>
                        <TreeView.LeadingVisual>
                            { (isLib)
                                ? <FileDirectoryIcon />
                                : <LightBulbIcon fill={d.esphome_config ? color_esphome : undefined} />
                            }
                        </TreeView.LeadingVisual>
                        <TreeView.SubTree>
                            { (!isLib) && <TreeView.Item className="opacity-30 hover:opacity-100" id={`toolbar_${d.id}`} ><DeviceToolbar device={d} /></TreeView.Item>}
                            <LocalFiles device={d} parent={d} />
                        </TreeView.SubTree>
                        <TreeView.TrailingVisual >
                            <ActionMenu>
                                <ActionMenu.Anchor>
                                    <IconButton {...ThreeDotProps} icon={KebabHorizontalIcon} onClick={(e) => e.stopPropagation()} />
                                </ActionMenu.Anchor>
                                <ActionMenu.Overlay width="auto" >
                                    <ActionList>
                                    <ActionList.Item onSelect={(e) => { devices.localDevice_addFile(d, "/"); e.stopPropagation(); }} >
                                            <ActionList.LeadingVisual>
                                                <FileCodeIcon />
                                            </ActionList.LeadingVisual>
                                            New File...
                                        </ActionList.Item>
                                        <ActionList.Item onSelect={(e) => { devices.localDevice_addDirectory(d, "/"); e.stopPropagation(); }}>
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
});