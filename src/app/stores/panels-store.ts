import { atom, getDefaultStore, useAtom } from "jotai";
import type { TPanel, TPanel_DeviceLocalFile, TPanelWithClick } from "./panels-store/types";
import { type DockviewApi } from 'dockview-react';
import { useEffect, useState } from "react";
import { events } from "./events";

const dockViewApiAtom = atom<DockviewApi | null>(null);
const getApi = () => getDefaultStore().get(dockViewApiAtom);

dockViewApiAtom.onMount = (set) => {
    const fc = events.on("File_Created", (device_id: string, path: string) => addDevicePanel("default", device_id, "local_file", path));
    const fd = events.on("File_Deleted", (device_id: string, path: string) => removePanel({ device_id, operation: "local_file", path }));
    const fr = events.on("File_Renamed", (device_id: string, old_path: string, new_path: string) =>
        replacePanel(
            { device_id, operation: "local_file", path: old_path },
            { device_id, operation: "local_file", path: new_path })
    );

    return () => {
        fc();
        fd();
        fr();
    };
}

const trimPath = (path: string | null | undefined) => {
    return path
        ? path.replace(/^\/+|\/+$/g, '')
        : path;
}

function getPanelTitle(panel: TPanel) {
    switch (panel.operation) {
        case "devices_tree":
            return "Devices";
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
            (panel as any).path = trimPath((panel as TPanel_DeviceLocalFile).path);
            return JSON.stringify(panel, Object.keys(panel).sort());
    }
}

const findPanel = (panel: TPanel | string) => {
    const panelId = (typeof panel === 'string' || panel instanceof String)
        ? panel
        : getPanelId(panel as TPanel);
    return getApi()?.panels.find(p => p.id === panelId);
}

const addPanel = (
    panel: TPanel,
    target: PanelTarget = "default") => {
    if (target === "new_window") {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('panel', JSON.stringify(panel));
        window.open(currentUrl.toString(), '_blank')?.focus();
    }

    const api = getApi();
    if (!api) return;

    //generate ID from some hash
    const panelId = getPanelId(panel);
    const existingPanel = findPanel(panelId);
    const params: TPanelWithClick = { ...panel, last_click: new Date().toISOString() };

    if (existingPanel) {
        existingPanel.api.updateParameters(params)
        existingPanel.focus();
    }
    else {
        const dockViewPanel = api.addPanel<TPanelWithClick>({
            id: panelId,
            title: getPanelTitle(panel),
            component: "default",
            tabComponent: "default",
            params: params,
        });

        if (target === "floating") {
            const floatingGroup = api.groups.find(g => g.api.location.type === "floating");

            if (floatingGroup)
                dockViewPanel.api.moveTo({ group: floatingGroup });
            else
                api.addFloatingGroup(dockViewPanel, {
                    position: {
                        bottom: 15,
                        right: 15,
                    },
                    width: window.innerWidth * 2 / 3,
                    height: window.innerHeight * 2 / 3,
                });

        }
    }
}

const addDevicePanel = (
    target: PanelTarget,
    device_id: string,
    operation: TPanel["operation"],
    file_path: string | undefined = undefined) => {

    const panel: TPanel = (operation === "local_file")
        ? { device_id: device_id, operation, path: file_path! }
        : { device_id: device_id, operation };

    addPanel(panel, target);
}

const removePanel = (panel: TPanel) => {
    const existingPanel = findPanel(panel);
    if (existingPanel) {
        const api = getApi();
        api!.removePanel(existingPanel);
    }
}

const replacePanel = (oldPanel: TPanel, newPanel?: TPanel) => {
    const api = getApi()!;
    const existingPanel = findPanel(oldPanel);
    if (existingPanel) {
        if (newPanel) {
            addPanel(newPanel, "default");
        }
        api.removePanel(existingPanel);
    }
}


export type PanelTarget = "default" | "new_window" | "floating";

export const usePanelsApiStore = () => {
    const [api, setApi] = useAtom(dockViewApiAtom);
    return {
        api,
        setApi,
        findPanel: findPanel,
    }
}

export const usePanelsStore = () => {
    const panelsApi = usePanelsApiStore();
    let { api } = panelsApi;
    const { setApi } = panelsApi

    const initApi = (_api: DockviewApi) => {
        api = _api!;
        setApi(api);

        try {
            const layout = JSON.parse(localStorage.getItem('e4e.dockView') ?? "{}");
            api.fromJSON(layout);
        } catch (_) { }

        try {
            const queryPanelString = new URLSearchParams(window.location.search).get('panel');
            const queryPanel = queryPanelString ? JSON.parse(queryPanelString) as TPanelWithClick : null;
            if (queryPanel) addPanel(queryPanel);
        } catch (_) { }

        const onboardingPanelProps: TPanel = { operation: "onboarding" };
        const id = getPanelId(onboardingPanelProps);
        if (!api.panels.find(p => p.id === id))
            addPanel(onboardingPanelProps);

        api.onDidLayoutChange(() => localStorage.setItem("e4e.dockView", JSON.stringify(api!.toJSON())));

    };

    return {
        initApi,
        addPanel,
        addDevicePanel,
        replacePanel,
    };
}

export const useRerenderOnPanelChange = () => {
    const papi = usePanelsApiStore();

    const [_, setFake] = useState(0);
    useEffect(() => {
        papi.api?.onDidLayoutChange(() =>
            setFake(papi.api?.panels.length ?? 0)
        );
    }, [papi.api]);

    return papi;
}