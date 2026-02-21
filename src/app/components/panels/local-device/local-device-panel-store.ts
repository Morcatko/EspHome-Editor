import { api } from "@/app/utils/api-client";
import { useQuery } from "@tanstack/react-query";
import { resultToEditorFileProps } from "../_utils/query-utils";
import { esphomeLanguageId } from "@/app/components/editors/monaco/languages";
import { TEditorFileProps } from "../../editors/single-editor";

export const useLocalDevicePanelStore = (device_id: string) => {
    const query = useQuery({
        queryKey: ["device", device_id, "local"],
        queryFn: async () => api.local_device(device_id)
    })
    return {
        ...resultToEditorFileProps(query),
        language: esphomeLanguageId,
    } satisfies TEditorFileProps;
}