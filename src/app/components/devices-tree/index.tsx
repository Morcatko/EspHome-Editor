"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FileDirectoryIcon, LightBulbIcon, PlusIcon, ChevronRightIcon } from "@primer/octicons-react";
import { Group, RenderTreeNodePayload, Tree, useTree } from "@mantine/core";
import { TDevice } from "@/server/devices/types";
import { color_gray, color_offline, color_online } from "../../utils/const";
import { api } from "../../utils/api-client";
import { useDevicesStore } from "../../stores/devices-store";
import { usePanelsStore } from "../../stores/panels-store";
import { DeviceToolbar } from "./device-toolbar";
import { ThreeDotsMenu, deviceMenuItems, fodMenuItems } from "./menus";
import { TreeNodeType, useTreeData } from "./utils";
import { FileIcon } from "@/app/utils/file-utils";

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
        onClick={p.onClick ? p.onClick : () => tree.toggleExpanded(node.value)}
    >
        {!p.hideExpander && <ChevronRightIcon
            className={`transition-transform ${hasChildren ? "visible" : "invisible"} ${expanded ? "rotate-90" : "rotate-0"}`}
            size={18} />
        }
        {p.icon}
        {p.children}
        <span className="grow" />
        {p.menuItems && <ThreeDotsMenu items={p.menuItems} />}
    </Group>;
}

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
                menuItems={fodMenuItems(devicesStore, node.device, node.fod)}>
                {node.label}
            </Node>;
        case "file":
            return <Node
                nodePayload={p}
                icon={<div className="opacity-55"><FileIcon fod={node.fod} /></div>}
                onClick={(e) => panels.addDevicePanel(((e as any).button === 1) ? "new_window" : "default", node.device.id, "local_file", node.fod)}
                menuItems={fodMenuItems(devicesStore, node.device, node.fod)}
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
    
    const tree = useTree({
        initialExpandedState: devicesStore.expanded.expanded,
        onNodeExpand: (node) => devicesStore.expanded.set(node, true),
        onNodeCollapse: (node) => devicesStore.expanded.set(node, false)
    });
    const treeData = useTreeData();

    return <Tree
        //Workaround for https://github.com/mantinedev/mantine/issues/7266
        tree={{ ...tree, setHoveredNode: () => { } }}
        data={treeData}
        renderNode={nodeRenderer}
        className="text-sm"
        classNames={{
            label: "dark:hover:bg-gray-800 hover:bg-gray-100 py-px",
        }}
    />
};