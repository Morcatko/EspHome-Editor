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
    icon?: React.ReactNode;
    menuItems?: React.ReactNode[];
    hideExpander?: boolean;
}

const Node = (p: TNodeProps) => {
    const { hasChildren, expanded, elementProps, tree, node } = p.nodePayload;

    return <Group
        gap={5}
        {...elementProps}
        onClick={p.onClick ? p.onClick : (e) => tree.toggleExpanded(node.value)}
    >
        {!p.hideExpander && <ChevronRightIcon
            className={`${hasChildren ? "visible" : "invisible"} ${expanded ? "rotate-90" : "rotate-0"}`}
            size={18} />
        }
        {p.icon}
        {p.children}
        <span className="grow" />
        {p.menuItems &&
            <Menu width={150}>
                <MenuTarget />
                <Menu.Dropdown>
                    {p.menuItems}
                </Menu.Dropdown>
            </Menu>
        }
    </Group>;
}

const deviceMenuItems = (ds: ReturnType<typeof useDevicesStore>, d: TDevice) => [
    <MenuItem key="nf" label="New File..." icon={<FileCodeIcon />} onClick={() => ds.localDevice_addFile(d, "/")} />,
    <MenuItem key="nd" label="New Folder..." icon={<FileDirectoryIcon />} onClick={() => ds.localDevice_addDirectory(d, "/")} />
]

const fileMenuItems = (ds: ReturnType<typeof useDevicesStore>, d: TDevice, fod: TLocalFileOrDirectory) => [
    <MenuItem key="rn" label="Rename..." icon={<PencilIcon />} onClick={() => ds.local_renameFoD(d, fod)} />,
    <MenuItem key="dl" label="Delete..." icon={<XIcon />} onClick={() => ds.local_deleteFoD(d, fod)} />,
];

const directoryMenuItems = (ds: ReturnType<typeof useDevicesStore>, d: TDevice, fod: TLocalFileOrDirectory) => [
    <MenuItem key="nf" label="New File..." icon={<FileCodeIcon />} onClick={() => ds.localDevice_addFile(d, fod.path)} />,
    <MenuItem key="nd" label="New Folder..." icon={<FileDirectoryIcon />} onClick={() => ds.localDevice_addDirectory(d, fod.path)} />,
    <Menu.Divider key="di" />,
    ...fileMenuItems(ds, d, fod),
]

const nodeRenderer = (p: RenderTreeNodePayload) => {
    const node = p.node as TreeNodeType;
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
            return <Node
                icon={<PlusIcon />}
                nodePayload={p}
                onClick={() => devicesStore.localDevice_create()}>
                <span className="font-semibold text-(color:--foreground)">New Device</span>
            </Node>
        case "device":
            return <Node
                nodePayload={p}
                icon={<LightBulbIcon fill={getDeviceColor(node.device)} />}
                menuItems={deviceMenuItems(devicesStore, node.device)} >
                <span className="font-semibold">{node.label}</span>
            </Node>
        case "device_toolbar":
            return <Node nodePayload={p} hideExpander>
                <DeviceToolbar device={node.device} />
            </Node>;
        case "root_lib":
            return <Node
                nodePayload={p}
                icon={<FileDirectoryIcon />}
                menuItems={deviceMenuItems(devicesStore, node.device)} >
                <span className="font-semibold">{node.label}</span>
            </Node>
        case "directory": 
            return <Node
                nodePayload={p}
                icon={<FileDirectoryIcon />}
                menuItems={directoryMenuItems(devicesStore, node.device, node.fod)}>
                {node.label}
            </Node>;
        case "file":
            return <Node
                nodePayload={p}
                icon={<div className="opacity-55"><FileTypeIcon fod={node.fod} /></div>}
                onClick={(e) => panels.addDevicePanel(((e as any).button === 1) ? PanelMode.NewWindow : PanelMode.Default, node.device.id, "local_file", node.fod)}
                menuItems={fileMenuItems(devicesStore, node.device, node.fod)}
            >
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
    const tree = useTree({
        initialExpandedState: exp.expanded,
        onNodeExpand: (node) => exp.set(node, true),
        onNodeCollapse: (node) => exp.set(node, false)
    });
    const treeData = useTreeData();

    console.log("render");
    return <Tree
        //Workaround for https://github.com/mantinedev/mantine/issues/7266
        tree={{ ...tree, setHoveredNode: () => { } }}
        data={treeData}
        renderNode={nodeRenderer}
        className="text-sm"
        classNames={{
            label: "hover:bg-gray-100 py-px",
        }}
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
                                 </Menu.Dropdown>
                        </Menu>
                    </TreeView.TrailingVisual>
                </TreeView.Item>;
            })
            }
        </TreeView>);*/
};