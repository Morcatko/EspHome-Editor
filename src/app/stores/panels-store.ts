import { useQueryState, parseAsJson } from 'nuqs'
import { TDevice, TLocalFile } from "@/server/devices/types";
import { TPanel } from "./panels-store/types";

export const usePanelsStore = () => {
    const [panel, setPanel] = useQueryState<TPanel>('panel', parseAsJson(v => v as TPanel));

    return {
        panel,
        add_localDevice: (device: TDevice) => setPanel({ device_id: device.id, operation: "local_device" }),
        add_localFile: (device: TDevice, file: TLocalFile) => setPanel({ device_id: device.id, operation: "local_file", path: file.path }),
        add_diff: (device: TDevice) => setPanel({device_id: device.id, operation: "diff"}),
        add_espHomeDevice: (device: TDevice) => setPanel({device_id: device.id, operation: "esphome_device"}),
        add_espHomeCompile: (device: TDevice) => setPanel({device_id: device.id, operation: "esphome_compile"}),
        add_espHomeInstall: (device: TDevice) => setPanel({device_id: device.id, operation: "esphome_install"}),
        add_espHomeLog: (device: TDevice) => setPanel({device_id: device.id, operation: "esphome_log"}),
    };
}
