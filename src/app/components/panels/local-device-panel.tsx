import { SingleEditor } from "../editors/single-editor";
import { useLocalDeviceStore } from "@/app/stores/panels-store/local-device-store";

type TProps = {
    device_id: string;
}

export const LocalDevicePanel = ({device_id} : TProps) => {
    const data = useLocalDeviceStore(device_id);

    return <SingleEditor {...data} />;
}