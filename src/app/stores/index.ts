import { QueryClient } from "@tanstack/react-query";
import { useDevicesStore } from "./devices-store";
import { usePanelsStore } from "./panels-store";

export const queryClient = new QueryClient()


export const useAppStores = () => {
    return {
        panels: usePanelsStore(),
        devices: useDevicesStore(),
    }
}