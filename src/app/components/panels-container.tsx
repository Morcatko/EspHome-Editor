import React from "react";
import { DockviewDefaultTab, DockviewReact, IDockviewHeaderActionsProps, IDockviewPanelHeaderProps, IDockviewPanelProps, themeDark, themeLight } from "dockview-react";
import { LocalFilePanel, LocalFileToolbar } from "./panels/local-file/local-file-panel";
import { LocalDevicePanel, LocalDeviceToolbar } from "./panels/local-device-panel";
import { ESPHomeDevicePanel, ESPHomeDeviceToolbar } from "./panels/esphome-device-panel";
import { DiffPanel, DiffToolbar } from "./panels/diff-panel";
import { EspHomeLogPanel, EspHomeLogToolbar } from "./panels/esphome-log-panel";
import { EspHomeInstallPanel, EspHomeInstallToolbar } from "./panels/esphome-install-panel";
import { EspHomeCompilePanel, EspHomeCompileToolbar } from "./panels/esphome-compile-panel";
import { TPanel_Device, TPanelWithClick } from "../stores/panels-store/types";
import { usePanelsStore } from "../stores/panels-store";
import { useDarkTheme, useDeviceColor } from "@/app/utils/hooks";
import { QuestionIcon } from "@primer/octicons-react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { Watermark } from "./watermark";
import { DevicesPanel } from "./panels/devices/devices-panel";

type TPanelProps = {
    toolbar: React.ReactNode;
    panel: React.ReactNode;
}
const Panel = (p: TPanelProps) => {
    return <div className="flex flex-col h-full">
        <div className="flex-none">{p.toolbar}</div>
        <div className="flex-grow h-full relative"> {/* relative is needed because of log streams */}
            {p.panel}
        </div>
    </div>;
}

const dockViewComponents = {
    default: (p: IDockviewPanelProps<TPanelWithClick>) => {
        const panel = p.params;
        switch (panel.operation) {
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
                    toolbar={<EspHomeCompileToolbar device_id={panel.device_id} lastClick={panel.last_click} />}
                    panel={<EspHomeCompilePanel device_id={panel.device_id} lastClick={panel.last_click} />}
                />;
            case "esphome_install":
                return <Panel
                    toolbar={<EspHomeInstallToolbar device_id={panel.device_id} lastClick={panel.last_click} />}
                    panel={<EspHomeInstallPanel device_id={panel.device_id} lastClick={panel.last_click} />} />;
            case "esphome_log":
                return <Panel
                    toolbar={<EspHomeLogToolbar device_id={panel.device_id} lastClick={panel.last_click} />}
                    panel={<EspHomeLogPanel device_id={panel.device_id} lastClick={panel.last_click} />} />;
            case "dashboard":
                return <Panel
                    toolbar={null}
                    panel={<DevicesPanel />}
                />;
            default:
                return <div>Noting selected</div>;
        }
    }
};

const ColoredDockviewTab = (p: IDockviewPanelHeaderProps<TPanelWithClick>) => {
    const device_id = (p.params as TPanel_Device).device_id;
    const color = useDeviceColor(device_id);

    return <span style={{ color: color }}><DockviewDefaultTab {...p} /></span>;
}

const dockViewTabComponents = {
    default: (p: IDockviewPanelHeaderProps<TPanelWithClick>) => {
        const panel = p.params;
        switch (panel.operation) {
            default:
                return <ColoredDockviewTab {...p} />;
        }
    }
};

const RightHeaderActions = (prop: IDockviewHeaderActionsProps) =>
    <Tooltip label="https://editor-4-esphome.github.io/" withinPortal={false} >
        <ActionIcon
            renderRoot={(p) => <a {...p} style={{ ...p.style, height: "100%" }} href="https://editor-4-esphome.github.io/" target="_blank" />}
            variant="subtle" >
            <QuestionIcon /></ActionIcon>
    </Tooltip>;


export const PanelsContainer = () => {
    const isDarkMode = useDarkTheme();
    const panelsStore = usePanelsStore();

    return <DockviewReact
        theme={isDarkMode ? themeDark : themeLight}
        className="h-full w-full"
        onReady={(e) => panelsStore.initApi(e.api)}
        components={dockViewComponents}
        watermarkComponent={Watermark}
        tabComponents={dockViewTabComponents}
        rightHeaderActionsComponent={RightHeaderActions}
    />;
};