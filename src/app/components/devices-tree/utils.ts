import { useDevicesStore } from "@/app/stores/devices-store";
import { TDevice, TLocalDirectory, TLocalFile, TLocalFileOrDirectory } from "@/server/devices/types";
import { TreeNodeData } from "@mantine/core";

export type TreeNodeType = TreeNodeData & ({
    type: "add_new_device"
} | {
    type: "root_lib"
    device: TDevice;
} | {
    type: "device"
    device: TDevice;
} | {
    type: "device_toolbar"
    device: TDevice;
} | {
    type: "directory"
    device: TDevice;
    fod: TLocalDirectory
} | {
    type: "directory_empty"
} | {
    type: "file"
    device: TDevice;
    fod: TLocalFile;
});

const mapFiles = (parentId: string, device: TDevice, files: TLocalFileOrDirectory[] | null): TreeNodeType[] => {
    if (!files || files.length === 0)
        return [{
        type: "directory_empty",
        value: `${parentId}/__empty__`,
        label: "Empty",
    }];

    return files.map<TreeNodeType>((f) => {
        const id = `${parentId}/${f.id}`;
        const isDir = f.type === "directory";
        return <TreeNodeType>{
            type: isDir ? "directory" : "file",
            value: id,
            label: f.name,
            device: device,
            fod: isDir ? (f as TLocalDirectory) : (f as TLocalFile),
            children: isDir ? mapFiles(id, device, f.files) : []
        };
    });
}

export const useTreeData = () => {
    const devicesStore = useDevicesStore();
    if (!devicesStore.query.isSuccess)
        return [];

    return [{
            type: "add_new_device",
            value: "add_new_device",
            label: "New Device"
            },
            ...devicesStore
                .query
                .data
                .map<TreeNodeType>((d) => {
                    const isLib = d.name == ".lib";
                    const children: TreeNodeType[] = isLib 
                        ? []
                        : [{
                            type: "device_toolbar",
                            device: d,
                            value: `${d.id}/__toolbar__`,
                            label: "Toolbar"
                        }]
                    children.push(...mapFiles(d.id, d, d.files));

                    return {
                        value: d.id,
                        label: d.name,
                        type: isLib ? "root_lib" : "device",
                        device: d,
                        children
                    };
                })
        ];
}