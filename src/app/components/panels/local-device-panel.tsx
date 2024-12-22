import { SingleEditor2 } from "./single-editor";
import { LocalDeviceStore, useLocalDeviceQuery } from "@/app/stores/panels-store/local-device-store";

export const LocalDevicePanel = ({store} : {store: LocalDeviceStore}) => {
    const data = useLocalDeviceQuery(store);

    return <SingleEditor2 {...data} />;
}