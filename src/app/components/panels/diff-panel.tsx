import { useDeviceDiffStoreQuery } from "@/app/stores/panels-store/device-diff-store";
import { DiffEditor } from "../editors/diff-editor";

export const DiffPanel = ({device_id} : {device_id: string}) => {
    const data = useDeviceDiffStoreQuery(device_id);

    return <DiffEditor {...data} />;
}