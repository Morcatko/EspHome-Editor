import { useEspHomeCompileStore } from "@/app/stores/panels-store/esphome-compile-store";
import { HtmlViewer } from "../editors/html-viewer";

export const EspHomeCompilePanel = ({ device_id }: { device_id: string }) => {
    const data = useEspHomeCompileStore(device_id);
    return <HtmlViewer data={data} />;
}