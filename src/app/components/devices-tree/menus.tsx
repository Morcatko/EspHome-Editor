import { useDevicesStore } from "@/app/stores/devices-store";
import { TDevice, TLocalFileOrDirectory } from "@/server/devices/types";
import { ActionIcon, Menu } from "@mantine/core";
import { CircleSlashIcon, FileCodeIcon, FileDirectoryIcon, KebabHorizontalIcon, PencilIcon, XIcon } from "@primer/octicons-react";

export const ThreeDotsMenu = ({ items }: { items: React.ReactNode[] }) =>
    <Menu width={150} position="bottom-start">
        <Menu.Target>
            <ActionIcon
                className="opacity-30 hover:opacity-100"
                variant="transparent"
                color="gray"
                onClick={(e) => e.stopPropagation()}>
                <KebabHorizontalIcon />
            </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
            {items}
        </Menu.Dropdown>
    </Menu>;



const MenuItem = (p: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
}) =>
    <Menu.Item
        leftSection={p.icon}
        onClick={(e) => { e.stopPropagation(); p.onClick() }} >
        {p.label}
    </Menu.Item>;

export const deviceMenuItems = (ds: ReturnType<typeof useDevicesStore>, d: TDevice) => [
    <MenuItem key="nf" label="New File..." icon={<FileCodeIcon />} onClick={() => ds.localDevice_addFile(d, "/")} />,
    <MenuItem key="nd" label="New Folder..." icon={<FileDirectoryIcon />} onClick={() => ds.localDevice_addDirectory(d, "/")} />
]

export const fodMenuItems = (ds: ReturnType<typeof useDevicesStore>, d: TDevice, fod: TLocalFileOrDirectory) => [
    ...(fod.type === "directory"
        ? [
            <MenuItem key="nf" label="New File..." icon={<FileCodeIcon />} onClick={() => ds.localDevice_addFile(d, fod.path)} />,
            <MenuItem key="nd" label="New Folder..." icon={<FileDirectoryIcon />} onClick={() => ds.localDevice_addDirectory(d, fod.path)} />,
            <Menu.Divider key="did" />
        ]
        : []),
    ...(((fod.type === "file") && (!fod.path.includes("/")))
        ? [
            <MenuItem key="en" label="Enable/Disable..." icon={<CircleSlashIcon />} onClick={() => ds.local_enableDisableFile(d, fod)} />,
            <Menu.Divider key="dif" />
        ]
        : []),
    <MenuItem key="rn" label="Rename..." icon={<PencilIcon />} onClick={() => ds.local_renameFoD(d, fod)} />,
    <MenuItem key="dl" label="Delete..." icon={<XIcon />} onClick={() => ds.local_deleteFoD(d, fod)} />,
];