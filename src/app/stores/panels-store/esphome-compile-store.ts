import { useStreamingStore } from "./utils/streaming-store";
import { api } from "@/app/utils/api-client";

export const useEspHomeCompileStore = (device_id: string) =>
    useStreamingStore(api.url_device(device_id, "esphome/compile"));
