import { useEsphomeInstallStore } from "@/app/stores/panels-store/esphome-install-store";
import { LogStream } from "../editors/log-stream";

export const EspHomeInstallPanel = ({ device_id }: { device_id: string }) => {
    const data = useEsphomeInstallStore(device_id);
    return <LogStream data={data} />;
}