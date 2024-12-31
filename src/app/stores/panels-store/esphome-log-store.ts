import { useStreamingStore } from "./utils/streaming-store";
import { api } from "@/app/utils/api-client";

export const useEspHomeLogStore = (device_id: string) =>
    useStreamingStore(api.url_device(device_id, "esphome/log"));
