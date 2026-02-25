import { useDevicesQuery } from "@/app/stores/devices-store"
import { api } from "@/app/utils/api-client";

export const useDevicesPanelStore = () => {
    return {
        devices_query: useDevicesQuery(),
        refreshCompilationInfo: async (device_id: string) => api.esphome_refreshCompilationInfo(device_id),
        refreshDeviceInfo: async (device_id: string) => api.esphome_refreshDeviceInfo(device_id),
    };
}