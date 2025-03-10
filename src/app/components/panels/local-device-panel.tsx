import { SingleEditor } from "../editors/single-editor";
import { useLocalDeviceStore } from "@/app/stores/panels-store/local-device-store";
import { DeviceToolbarOperations, Toolbar } from "../toolbar";

type TProps = {
    device_id: string;
}

export const LocalDeviceToolbar = (props: TProps) =>
    <Toolbar>
        <DeviceToolbarOperations
            device_id={props.device_id}
            operations={[
                "Diff",
                "ESPHomeUpload",
                "ESPHomeShow",
                "ESPHomeCompile",
                "ESPHomeInstall",
                "ESPHomeLog",
                "ESPHome"
            ]}
        />
    </Toolbar>;

export const LocalDevicePanel = ({device_id} : TProps) => {
    const data = useLocalDeviceStore(device_id);

    return <SingleEditor {...data} />;
}