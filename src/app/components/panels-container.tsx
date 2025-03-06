import { LocalFilePanel, LocalFileToolbar } from "./panels/local-file-panel";
import { LocalDevicePanel, LocalDeviceToolbar } from "./panels/local-device-panel";
import { ESPHomeDevicePanel, ESPHomeDeviceToolbar } from "./panels/esphome-device-panel";
import { DiffPanel, DiffToolbar } from "./panels/diff-panel";
import { EspHomeLogPanel, EspHomeLogToolbar } from "./panels/esphome-log-panel";
import { EspHomeInstallPanel, EspHomeInstallToolbar } from "./panels/esphome-install-panel";
import { EspHomeCompilePanel, EspHomeCompileToolbar } from "./panels/esphome-compile-panel";
import { DevicesPanel } from "./panels/devices-panel";
import { TPanelWithClick } from "../stores/panels-store/types";
import { usePanelsStore } from "../stores/panels-store";
import { DockviewDefaultTab, DockviewReact, IDockviewPanelHeaderProps, IDockviewPanelProps } from "dockview-react";
import { useDarkTheme } from "@/app/utils/hooks";
import { Onboarding } from "./onboarding";
import React from "react";

const OnClickRerender = ({ last_click, children }: { last_click?: string, children: React.ReactNode }) => {
    if (!last_click)
        return <div>Click again</div>;
    const currentTime = new Date();
    const lastClick = new Date(last_click);
    const diff = currentTime.getTime() - lastClick.getTime();

    if (diff < 1000)
        return <React.Fragment key={last_click}>{children}</React.Fragment>;

    return <div>Click Refresh</div>;
}

type TPanelProps = {
    toolbar: React.ReactNode;
    panel: React.ReactNode;
    last_click?: string;
}
const Panel = (p: TPanelProps) => {
    return <div className="flex flex-col h-full">
        <div className="flex-none">{p.toolbar}</div>
        <div className="flex-grow h-full">
            {p.last_click
                ? <OnClickRerender last_click={p.last_click}>{p.panel}</OnClickRerender>
                : p.panel
            }
        </div>
    </div>;
}

const dockViewComponents = {
    default: (p: IDockviewPanelProps<TPanelWithClick>) => {
        const panel = p.params;
        switch (panel.operation) {
            case "devices_tree":
                return <DevicesPanel />;
            case "esphome_device":
                return <Panel
                    toolbar={<ESPHomeDeviceToolbar device_id={panel.device_id} />}
                    panel={<ESPHomeDevicePanel device_id={panel.device_id} />}
                />;
            case "local_file":
                return <Panel
                    toolbar={<LocalFileToolbar device_id={panel.device_id} file_path={panel.path} />}
                    panel={<LocalFilePanel device_id={panel.device_id} file_path={panel.path} />}
                />;
            case "local_device":
                return <Panel
                    toolbar={<LocalDeviceToolbar device_id={panel.device_id} />}
                    panel={<LocalDevicePanel device_id={panel.device_id} />}
                />;
            case "diff":
                return <Panel
                    toolbar={<DiffToolbar device_id={panel.device_id} />}
                    panel={<DiffPanel device_id={panel.device_id} />}
                />;
            case "esphome_compile":
                return <Panel
                    last_click={panel.last_click}
                    toolbar={<EspHomeCompileToolbar device_id={panel.device_id} />}
                    panel={<EspHomeCompilePanel device_id={panel.device_id} />}
                />;
            case "esphome_install":
                return <Panel
                    last_click={panel.last_click}
                    toolbar={<EspHomeInstallToolbar device_id={panel.device_id} />}
                    panel={<EspHomeInstallPanel device_id={panel.device_id} />} />;
            case "esphome_log":
                return <Panel
                    last_click={panel.last_click}
                    toolbar={<EspHomeLogToolbar device_id={panel.device_id} />}
                    panel={<EspHomeLogPanel device_id={panel.device_id} />} />;
            case "onboarding":
                return <Onboarding panel={panel} />;
            default:
                return <div>Noting selected</div>;
        }
    }
};

const dockViewTabComponents = {
    default: (p: IDockviewPanelHeaderProps<TPanelWithClick>) => {
        const panel = p.params;
        switch (panel.operation) {
            case "onboarding":
                return <DockviewDefaultTab {...p} hideClose />;
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
        onReady={(e) => panelsStore.initApi(e.api)}
        components={dockViewComponents}
        tabComponents={dockViewTabComponents}
    />;
};