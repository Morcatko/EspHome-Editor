import { useStreamingStore } from "./utils/streaming-store";
import { api } from "@/app/utils/api-client";

export const useEsphomeInstallStore = (device_id: string, lastClick: string) =>
    useStreamingStore(api.url_device(device_id, "esphome/install"), lastClick);
