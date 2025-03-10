import { useDeviceDiffStoreQuery } from "@/app/stores/panels-store/device-diff-store";
import { DiffEditor } from "../editors/diff-editor";
import { DeviceToolbarOperations, Toolbar } from "../toolbar";

type TProps = {
    device_id: string;
}

export const DiffToolbar = ({ device_id }: TProps) =>
    <Toolbar>
        <DeviceToolbarOperations
            device_id={device_id}
            panelTarget="floating"
            operations={[
                "ESPHomeCreateOrUpload",
                "ESPHomeShow",
                "ESPHomeCompile",
                "ESPHomeInstall",
                "ESPHomeLog",
                "ESPHome"]}
        />
    </Toolbar>;

export const DiffPanel = ({ device_id }: TProps) => {
    const data = useDeviceDiffStoreQuery(device_id);

    return <DiffEditor {...data} />;
}