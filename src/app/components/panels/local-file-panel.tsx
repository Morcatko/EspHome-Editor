import { useLocalFileStore } from "@/app/stores/panels-store/local-file-store";
import { SplitEditor } from "../editors/split-editor";

export const LocalFilePanel = ({ device_id, file_path }: { device_id: string, file_path: string }) => {
    const data = useLocalFileStore(device_id, file_path);

    return <SplitEditor
        leftEditor={data.leftEditor} 
        rightEditor={data.rightEditor} />;
};