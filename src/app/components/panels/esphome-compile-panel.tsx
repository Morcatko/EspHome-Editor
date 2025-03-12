import { useEspHomeCompileStore } from "@/app/stores/panels-store/esphome-compile-store";
import { LogStream } from "../editors/log-stream";
import { DeviceToolbarOperations, Toolbar } from "../toolbar";

type TProps = {
    device_id: string;
}
export const EspHomeCompileToolbar = ({ device_id }: TProps) =>
    <Toolbar>
        <DeviceToolbarOperations
            device_id={device_id}
            panelTarget="floating"
            current_tab="ESPHomeCompile"
            operations={[
                "LocalShowOrImport",
                "Diff",
                "ESPHomeCreateOrUpload",
                "ESPHomeShow",
                "ESPHomeCompile",
                "ESPHomeInstall",
                "ESPHomeLog",
                "ESPHome"]}
        />
    </Toolbar>;

export const EspHomeCompilePanel = ({ device_id }: TProps) => {
    const data = useEspHomeCompileStore(device_id);
    return <LogStream data={data} />;
}