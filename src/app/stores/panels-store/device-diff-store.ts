import { TDevice } from "@/server/devices/types";
import { IPanelsStore } from "./utils/IPanelsStore";
import { api } from "@/app/utils/api-client";
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


export class DeviceDiffStore implements IPanelsStore{
    readonly dataPath = "diff";
    
    constructor(readonly device: TDevice) { }
    async loadIfNeeded() { }
}