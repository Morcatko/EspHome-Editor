import { useQueryState, parseAsJson } from 'nuqs'
import { TDevice, TLocalFileOrDirectory } from "@/server/devices/types";
import { TPanel } from "./panels-store/types";
import { useSessionStorage } from 'usehooks-ts';
import { useStatusStore } from "./status-store";

export const usePanelsStore = () => {
    const status = useStatusStore();

    const [panel, setPanel] = status.isHaAddon
        ? useSessionStorage<TPanel | null>("e4e.panel", null, {
            serializer: JSON.stringify,
            deserializer: JSON.parse,
        })
        : useQueryState<TPanel>('panel', parseAsJson(v => v as TPanel));

    const addPanel = (
        params: TPanel | null,
    ) => {
        setPanel(params);
    }


    const addEditorPanel = (panel: TPanel) =>
        addPanel(
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
        panel: panel,
        addOnboarding: () => addPanel(null),
        handleClick,
    };
}
