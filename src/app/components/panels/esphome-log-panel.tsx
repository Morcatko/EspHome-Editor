import { useEspHomeLogStore } from "@/app/stores/panels-store/esphome-log-store";
import { LogStream } from "../editors/log-stream";
import { DeviceToolbarOperations, Toolbar } from "../toolbar";

type TProps = {
    device_id: string;
}
export const EspHomeLogToolbar = ({ device_id }: TProps) => {
    return <Toolbar>
        <DeviceToolbarOperations
            device_id={device_id}
            current_tab="ESPHomeLog"
            operations={[
                "ESPHomeLog",
                "ESPHome"
            ]}
        />
    </Toolbar>;
}

export const EspHomeLogPanel = ({ device_id }: TProps) => {
    const data = useEspHomeLogStore(device_id);
    return <LogStream data={data} />;
}