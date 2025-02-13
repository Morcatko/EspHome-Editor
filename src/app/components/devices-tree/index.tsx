"use client";
import { useQuery } from "@tanstack/react-query";
import Image from 'next/image';
import { TreeView } from "@primer/react";
import { TDevice, TLocalFileOrDirectory, TParent } from "@/server/devices/types";
import { FileDirectoryIcon, LightBulbIcon, PencilIcon, FileCodeIcon, QuestionIcon, XIcon, PlusIcon, ChevronRightIcon } from "@primer/octicons-react";
import { color_gray, color_offline, color_online } from "../../utils/const";
import etajsIcon from "@/assets/etajs-logo.svg";
import { api } from "../../utils/api-client";
import { useDevicesStore } from "../../stores/devices-store";
import { PanelMode, usePanelsStore } from "../../stores/panels-store";
import { Group, Menu, RenderTreeNodePayload, Tree, useTree } from "@mantine/core";
import { DeviceToolbar } from "./device-toolbar";
import { MenuItem, MenuTarget } from "./menus";
import { TreeNodeType, useTreeData } from "./utils";
import React from "react";

const FileTypeIcon = ({ fod }: { fod: TLocalFileOrDirectory | undefined }) => {
    if ((fod == null) || (fod.type === "directory"))
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
                ? (e) => panels.addDevicePanel(((e as any).button === 1) ? PanelMode.NewWindow : PanelMode.Default, device.id, "local_file", fod)
                : undefined} >
        <TreeView.LeadingVisual>
            <div style={{ opacity: "55%" }}>
                <FileTypeIcon fod={fod} />
            </div>
        </TreeView.LeadingVisual>
        <span className="text-(color:--foreground)">{fod.name}</span>
        <TreeView.TrailingVisual>
            <Menu width={150}>
                <MenuTarget />
                <Menu.Dropdown>
                    {(fod.type === "directory") && <>
                        <MenuItem label="New File..." icon={<FileCodeIcon />} onClick={() => devicesStore.localDevice_addFile(device, fod.path)} />
                        <MenuItem label="New Folder..." icon={<FileDirectoryIcon />} onClick={() => devicesStore.localDevice_addDirectory(device, fod.path)} />
                        <Menu.Divider />
                    </>
                    }
                    <MenuItem label="Rename..." icon={<PencilIcon />} onClick={() => devicesStore.local_renameFoD(device, fod)} />
                    <MenuItem label="Delete..." icon={<XIcon />} onClick={() => devicesStore.local_deleteFoD(device, fod)} />
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

type TNodeProps = {
    nodePayload: RenderTreeNodePayload;
    children: React.ReactNode;
    onClick?: React.MouseEventHandler;
}

const Node = (p: TNodeProps) => {
    const { hasChildren, expanded, elementProps, tree, node } = p.nodePayload;

    return <Group
        gap={5}
        {...elementProps}
        onClick={p.onClick ? p.onClick : (e) => tree.toggleExpanded(node.value)}
    >
        <ChevronRightIcon
            className={hasChildren ? "visible" : "invisible"}
            size={18}
            style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
        {p.children}
    </Group>;
}

const nodeRenderer = (p: RenderTreeNodePayload) => {
    const hasChildren = p.hasChildren;
    const expanded = p.expanded;
    const elementProps = p.elementProps;
    const node = p.node as TreeNodeType;
    const tree = p.tree;
    const panels = usePanelsStore();
    const devicesStore = useDevicesStore();
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

    switch (node.type) {
        case "add_new_device":
            return <Node nodePayload={p} onClick={() => devicesStore.localDevice_create()}>
                <PlusIcon />
                <span className="font-semibold text-(color:--foreground)">New Device</span>
            </Node>
        case "device":
            return <Node nodePayload={p}>
                <LightBulbIcon fill={getDeviceColor(node.device)} />
                {node.label}
            </Node>
        case "device_toolbar":
            return <Node nodePayload={p}>
                <DeviceToolbar device={node.device} />
            </Node>;
        case "root_lib":
            return <Node nodePayload={p}>
                <FileDirectoryIcon />
                {node.label}
            </Node>
        case "directory":
            return <Node nodePayload={p}>
                <FileTypeIcon fod={node.fod} />
                {node.label}
            </Node>
        case "file":
            return <Node nodePayload={p} onClick={(e) => panels.addDevicePanel(((e as any).button === 1) ? PanelMode.NewWindow : PanelMode.Default, node.device.id, "local_file", node.fod)}>
                <div style={{ opacity: "55%" }}>
                    <FileTypeIcon fod={node.fod} />
                </div>
                {node.label}
            </Node>;
        case "directory_empty":
            return null;
        default: return <Node nodePayload={p}>Unsupported node</Node>
    }
}

export const DevicesTree = () => {
    const devicesStore = useDevicesStore();
    const exp = devicesStore.expanded;

    const treeData = useTreeData();
    console.log(treeData);

    return <Tree
        data={treeData}
        renderNode={nodeRenderer}
    />

   /* return (
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
                        {(!isLib) && <TreeView.Item className="opacity-50 hover:opacity-100" id={`toolbar_${d.id}`} ><DeviceToolbar device={d} /></TreeView.Item>}
                        <LocalFiles device={d} parent={d} />
                    </TreeView.SubTree>
                    <TreeView.TrailingVisual >
                        <Menu width={150}>
                            <MenuTarget />
                            <Menu.Dropdown>
                                <MenuItem label="New File..." icon={<FileCodeIcon />} onClick={() => devicesStore.localDevice_addFile(d, "/")} />
                                <MenuItem label="New Folder..." icon={<FileDirectoryIcon />} onClick={() => devicesStore.localDevice_addDirectory(d, "/")} />
                            </Menu.Dropdown>
                        </Menu>
                    </TreeView.TrailingVisual>
                </TreeView.Item>;
            })
            }
        </TreeView>);*/
};