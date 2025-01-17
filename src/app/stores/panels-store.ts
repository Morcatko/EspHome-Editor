import { useQueryState, parseAsJson } from 'nuqs'
import { TDevice, TLocalFileOrDirectory } from "@/server/devices/types";
import { TPanel, TPanelWithClick } from "./panels-store/types";
import { useSessionStorage } from 'usehooks-ts';
import { useStatusStore } from "./status-store";
import { useEffect } from 'react';

export const usePanelsStore = () => {
    const status = useStatusStore();

    const [panel, setPanel] = status.isHaAddon
        ? useSessionStorage<TPanelWithClick | null>("e4e.panel", null, {
            serializer: JSON.stringify,
            deserializer: JSON.parse,
        })
        : useQueryState<TPanelWithClick>('panel', parseAsJson(v => v as TPanelWithClick));
     
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
            setPanel({ ...panel, last_click: new Date().toISOString() });
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
        if (!panel) addPanel(null, { operation: "onboarding"});
    }, [panel]);

    return {
        panel: <TPanelWithClick | null>panel,
        addPanel,
        addDevicePanel
    };
}
