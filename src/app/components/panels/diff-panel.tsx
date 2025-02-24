import { useDeviceDiffStoreQuery } from "@/app/stores/panels-store/device-diff-store";
import { DiffEditor } from "../editors/diff-editor";
import { useDevice } from "@/app/stores/devices-store";
import { Toolbar } from "../toolbar";
import { DeviceToolbarItem } from "../devices-tree/device-toolbar";

type TProps = {
    device_id: string;
}


export const DiffToolbar = ({ device_id }: TProps) => {
    const device = useDevice(device_id)!;

    const panelMode = "bottom";

    return <Toolbar>
        <DeviceToolbarItem.ESPHomeUpload device={device} panelMode={panelMode} />
        <DeviceToolbarItem.ESPHomeCompile device={device} panelMode={panelMode} />
        <DeviceToolbarItem.ESPHomeLog device={device} panelMode={panelMode} />
    </Toolbar>
}

export const DiffPanel = ({ device_id }: TProps) => {
    const data = useDeviceDiffStoreQuery(device_id);

    return <DiffEditor {...data} />;
}