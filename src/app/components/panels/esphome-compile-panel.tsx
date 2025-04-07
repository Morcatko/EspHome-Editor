import { useEspHomeCompileStore } from "@/app/stores/panels-store/esphome-compile-store";
import { LogStream } from "../editors/log-stream";
import { SyncIcon } from "@primer/octicons-react";
import { DeviceToolbarItem } from "../devices-tree/device-toolbar";
import { useDevice } from "@/app/stores/devices-store";
import { Toolbar, ToolbarItem } from "../toolbar";

type TProps = {
    device_id: string;
    lastClick: string;
}

export const EspHomeCompileToolbar = ({ device_id, lastClick }: TProps) => {
    const device = useDevice(device_id)!;
    const logStore = useEspHomeCompileStore(device_id, lastClick);
    const panelTarget ="floating";

    return <Toolbar>
        <DeviceToolbarItem.ESPHomeCompile device={device} icon={<SyncIcon />} tooltip="Refresh" />
        <DeviceToolbarItem.ESPHomeInstall device={device} panelTarget={panelTarget} />
        <DeviceToolbarItem.ESPHomeLog device={device} panelTarget={panelTarget} />
        <ToolbarItem.Stretch />
        <ToolbarItem.Filter logStore={logStore} />
    </Toolbar>;
}

export const EspHomeCompilePanel = ({ device_id, lastClick }: TProps) => {
    const logStore = useEspHomeCompileStore(device_id, lastClick);
    return <LogStream store={logStore} />;
}