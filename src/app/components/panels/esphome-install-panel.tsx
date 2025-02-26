import { useEsphomeInstallStore } from "@/app/stores/panels-store/esphome-install-store";
import { LogStream } from "../editors/log-stream";
import { useDevice } from "@/app/stores/devices-store";
import { DeviceToolbarItem } from "../devices-tree/device-toolbar";
import { Toolbar } from "../toolbar";
import { SyncIcon } from "@primer/octicons-react";

type TProps = {
    device_id: string;
}
export const EspHomeInstallToolbar = ({ device_id }: TProps) => {
    const device = useDevice(device_id)!;

    const panelTarget ="floating";

    return <Toolbar>
        <DeviceToolbarItem.ESPHomeInstall device={device} icon={<SyncIcon />} tooltip="Refresh" />
        <DeviceToolbarItem.ESPHomeLog device={device} panelTarget={panelTarget} />
    </Toolbar>;
}

export const EspHomeInstallPanel = ({ device_id }: TProps) => {
    const data = useEsphomeInstallStore(device_id);
    return <LogStream data={data} />;
}