import { LocalFilePanel } from "./panels/local-file-panel";
import { LocalDevicePanel } from "./panels/local-device-panel";
import { ESPHomeDevicePanel } from "./panels/esphome-device-panel";
import { DiffPanel } from "./panels/diff-panel";
import { EspHomeLogPanel } from "./panels/esphome-log-panel";
import { EspHomeInstallPanel } from "./panels/esphome-install-panel";
import { EspHomeCompilePanel } from "./panels/esphome-compile-panel";
import { TPanel } from "../stores/panels-store/types";
import { usePanelsStore } from "../stores/panels-store";
import { Layout, TabNode } from "flexlayout-react";
import { Onboarding } from "./onboarding";

const PanelContent = ({ panel }: { panel: TPanel }) => {
    switch (panel.operation) {
        case "esphome_device":
            return <ESPHomeDevicePanel device_id={panel.device_id} />;
        case "local_file":
            return <LocalFilePanel device_id={panel.device_id} file_path={panel.path} />;
        case "local_device":
            return <LocalDevicePanel device_id={panel.device_id} />;
        case "diff":
            return <DiffPanel device_id={panel.device_id} />;
        case "esphome_compile":
            return <EspHomeCompilePanel key={panel.last_click ?? "initial"} device_id={panel.device_id} />;
        case "esphome_install":
            return <EspHomeInstallPanel device_id={panel.device_id} />;
        case "esphome_log":
            return <EspHomeLogPanel device_id={panel.device_id} />;
        default:
            return <div>Noting selected</div>;
    }
};

const factory = (node: TabNode) => {
    var component = node.getComponent();
    switch (component) {
        case "panel":
            const panel: TPanel = node.getConfig();
            return <PanelContent panel={panel} />;
        case "onboarding":
            return <Onboarding />;
        default:
            return <div>Unknown panel</div>;
    }
}

export const PanelsContainer = () => {
    const panelsStore = usePanelsStore();

    return <Layout
            // classNameMapper={classNameMapper}
            model={panelsStore.flexLayoutModel}
            factory={factory}
        />
};