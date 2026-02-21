import { useEsphomeInstallPanelStore } from "./esphome-install-panel-store";
import { LogStream } from "../../editors/log-stream";
import { useDevice } from "@/app/stores/devices-store";
import { DeviceToolbarItem } from "../../devices-tree/device-toolbar";
import { Toolbar, ToolbarItem } from "../../toolbar";
import { SyncIcon, XIcon } from "@primer/octicons-react";

type TProps = {
    device_id: string;
    lastClick: string;
}

export const EspHomeInstallToolbar = ({ device_id, lastClick }: TProps) => {
    const device = useDevice(device_id)!;
    const logStore = useEsphomeInstallPanelStore(device_id, lastClick);
    
    const panelTarget ="floating";

    return <Toolbar>
        <DeviceToolbarItem.ESPHomeInstall device={device} icon={<SyncIcon />} tooltip="Refresh" />
        <DeviceToolbarItem.ESPHomeLog device={device} panelTarget={panelTarget} />
        <ToolbarItem.Divider />
        <ToolbarItem.Button tooltip="Clear" icon={<XIcon />} onClick={() => logStore.clear()} />
        <ToolbarItem.Stretch />
        <ToolbarItem.Filter logStore={logStore} />
    </Toolbar>;
}

export const EspHomeInstallPanel = ({ device_id, lastClick }: TProps) => {
    const logStore = useEsphomeInstallPanelStore(device_id, lastClick);
    return <LogStream store={logStore} />;
}