import { useDeviceDiffStoreQuery } from "@/app/stores/panels-store/device-diff-store";
import { DiffEditor } from "../editors/diff-editor";

type TProps = {
    device_id: string;
}

export const DiffPanel = ({device_id} : TProps) => {
    const data = useDeviceDiffStoreQuery(device_id);

    return <DiffEditor {...data} />;
}