import { useQueryState, parseAsJson } from 'nuqs'
import { TDevice, TLocalFile } from "@/server/devices/types";
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

    return {
        panel: panel,
        add_localDevice: (device: TDevice) => setPanel({ device_id: device.id, operation: "local_device" }),
        add_localFile: (device: TDevice, file: TLocalFile) => setPanel({ device_id: device.id, operation: "local_file", path: file.path }),
        add_diff: (device: TDevice) => setPanel({ device_id: device.id, operation: "diff" }),
        add_espHomeDevice: (device: TDevice) => setPanel({ device_id: device.id, operation: "esphome_device" }),
        add_espHomeCompile: (device: TDevice) => setPanel({ device_id: device.id, operation: "esphome_compile" }),
        add_espHomeInstall: (device: TDevice) => setPanel({ device_id: device.id, operation: "esphome_install" }),
        add_espHomeLog: (device: TDevice) => setPanel({ device_id: device.id, operation: "esphome_log" }),
    };
}
