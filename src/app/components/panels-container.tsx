import { LocalFilePanel } from "./panels/local-file-panel";
import { LocalDevicePanel } from "./panels/local-device-panel";
import { ESPHomeDevicePanel } from "./panels/esphome-device-panel";
import { DiffPanel } from "./panels/diff-panel";
import { EspHomeLogPanel } from "./panels/esphome-log-panel";
import { EspHomeInstallPanel } from "./panels/esphome-install-panel";
import { EspHomeCompilePanel } from "./panels/esphome-compile-panel";
import { TPanel } from "../stores/panels-store/types";
import { usePanelsStore } from "../stores/panels-store";
import { DockviewDefaultTab, DockviewReact, DockviewReadyEvent, IDockviewPanelProps } from "dockview-react";

const PanelHeader = ({ panel }: { panel: TPanel }) => {
    switch (panel.operation) {
        case "local_file":
            return <div>{panel.device_id} -  {panel.path}</div>;
        case "local_device":
            return <div>Local - {panel.device_id}</div>;
        case "esphome_device":
            return <div>ESPHome - {panel.device_id}</div>;
        case "diff":
            return <div>DIFF - {panel.device_id}</div>;
        case "esphome_compile":
            return <div>Compile - {panel.device_id}</div>;
        case "esphome_install":
            return <div>Install - {panel.device_id}</div>;
        case "esphome_log":
            return <div>Log - {panel.device_id}</div>;
    }
    return <div>Unknown</div>;
};

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


export const PanelsContainer = () => {
    const panelsStore = usePanelsStore();
    
    const onReady = (event: DockviewReadyEvent) => panelsStore.setApi(event.api);

    return <div style={{
        height: "100%",
    }}>
        <DockviewReact
            className='dockview-theme-light'
            onReady={onReady}
            components={components}
            //defaultTabComponent={(props) => <DockviewDefaultTab {...props} hideClose />}
        />
    </div>
};