import { useQueryState, parseAsJson } from 'nuqs'
import { TDevice, TLocalFileOrDirectory } from "@/server/devices/types";
import { TPanel } from "./panels-store/types";
import { useSessionStorage } from 'usehooks-ts';
import { useStatusStore } from "./status-store";

export const usePanelsStore = () => {
    const status = useStatusStore();

    const [panel, setPanel] = status.isHaAddon
        ? useSessionStorage<TPanel | null>("panel", null, {
            serializer: JSON.stringify,
            deserializer: JSON.parse,
        })
        : useQueryState<TPanel>('panel', parseAsJson(v => v as TPanel));

    const handleClick = (
        e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
        device: TDevice,
        operation: TPanel["operation"],
        file: TLocalFileOrDirectory | undefined = undefined) => {

        console.log("handle click", e);

        const panel: TPanel = (operation === "local_file")
            ? { device_id: device.id, operation, path: file!.path }
            : { device_id: device.id, operation };

        if ((e as any).button === 1) {// Middle click
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('panel', JSON.stringify(panel));
            window.open(currentUrl.toString(), '_blank')?.focus();
        }
        else
            setPanel(panel);
    }

    return {
        panel: panel,
        handleClick,
        /*add_localDevice: (device: TDevice) => goTo({ device_id: device.id, operation: "local_device" }),
        add_localFile: (device: TDevice, file: TLocalFile) => goTo({ device_id: device.id, operation: "local_file", path: file.path }),
        add_diff: (device: TDevice) => goTo({ device_id: device.id, operation: "diff" }),
        add_espHomeDevice: (device: TDevice) => goTo({ device_id: device.id, operation: "esphome_device" }),
        add_espHomeCompile: (device: TDevice) => goTo({ device_id: device.id, operation: "esphome_compile" }),
        add_espHomeInstall: (device: TDevice) => goTo({ device_id: device.id, operation: "esphome_install" }),
        add_espHomeLog: (device: TDevice) => goTo({ device_id: device.id, operation: "esphome_log" }),*/
    };
}
