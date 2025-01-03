import { useEspHomeLogStore } from "@/app/stores/panels-store/esphome-log-store";
import { HtmlViewer } from "../editors/html-viewer";

export const EspHomeLogPanel = ({ device_id }: { device_id: string }) => {
    const data = useEspHomeLogStore(device_id);
    return <HtmlViewer data={data} />;
}