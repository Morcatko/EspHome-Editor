import { useEspHomeLogStore } from "@/app/stores/panels-store/esphome-log-store";
import { LogStream } from "../editors/log-stream";
import { SearchIcon, SyncIcon, XIcon } from "@primer/octicons-react";
import { Toolbar, ToolbarItem } from "../toolbar";
import { DeviceToolbarItem } from "../devices-tree/device-toolbar";
import { useDevice } from "@/app/stores/devices-store";
import { ActionIcon, TextInput } from "@mantine/core";

type TProps = {
    device_id: string;
    lastClick: string;
}

export const EspHomeLogToolbar = ({ device_id, lastClick }: TProps) => {
    const device = useDevice(device_id)!;
    const logStore = useEspHomeLogStore(device_id, lastClick);
    return <Toolbar>
        <DeviceToolbarItem.ESPHomeLog device={device} icon={<SyncIcon />} tooltip="Refresh" />
        <ToolbarItem.Divider />
        <ToolbarItem.Button tooltip="Clear" icon={<XIcon />} onClick={() => logStore.clear()} />
        <ToolbarItem.Stretch />
        <ToolbarItem.Filter logStore={logStore} />
    </Toolbar>;
}

export const EspHomeLogPanel = ({ device_id, lastClick }: TProps) => {
    const logStore = useEspHomeLogStore(device_id, lastClick);
    return <LogStream store={logStore} />;
}