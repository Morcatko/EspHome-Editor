import { atom, useAtom } from 'jotai';
import { useQueryState, parseAsJson } from 'nuqs'
import { TDevice, TLocalFileOrDirectory } from "@/server/devices/types";
import { TPanel } from "./panels-store/types";
import { useSessionStorage } from 'usehooks-ts';
import { useStatusStore } from "./status-store";
import { DockviewApi } from 'dockview-react';

const setLastClickAtom = atom<string>("initial");
const dockViewApiAtom = atom<DockviewApi | null>(null);

function getPanelTitle(panel: TPanel) {
    switch (panel.operation) {
        case "local_file":
            return `${panel.device_id} -  ${panel.path}`;
        case "local_device":
            return `Local - ${panel.device_id}`;
        case "esphome_device":
            return `ESPHome - ${panel.device_id}`;
        case "diff":
            return `DIFF - ${panel.device_id}`;
        case "esphome_compile":
            return `Compile - ${panel.device_id}`;
        case "esphome_install":
            return `Install - ${panel.device_id}`;
        case "esphome_log":
            return `Log - ${panel.device_id}`;
        default:
            return `Unknown`;
    }
}


export const usePanelsStore = () => {
    const status = useStatusStore();

     const [api, setApi] = useAtom(dockViewApiAtom);

/*    const [panel, setPanel] = status.isHaAddon
        ? useSessionStorage<TPanel | null>("panel", null, {
            serializer: JSON.stringify,
            deserializer: JSON.parse,
        })
        : useQueryState<TPanel>('panel', parseAsJson(v => v as TPanel));
*/

    const setPanel = (panel: TPanel) => {
        if (!api) return;
        const id = `${panel.operation}_${panel.device_id}_${(panel as any)?.path}`;

        const existingPanel = api?.panels.find(p => p.id === id)
        
        if (existingPanel) 
            existingPanel.focus();
        else
            api.addPanel<TPanel>({
                id: id,
                title: getPanelTitle(panel),
                component: "panel",
                params: panel,
            });
    }
    const [lastClick, setLastClick] = useAtom(setLastClickAtom);

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
            setPanel(panel);
            setLastClick(new Date().toISOString());
        }
    }

    return {
        //panel: panel,
        lastClick: lastClick,
        setApi: setApi,
        handleClick,
    };
}
