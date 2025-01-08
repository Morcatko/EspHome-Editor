import { TDevice, TLocalFileOrDirectory } from "@/server/devices/types";
import { TPanel } from "./panels-store/types";
import { Model, IJsonModel, Actions, DockLocation } from 'flexlayout-react';


const flexLayoutDefaultJson: IJsonModel = {
    global: {},
    borders: [],
    layout: {
        type: "row",
        weight: 100,
        children: [
            {
                id: "tabset_main",
                type: "tabset",
                enableDeleteWhenEmpty: false,
                children: []
            }
        ]
    }
};
const flexLayoutModel = Model.fromJson(flexLayoutDefaultJson);

function getPanelTitle(panel: TPanel) {
    switch (panel.operation) {
        case "local_file":
            return `${panel.device_id} -  ${panel.path}`;
        case "local_device":
            return `${panel.device_id} (Local)`;
        case "esphome_device":
            return `${panel.device_id}(ESPHome)`;
        case "diff":
            return `${panel.device_id} (Diff)`;
        case "esphome_compile":
            return `${panel.device_id} (Compile)`;
        case "esphome_install":
            return `${panel.device_id} (Install)`;
        case "esphome_log":
            return `${panel.device_id} (Log)`;
        default:
            return `Unknown`;
    }
}

export const usePanelsStore = () => {

    const addPanel = (
        id: string,
        title: string,
        component: string,
        params: any,
    ) => {
        const existingNode = flexLayoutModel.getNodeById(id);
        //const js = flexLayoutModel.toJson();
        //const ts = flexLayoutModel.getNodeById("tabset_main")

        //debugger;
        if (existingNode) {
            flexLayoutModel.doAction(Actions.selectTab(id));
            flexLayoutModel.doAction(Actions.updateNodeAttributes(id, { config: params}));
        }
        else {
            flexLayoutModel.doAction(Actions.addNode({
                id: id,
                type: "tab",
                name: title,
                component: component,
                config: params
            },"tabset_main", DockLocation.CENTER, -1, true));
        }
    }


    const addEditorPanel = (panel: TPanel) => 
        addPanel(
            `tab_${panel.operation}_${panel.device_id}_${(panel as any)?.path}`, 
            getPanelTitle(panel), 
            "panel", 
            { ...panel, last_click: new Date().toISOString() });

    const handleClick = (
        e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
        device: TDevice,
        operation: TPanel["operation"],
        file: TLocalFileOrDirectory | undefined = undefined) => {

        const panel: TPanel = (operation === "local_file")
            ? { device_id: device.id, operation, path: file!.path }
            : { device_id: device.id, operation };

        if ((e as any).button === 1) {// Middle click
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('panel', JSON.stringify(panel));
            window.open(currentUrl.toString(), '_blank')?.focus();
        }
        else {
            addEditorPanel(panel);
        }
    }

    return {
        flexLayoutModel: flexLayoutModel,
        addOnboarding: () => addPanel("onboarding", "Editor for ESPHome", "onboarding", {}),
        handleClick,
    };
}
