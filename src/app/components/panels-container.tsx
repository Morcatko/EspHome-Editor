import { LocalFilePanel } from "./panels/local-file-panel";
import { LocalDevicePanel } from "./panels/local-device-panel";
import { ESPHomeDevicePanel } from "./panels/esphome-device-panel";
import { DiffPanel } from "./panels/diff-panel";
import { EspHomeLogPanel } from "./panels/esphome-log-panel";
import { EspHomeInstallPanel } from "./panels/esphome-install-panel";
import { EspHomeCompilePanel } from "./panels/esphome-compile-panel";
import { TPanelWithClick } from "../stores/panels-store/types";
import { usePanelsStore } from "../stores/panels-store";
import { DockviewDefaultTab, DockviewReact, IDockviewPanelHeaderProps, IDockviewPanelProps } from "dockview-react";
import { useDarkTheme } from "@/app/utils/hooks";
import { Onboarding } from "./onboarding";

const components = {
    default: (p: IDockviewPanelProps<TPanelWithClick>) => {
        const panel = p.params;
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
            case "onboarding":
                return <Onboarding />;
            default:
                return <div>Noting selected</div>;
        }
    }
};

const tabComponents = {
    default: (p: IDockviewPanelHeaderProps<TPanelWithClick>) => {
        const panel = p.params;
        switch  (panel.operation) {
            case "onboarding":
                return <DockviewDefaultTab {...p}  hideClose />;
            default:
                return <DockviewDefaultTab {...p} />;
        }
    }
};

export const PanelsContainer = () => {
    const isDarkMode = useDarkTheme();
    const panelsStore = usePanelsStore();

    return <DockviewReact
            className={`absolute h-full w-full ${isDarkMode ? "dockview-theme-dark" : "dockview-theme-light"}`}
            onReady={(e) => panelsStore.setApi(e.api)}
            components={components}
            tabComponents={tabComponents}
        />;
};