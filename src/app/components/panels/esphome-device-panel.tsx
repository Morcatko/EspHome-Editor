import { useESPHomeDeviceStore } from "@/app/stores/panels-store/esphome-device-store";
import { SingleEditor } from "../editors/single-editor";

type TProps = {
    device_id: string;
}

export const ESPHomeDevicePanel = ({device_id} : TProps) => {
    const data = useESPHomeDeviceStore(device_id);

    return <SingleEditor {...data} />;
}