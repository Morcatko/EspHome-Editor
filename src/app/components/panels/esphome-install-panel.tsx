import { useEsphomeInstallStore } from "@/app/stores/panels-store/esphome-install-store";
import { LogStream } from "../editors/log-stream";
import { DeviceToolbarOperations, Toolbar } from "../toolbar";

type TProps = {
    device_id: string;
}
export const EspHomeInstallToolbar = ({ device_id }: TProps) => {
    return <Toolbar>
        <DeviceToolbarOperations
            device_id={device_id}
            current_tab="ESPHomeInstall"
            operations={[
                "ESPHomeInstall",
                "ESPHomeLog",
                "ESPHome"
            ]}
        />
    </Toolbar>;
}

export const EspHomeInstallPanel = ({ device_id }: TProps) => {
    const data = useEsphomeInstallStore(device_id);
    return <LogStream data={data} />;
}