import { useStreamingStore } from "../_utils/streaming-store";
import { api } from "@/app/utils/api-client";

export const useEsphomeInstallPanelStore = (device_id: string, lastClick: string) =>
    useStreamingStore(api.url_device(device_id, "esphome/install"), lastClick);
