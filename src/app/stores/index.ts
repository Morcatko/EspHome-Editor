import { QueryClient } from "@tanstack/react-query";
import { useDevicesTreeStore } from "../components/devices-tree/devices-tree-store";
import { usePanelsStore } from "../components/panels/panels-store";

export const queryClient = new QueryClient()


export const useAppStores = () => {
    return {
        panels: usePanelsStore(),
        devicesTree: useDevicesTreeStore(),
    }
}