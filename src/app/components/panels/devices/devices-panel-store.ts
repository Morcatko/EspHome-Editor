import { useDevicesQuery } from "@/app/stores/devices-store"

export const useDevicesPanelStore = () => {
    return {
        devices_query: useDevicesQuery(),
    };
}