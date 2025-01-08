import { useESPHomeDeviceStore } from "@/app/stores/panels-store/esphome-device-store";
import { SingleEditor } from "../editors/single-editor";

export const ESPHomeDevicePanel = ({device_id} : {device_id: string}) => {
    const data = useESPHomeDeviceStore(device_id);

    return <SingleEditor {...data} />;
}