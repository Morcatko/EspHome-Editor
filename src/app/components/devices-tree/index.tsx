"use client";
import { useQuery } from "@tanstack/react-query";
import Image from 'next/image';
import { TreeView } from "@primer/react";
import { TDevice, TLocalFileOrDirectory, TParent } from "@/server/devices/types";
import { FileDirectoryIcon, LightBulbIcon, FileCodeIcon, QuestionIcon, PlusIcon } from "@primer/octicons-react";
import { color_gray, color_offline, color_online } from "../../utils/const";
import etajsIcon from "@/assets/etajs-logo.svg";
import { api } from "../../utils/api-client";
import { useDevicesStore } from "../../stores/devices-store";
import { PanelMode, usePanelsStore } from "../../stores/panels-store";
import { DeviceToolbar } from "./device-toolbar";
import { ThreeDotsMenu, deviceMenuItems, fodMenuItems } from "./menus";

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
            <ThreeDotsMenu items={fodMenuItems(devicesStore, device, fod)} />
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

export const DevicesTree = () => {
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
                        {(!isLib) && <TreeView.Item className="opacity-50 hover:opacity-100" id={`toolbar_${d.id}`} ><DeviceToolbar device={d} /></TreeView.Item>}
                        <LocalFiles device={d} parent={d} />
                    </TreeView.SubTree>
                    <TreeView.TrailingVisual>
                        <ThreeDotsMenu items={deviceMenuItems(devicesStore, d)} />
                    </TreeView.TrailingVisual>
                </TreeView.Item>;
            })
            }
        </TreeView>);
};