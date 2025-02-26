import { useESPHomeDeviceStore } from "@/app/stores/panels-store/esphome-device-store";
import { SingleEditor } from "../editors/single-editor";
import { useDevice } from "@/app/stores/devices-store";
import { Toolbar } from "../toolbar";
import { DeviceToolbarItem } from "../devices-tree/device-toolbar";

type TProps = {
    device_id: string;
}

export const ESPHomeDeviceToolbar = ({ device_id }: TProps) => {
    const device = useDevice(device_id)!;

    const panelTarget = "floating";

    return <Toolbar>
        <DeviceToolbarItem.ESPHomeShow device={device} panelTarget={panelTarget} />
        <DeviceToolbarItem.ESPHomeCompile device={device} panelTarget={panelTarget} />
        <DeviceToolbarItem.ESPHomeInstall device={device} panelTarget={panelTarget} />
        <DeviceToolbarItem.ESPHomeLog device={device} panelTarget={panelTarget} />
    </Toolbar>
}

export const ESPHomeDevicePanel = ({device_id} : TProps) => {
    const data = useESPHomeDeviceStore(device_id);

    return <SingleEditor {...data} />;
}