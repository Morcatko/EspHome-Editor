import { useEspHomeLogStore } from "@/app/stores/panels-store/esphome-log-store";
import { LogStream } from "../editors/log-stream";

export const EspHomeLogPanel = ({ device_id }: { device_id: string }) => {
    const data = useEspHomeLogStore(device_id);
    return <LogStream data={data} />;
}