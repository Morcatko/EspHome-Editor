import { useEspHomeLogStore } from "@/app/stores/panels-store/esphome-log-store";
import { LogStream } from "../editors/log-stream";
import { SyncIcon } from "@primer/octicons-react";
import { Toolbar } from "../toolbar";
import { DeviceToolbarItem } from "../devices-tree/device-toolbar";
import { useDevice } from "@/app/stores/devices-store";

type TProps = {
    device_id: string;
}
export const EspHomeLogToolbar = ({ device_id }: TProps) => {
    const device = useDevice(device_id)!;

    return <Toolbar>
        <DeviceToolbarItem.ESPHomeLog device={device} icon={<SyncIcon />} tooltip="Refresh" />
    </Toolbar>;
}

export const EspHomeLogPanel = ({ device_id }: TProps) => {
    const data = useEspHomeLogStore(device_id);
    return <LogStream data={data} />;
}