import { useEspHomeCompileStore } from "@/app/stores/panels-store/esphome-compile-store";
import { LogStream } from "../editors/log-stream";

export const EspHomeCompilePanel = ({ device_id }: { device_id: string }) => {
    const data = useEspHomeCompileStore(device_id);
    return <LogStream data={data} />;
}