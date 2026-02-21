import { useESPHomeDevicePanelStore } from "../esphome-device/esphome-device-panel-store";
import { useLocalDevicePanelStore } from "../local-device/local-device-panel-store";

export const useDiffPanelStore = (device_id: string) => {
    const leftQuery = useESPHomeDevicePanelStore(device_id)
    const rightQuery = useLocalDevicePanelStore(device_id);

    return {
            leftEditor: leftQuery,
            rightEditor: rightQuery
        }
}