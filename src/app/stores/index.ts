import { QueryClient } from "@tanstack/react-query";
import { usePanelsStore } from "./panels-store";
import { useDevicesTreeStore } from "../components/devices-tree/devices-tree-store";

export const queryClient = new QueryClient()


export const useAppStores = () => {
    return {
        panels: usePanelsStore(),
        devicesTree: useDevicesTreeStore(),
    }
}