import { atom, useAtom } from "jotai";
import { TDevice, TLocalFileOrDirectory } from "@/server/devices/types";
import { TPanel, TPanelWithClick } from "./panels-store/types";
import { DockviewApi } from 'dockview-react';
import { useEffect } from "react";

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
    return JSON.stringify(panel, Object.keys(panel).sort());
}


export const usePanelsStore = () => {
    const [api, setApi] = useAtom(dockViewApiAtom);

    const addDockViewPanel = (
        id: string,
        title: string,
        params: TPanelWithClick,
    ) => {
        if (!api) return;

        const existingPanel = api?.panels.find(p => p.id === id)

        if (existingPanel) {
            existingPanel.update({ params });
            existingPanel.focus();
        }
        else
            api.addPanel<TPanel>({
                id: id,
                title: title,
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
        else {
            addDockViewPanel(
                getPanelId(panel),
                getPanelTitle(panel),
                { ...panel, last_click: new Date().toISOString() });
        }
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

    
    useEffect(() => {
        if (api && api.panels.length === 0) addPanel(null, { operation: "onboarding" });
    }, [api]);

    return {
        setApi: setApi,
        addPanel,
        addDevicePanel,
    };
}