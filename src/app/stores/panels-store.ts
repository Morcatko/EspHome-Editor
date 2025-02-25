import { atom, useAtom } from "jotai";
import { TLocalFileOrDirectory } from "@/server/devices/types";
import { TPanel, TPanelWithClick } from "./panels-store/types";
import { AddPanelOptions, DockviewApi } from 'dockview-react';

const dockViewApiAtom = atom<DockviewApi | null>(null);

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
        case "onboarding":
            return "Welcome";
        default:
            return `Unknown`;
    }
}

function getPanelId(panel: TPanel) {
    switch (panel.operation) {
        case "onboarding":
            return "onboarding";
        default:
            return JSON.stringify(panel, Object.keys(panel).sort());
    }
}

export type PanelTarget = "default" | "new_window" | "bottom"

export const usePanelsStore = () => {
    let [api, setApi] = useAtom(dockViewApiAtom);

    const addPanel = async (
        panel: TPanel,
        target: PanelTarget = "default") => {
        if (target === "new_window") {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('panel', JSON.stringify(panel));
            window.open(currentUrl.toString(), '_blank')?.focus();
        }

        if (!api) return;

        //generate ID from some hash
        const id = getPanelId(panel);
        const params: TPanelWithClick = { ...panel, last_click: new Date().toISOString() };
        const existingPanel = api?.panels.find(p => p.id === id)

        if (existingPanel) {
            existingPanel.api.updateParameters(params)
            existingPanel.focus();
        }
        else {
            const dockViewPanel = api.addPanel<TPanelWithClick>({
                id: getPanelId(panel),
                title: getPanelTitle(panel),
                component: "default",
                tabComponent: "default",
                params: params,
            });

            if (target === "bottom") {
                const floatingGroup = api.groups.find(g => g.api.location.type === "floating");

                if (floatingGroup)
                    dockViewPanel.api.moveTo({ group: floatingGroup });
                else
                    api.addFloatingGroup(dockViewPanel, {});

            }
        }
    }

    const addDevicePanel = (
        target: PanelTarget,
        device_id: string,
        operation: TPanel["operation"],
        file: TLocalFileOrDirectory | undefined = undefined) => {

        const panel: TPanel = (operation === "local_file")
            ? { device_id: device_id, operation, path: file!.path }
            : { device_id: device_id, operation };

        addPanel(panel, target);
    }

    const initApi = (_api: DockviewApi) => {
        api = _api!;

        try {
            const layout = JSON.parse(localStorage.getItem('e4e.dockView') ?? "{}");
            api.fromJSON(layout);
        } catch (err) { }

        try {
            const queryPanelString = new URLSearchParams(window.location.search).get('panel');
            const queryPanel = queryPanelString ? JSON.parse(queryPanelString) as TPanelWithClick : null;
            if (queryPanel) addPanel(queryPanel, "default");
        } catch (err) { }

        const onboardingPanelProps: TPanel = { operation: "onboarding" };
        const id = getPanelId(onboardingPanelProps);
        if (!api.panels.find(p => p.id === id))
            addPanel(onboardingPanelProps, "default");

        api.onDidLayoutChange(() => localStorage.setItem("e4e.dockView", JSON.stringify(api!.toJSON())));

        setApi(api);
    };

    return {
        initApi,
        addPanel,
        addDevicePanel,
    };
}