import { ESPHomeDeviceStore, useESPHomeDeviceQuery } from "@/app/stores/panels-store/esphome-device-store";
import { SingleEditor2 } from "./single-editor";

export const ESPHomeDevicePanel = ({store} : {store: ESPHomeDeviceStore}) => {
    const data = useESPHomeDeviceQuery(store);

    return <SingleEditor2 {...data} />;
}