import { useEspHomeCompileStore } from "@/app/stores/panels-store/esphome-compile-store";
import { LogStream } from "../editors/log-stream";
import { SyncIcon } from "@primer/octicons-react";
import { PanelMode } from "@/app/stores/panels-store";
import { DeviceToolbarItem } from "../devices-tree/device-toolbar";
import { useDevice } from "@/app/stores/devices-store";
import { Toolbar } from "../toolbar";

type TProps = {
    device_id: string;
}
export const EspHomeCompileToolbar = ({ device_id }: TProps) => {
    const device = useDevice(device_id)!;

    return <Toolbar>
        <DeviceToolbarItem.ESPHomeCompile device={device} icon={<SyncIcon />} tooltip="Refresh" />
        <DeviceToolbarItem.ESPHomeLog device={device} panelMode={PanelMode.Floating} />
    </Toolbar>;
}

export const EspHomeCompilePanel = ({ device_id }: TProps) => {
    const data = useEspHomeCompileStore(device_id);
    return <LogStream data={data} />;
}