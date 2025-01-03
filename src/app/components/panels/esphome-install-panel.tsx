import { useEsphomeInstallStore } from "@/app/stores/panels-store/esphome-install-store";
import { HtmlViewer } from "../editors/html-viewer";

export const EspHomeInstallPanel = ({ device_id }: { device_id: string }) => {
    const data = useEsphomeInstallStore(device_id);
    return <HtmlViewer data={data} />;
}