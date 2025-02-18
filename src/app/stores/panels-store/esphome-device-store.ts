import { api } from "@/app/utils/api-client";
import { useQuery } from "@tanstack/react-query";
import { TEditorFileProps } from "./types";
import { queryToContent } from "./utils/query-utils";
import { esphomeLanguageId } from "@/app/components/editors/monaco/languages";

export const useESPHomeDeviceStore = (device_id: string) => {
    const query = useQuery({
        queryKey: ["device", device_id, "esphome"],
        queryFn: async () => api.callGet_text(api.url_device(device_id, "esphome"))
    })
    return <TEditorFileProps>{
        value:  queryToContent(query),
        language: esphomeLanguageId,
    }
}