import { useEspHomeCompileStore } from "@/app/stores/panels-store/esphome-compile-store";
import { LogStream } from "../editors/log-stream";
import { ActionIcon } from "@mantine/core";
import { SyncIcon } from "@primer/octicons-react";
import { PanelMode, usePanelsStore } from "@/app/stores/panels-store";
import { ToolbarButton } from "../toolbar";
import { DeviceToolbarButtons } from "../devices-tree/device-toolbar";

type TProps = {
    device_id: string;
}
export const EspHomeCompileToolbar = ({ device_id }: TProps) => {
    const panelsStore = usePanelsStore();
    
    return <ActionIcon.Group>
        <ToolbarButton tooltip="Refresh" onClick={(e) => panelsStore.addPanel(e, { operation: "esphome_compile", device_id })} icon={<SyncIcon />} />
        <DeviceToolbarButtons.ESPHomeLog onClick={(e) => panelsStore.addPanel(e, { operation: "esphome_log", device_id }, PanelMode.Floating)} />
    </ActionIcon.Group>;
}

export const EspHomeCompilePanel = ({ device_id }: TProps) => {
    const data = useEspHomeCompileStore(device_id);
    return <LogStream data={data} />;
}