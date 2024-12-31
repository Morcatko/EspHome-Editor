import { observer } from "mobx-react-lite";
import { useStore } from "../stores";
import { LocalFilePanel } from "./panels/local-file-panel";
import { LocalDevicePanel } from "./panels/local-device-panel";
import { ESPHomeDevicePanel } from "./panels/esphome-device-panel";
import { DiffPanel } from "./panels/diff-panel";
import { EspHomeLogPanel } from "./panels/esphome-log-panel";
import { EspHomeInstallPanel } from "./panels/esphome-install-panel";
import { EspHomeCompilePanel } from "./panels/esphome-compile-panel";
import { TPanel } from "../stores/panels-store/types";

const PanelContent = ({ panel }: { panel: TPanel }) => {
    switch (panel.operation) {
        case "esphome_device":
            return <ESPHomeDevicePanel device_id={panel.device_id} />;
        case "file":
            return <LocalFilePanel device_id={panel.device_id} file={panel.path} />;
        case "local_device":
            return <LocalDevicePanel device_id={panel.device_id} />;
        case "diff":
            return <DiffPanel device_id={panel.device_id} />;
        case "compile":
            return <EspHomeCompilePanel device_id={panel.device_id} />;
        case "install":
            return <EspHomeInstallPanel device_id={panel.device_id} />;
        case "log":
            return <EspHomeLogPanel device_id={panel.device_id} />;
        default:
            return <div>Noting selected</div>;
    }
};

export const PanelsContainer = observer(() => {
    const store = useStore();

    const tabStore = store.panels.tab;

    if (!tabStore) {
        return null;
    }

    return <div style={{
        height: "100%",
        display: "grid",
        gridTemplateRows: "auto 1fr",
    }}>
        <div>
            <span>{tabStore.device_id} - </span>
            <span>{tabStore.operation}</span>
        </div>
        <PanelContent panel={tabStore} />
    </div>

});