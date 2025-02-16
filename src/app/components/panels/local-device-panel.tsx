import { SingleEditor } from "../editors/single-editor";
import { useLocalDeviceStore } from "@/app/stores/panels-store/local-device-store";

export const LocalDevicePanel = ({device_id} : {device_id: string}) => {
    const data = useLocalDeviceStore(device_id);

    return <SingleEditor {...data} />;
}