import { useDevicesStore2 } from "../devices-store";
import { useStreamingStore } from "./utils/streaming-store";

export const useEspHomeCompileStore = (device_id: string, lastClick: string) => {
    const devicesStore =useDevicesStore2();
    const device = devicesStore.findDevice(device_id);
    useStreamingStore(device!.compileStreamUrl, lastClick);
}
