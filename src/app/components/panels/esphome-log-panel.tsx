import { useEspHomeLogStore } from "@/app/stores/panels-store/esphome-log-store";
import { LogStream } from "../editors/log-stream";
import { SyncIcon, XIcon } from "@primer/octicons-react";
import { Toolbar, ToolbarItem } from "../toolbar";
import { DeviceToolbarItem } from "../devices-tree/device-toolbar";
import { useDevice } from "@/app/stores/devices-store";

type TProps = {
    device_id: string;
}
export const EspHomeLogToolbar = ({ device_id }: TProps) => {
    const device = useDevice(device_id)!;
    const logStore = useEspHomeLogStore(device_id);
    return <Toolbar>
        <DeviceToolbarItem.ESPHomeLog device={device} icon={<SyncIcon />} tooltip="Refresh" />
        <ToolbarItem.Stretch />
        <ToolbarItem.Button tooltip="Clear" icon={<XIcon />} onClick={() => logStore.clear()} />
    </Toolbar>;
}

export const EspHomeLogPanel = ({ device_id }: TProps) => {
    const logStore = useEspHomeLogStore(device_id);
    return <LogStream data={logStore.data} />;
}