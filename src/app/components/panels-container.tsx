import { LocalFilePanel } from "./panels/local-file-panel";
import { LocalDevicePanel } from "./panels/local-device-panel";
import { ESPHomeDevicePanel } from "./panels/esphome-device-panel";
import { DiffPanel } from "./panels/diff-panel";
import { EspHomeLogPanel } from "./panels/esphome-log-panel";
import { EspHomeInstallPanel } from "./panels/esphome-install-panel";
import { EspHomeCompilePanel } from "./panels/esphome-compile-panel";
import { TPanel } from "../stores/panels-store/types";
import { usePanelsStore } from "../stores/panels-store";
import { DockviewDefaultTab, DockviewReact, IDockviewPanelHeaderProps, IDockviewPanelProps } from "dockview-react";

const components = {
    panel: (p: IDockviewPanelProps<TPanel>) => {
        const panel = p.params;
        switch (panel.operation) {
            case "esphome_device":
                return <ESPHomeDevicePanel device_id={panel.device_id} />;
            case "local_file":
                return <LocalFilePanel device_id={p.params.device_id} file_path={(p.params as any).path} />
            case "local_device":
                return <LocalDevicePanel device_id={panel.device_id} />;
            case "diff":
                return <DiffPanel device_id={panel.device_id} />;
            case "esphome_compile":
                return <EspHomeCompilePanel device_id={panel.device_id} />;
            case "esphome_install":
                return <EspHomeInstallPanel device_id={panel.device_id} />;
            case "esphome_log":
                return <EspHomeLogPanel device_id={panel.device_id} />;
            default:
                return <div>Noting selected</div>;
        }
    }
};

/*const tabComponents = {
    panel: (p: IDockviewPanelHeaderProps<TPanel>) => {
        return <DockviewDefaultTab {...p}  hideClose />;
    }
};*/

export const PanelsContainer = () => {
    const panelsStore = usePanelsStore();

    return <DockviewReact
        className='dockview-theme-light h-full'
        onReady={(e) => panelsStore.setApi(e.api)}
        components={components}
        //tabComponents={tabComponents}
    />
};