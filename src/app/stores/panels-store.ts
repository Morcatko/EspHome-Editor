import { atom, useAtom } from "jotai";
import { TDevice, TLocalFileOrDirectory } from "@/server/devices/types";
import { TPanel, TPanelWithClick } from "./panels-store/types";
import { DockviewApi } from 'dockview-react';

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

export const usePanelsStore = () => {
    let [api, setApi] = useAtom(dockViewApiAtom);

    const addDockViewPanel = (panel: TPanel) => {
        if (!api) return;

        //generate ID from some hash
        const id = JSON.stringify(panel, Object.keys(panel).sort());
        const params: TPanelWithClick = { ...panel, last_click: new Date().toISOString() };
        const existingPanel = api?.panels.find(p => p.id === id)

        if (existingPanel) {
            existingPanel.update({ params });
            existingPanel.focus();
        }
        else
            api.addPanel<TPanelWithClick>({
                id: getPanelId(panel),
                title: getPanelTitle(panel),
                component: "default",
                tabComponent: "default",
                params: params,
            });
    }

    const addPanel = (
        e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | null,
        panel: TPanel) => {
        if ((e as any)?.button === 1) {// Middle click
            //Middle click does not work
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('panel', JSON.stringify(panel));
            window.open(currentUrl.toString(), '_blank')?.focus();
        }
        else
            addDockViewPanel(panel);
    }

    const addDevicePanel = (
        e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
        device: TDevice,
        operation: TPanel["operation"],
        file: TLocalFileOrDirectory | undefined = undefined) => {

        const panel: TPanel = (operation === "local_file")
            ? { device_id: device.id, operation, path: file!.path }
            : { device_id: device.id, operation };

        addPanel(e, panel);
    }

    const initApi = (_api: DockviewApi) => {
        api = _api!;

        try {
            const layout = JSON.parse(localStorage.getItem('e4e.dockView') ?? "{}");
            api.fromJSON(layout);

            const queryPanelString = new URLSearchParams(window.location.search).get('panel');
            const queryPanel = queryPanelString ? JSON.parse(queryPanelString) as TPanelWithClick : null;
            if (queryPanel) addDockViewPanel(queryPanel);

            const onboardingPanelProps: TPanel = { operation: "onboarding" };
            const id = getPanelId(onboardingPanelProps);
            if (!api.panels.find(p => p.id === id))
                addDockViewPanel(onboardingPanelProps);

        } catch (err) { }

        api.onDidLayoutChange(() => localStorage.setItem("e4e.dockView", JSON.stringify(api!.toJSON())));

        setApi(api);
    };

    return {
        initApi,
        addPanel,
        addDevicePanel,
    };
}