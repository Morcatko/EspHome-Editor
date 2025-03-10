import { useESPHomeDeviceStore } from "@/app/stores/panels-store/esphome-device-store";
import { SingleEditor } from "../editors/single-editor";
import { DeviceToolbarOperations, Toolbar } from "../toolbar";

type TProps = {
    device_id: string;
}

export const ESPHomeDeviceToolbar = ({ device_id }: TProps) =>
    <Toolbar>
        <DeviceToolbarOperations
            device_id={device_id}
            operations={[
                "ESPHomeUpload", 
                "ESPHomeShow", 
                "ESPHomeCompile", 
                "ESPHomeInstall", 
                "ESPHomeLog", 
                "ESPHome"]} />
    </Toolbar>;

export const ESPHomeDevicePanel = ({ device_id }: TProps) => {
    const data = useESPHomeDeviceStore(device_id);

    return <SingleEditor {...data} />;
}