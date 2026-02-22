import { useStreamingStore } from "../_utils/streaming-store";
import { api } from "@/app/utils/api-client";

export const useEspHomeCompilePanelStore = (device_id: string, lastClick: string) =>
    useStreamingStore(api.url_esphome_compile(device_id), lastClick);
