import { TDevice } from "@/server/devices/types";
import { IPanelsStore } from "./utils/IPanelsStore";
import { api } from "@/app/utils/api-client";
import { useQuery } from "@tanstack/react-query";
import { TEditorFileProps } from "./types";

export const useLocalDeviceStore = (device_id: string) => {
    const query = useQuery({
        queryKey: ["device", device_id, "local"],
        queryFn: async () => api.callGet_text(api.url_device(device_id, "local"))
    })
    return <TEditorFileProps>{
        value:  query.data?.content ?? "",
        language: "yaml",
    }
}

export class LocalDeviceStore implements IPanelsStore {
    readonly dataPath = "Local";
    constructor(readonly device: TDevice) {}
    async loadIfNeeded() { }
}