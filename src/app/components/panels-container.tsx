import { LocalFilePanel, LocalFileToolbar } from "./panels/local-file-panel";
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

const OnClickRerender = ({ last_click, children }: { last_click?: string, children: React.ReactNode }) => {
    if (!last_click)
        return <div>Click again</div>;
    const currentTime = new Date();
    const lastClick = new Date(last_click);
    const diff = currentTime.getTime() - lastClick.getTime();

    if (diff < 1000)
        return children;

    return <div>Click again</div>;
}

type TPanelProps = {
    toolbar: React.ReactNode;
    panel: React.ReactNode;
}
const Panel = (p: TPanelProps) => {
    return <div className="flex flex-col h-full">
        <div className="flex-none">{p.toolbar}</div>
        <div className="flex-grow">{p.panel}</div>
    </div>;
}

const components = {
    default: (p: IDockviewPanelProps<TPanelWithClick>) => {
        const panel = p.params;
        switch (panel.operation) {
            case "esphome_device":
                return <ESPHomeDevicePanel device_id={panel.device_id} />;
            case "local_file":
                return <Panel
                    toolbar={<LocalFileToolbar device_id={panel.device_id} file_path={panel.path} />}
                    panel={<LocalFilePanel device_id={panel.device_id} file_path={panel.path} />}
                />;
            case "local_device":
                return <LocalDevicePanel device_id={panel.device_id} />;
            case "diff":
                return <DiffPanel device_id={panel.device_id} />;
            case "esphome_compile":
                return <OnClickRerender last_click={panel.last_click}><EspHomeCompilePanel device_id={panel.device_id} /></OnClickRerender>;
            case "esphome_install":
                return <OnClickRerender last_click={panel.last_click}><EspHomeInstallPanel device_id={panel.device_id} /></OnClickRerender>;
            case "esphome_log":
                return <EspHomeLogPanel device_id={panel.device_id} />;
            case "onboarding":
                return <Onboarding panel={panel} />;
            default:
                return <div>Noting selected</div>;
        }
    }
};

const tabComponents = {
    default: (p: IDockviewPanelHeaderProps<TPanelWithClick>) => {
        const panel = p.params;
        switch (panel.operation) {
            case "onboarding":
                return <DockviewDefaultTab {...p} hideClose />;
            default:
                return <DockviewDefaultTab {...p} onAuxClick={(e) => { if (e.button === 1) p.api.close(); }} />;
        }
    }
};

export const PanelsContainer = () => {
    const isDarkMode = useDarkTheme();
    const panelsStore = usePanelsStore();

    return <DockviewReact
        className={`absolute h-full w-full ${isDarkMode ? "dockview-theme-dark" : "dockview-theme-light"}`}
        onReady={(e) => panelsStore.initApi(e.api)}
        components={components}
        tabComponents={tabComponents}
    />;
};