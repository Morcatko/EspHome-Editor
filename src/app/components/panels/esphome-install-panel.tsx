import { useEsphomeInstallStore } from "@/app/stores/panels-store/esphome-install-store";
import { LogStream } from "../editors/log-stream";
import { useDevice } from "@/app/stores/devices-store";
import { DeviceToolbarItem } from "../devices-tree/device-toolbar";
import { Toolbar, ToolbarItem } from "../toolbar";
import { SyncIcon, XIcon } from "@primer/octicons-react";

type TProps = {
    device_id: string;
}
export const EspHomeInstallToolbar = ({ device_id }: TProps) => {
    const device = useDevice(device_id)!;
    const logStore = useEsphomeInstallStore(device_id);
    
    const panelTarget ="floating";

    return <Toolbar>
        <DeviceToolbarItem.ESPHomeInstall device={device} icon={<SyncIcon />} tooltip="Refresh" />
        <DeviceToolbarItem.ESPHomeLog device={device} panelTarget={panelTarget} />
        <ToolbarItem.Stretch />
        <ToolbarItem.Button tooltip="Clear" icon={<XIcon />} onClick={() => logStore.clear()} />
    </Toolbar>;
}

export const EspHomeInstallPanel = ({ device_id }: TProps) => {
    const logStore = useEsphomeInstallStore(device_id);
    return <LogStream data={logStore.data} />;
}