import { useDevice } from "@/app/stores/devices-store";
import { SingleEditor } from "../editors/single-editor";
import { useLocalDeviceStore } from "@/app/stores/panels-store/local-device-store";
import { Toolbar } from "../toolbar";
import { DeviceToolbarItem } from "../devices-tree/device-toolbar";

type TProps = {
    device_id: string;
}

export const LocalDeviceToolbar = (props: TProps) => {
    const device = useDevice(props.device_id)!;

    const panelTarget = "floating";
    
    return <Toolbar>
        <DeviceToolbarItem.Diff device={device} panelTarget={panelTarget} />
        <DeviceToolbarItem.ESPHomeUpload device={device} panelTarget={panelTarget} />
        <DeviceToolbarItem.ESPHomeShow device={device} panelTarget={panelTarget} />
        <DeviceToolbarItem.ESPHomeCompile device={device} panelTarget={panelTarget} />
        <DeviceToolbarItem.ESPHomeInstall device={device} panelTarget={panelTarget} />
        <DeviceToolbarItem.ESPHomeLog device={device} panelTarget={panelTarget} />
    </Toolbar>;
}

export const LocalDevicePanel = ({device_id} : TProps) => {
    const data = useLocalDeviceStore(device_id);

    return <SingleEditor {...data} device_id={device_id} />;
}