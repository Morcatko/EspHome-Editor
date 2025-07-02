import { atom, getDefaultStore, useAtom } from "jotai";
import type { TPanel, TPanel_Device, TPanelWithClick } from "./panels-store/types";
import { type DockviewApi } from 'dockview-react';
import { useEffect, useState } from "react";
import { events } from "./events";
import type { TLocalFileOrDirectory } from "@/server/devices/types";

const dockViewApiAtom = atom<DockviewApi | null>(null);
const getApi = () => getDefaultStore().get(dockViewApiAtom);

dockViewApiAtom.onMount = (set) => {
    const fc = events.on("File_Created", (device_id: string, path: string) => addDevicePanel("default", device_id, "local_file", path));
    const fd = events.on("FoD_Deleted", (device_id: string, fod: TLocalFileOrDirectory) => removePanel({ device_id, operation: "local_file", path: fod.path }));
    const fr = events.on("FoD_Renamed", (device_id: string, fod: TLocalFileOrDirectory, new_path: string) =>
        replacePanel(
            { device_id, operation: "local_file", path: fod.path },
            { device_id, operation: "local_file", path: new_path })
    );
    const dd = events.on("Device_Deleted", (device_id: string) => {
        const api = getApi();
        getApi()?.panels
            .filter(pan => {
                const p = pan.params as TPanel_Device;
                return p.device_id === device_id
            })
            .forEach(p => api!.removePanel(p));
    });

    return () => {
        fc();
        fd();
        fr();
        dd();
    };
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
        default:
            return `Unknown`;
    }
}

function getPanelId(panel: TPanel) {
    switch (panel.operation) {
        default:
            if (panel.operation === "local_file")
                panel.path = panel.path.replace(/^\/+|\/+$/g, '')   //trim leading and trailing slashes
            //TODO: generate ID from some hash
            return JSON.stringify(panel, Object.keys(panel).sort());
    }
}

const findPanel = (panel: TPanel | string) => {
    const panelId = (typeof panel === 'string' || panel instanceof String)
        ? panel
        : getPanelId(panel as TPanel);
    return getApi()?.panels.find(p => p.id === panelId);
}


export type PanelTarget = "default" | "new_window" | "floating";

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

export const usePanelsApiStore = () => {
    const [api, setApi] = useAtom(dockViewApiAtom);

    return {
        api,
        setApi,
        findPanel,
    }
}

export const usePanelsStore = () => {
    const panelsApi = usePanelsApiStore();
    let { api } = panelsApi;
    const { setApi, findPanel } = panelsApi

    const initApi = (_api: DockviewApi) => {
        api = _api!;
        setApi(api);

        try {
            const layout = JSON.parse(localStorage.getItem('e4e.dockView') ?? "{}");
            if (layout?.panels?.onboarding) {
                delete layout.panels.onboarding;
            }
            api.fromJSON(layout);
        } catch (_) { }

        try {
            const queryPanelString = new URLSearchParams(window.location.search).get('panel');
            const queryPanel = queryPanelString ? JSON.parse(queryPanelString) as TPanelWithClick : null;
            if (queryPanel) addPanel(queryPanel);
        } catch (_) { }

        api.onDidLayoutChange(() => localStorage.setItem("e4e.dockView", JSON.stringify(api!.toJSON())));
    };

    return {
        initApi,
        addPanel,
        addDevicePanel,
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