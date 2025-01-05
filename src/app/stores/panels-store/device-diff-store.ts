import { useESPHomeDeviceStore } from "./esphome-device-store";
import { useLocalDeviceStore } from "./local-device-store";

export const useDeviceDiffStoreQuery = (device_id: string) => {
    const leftQuery = useESPHomeDeviceStore(device_id)
    const rightQuery = useLocalDeviceStore(device_id);

    return {
            leftEditor: leftQuery,
            rightEditor: rightQuery
        }
}