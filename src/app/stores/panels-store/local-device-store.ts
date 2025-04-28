import { api } from "@/app/utils/api-client";
import { useQuery } from "@tanstack/react-query";
import { TEditorFileProps } from "./types";
import { callResultToEditorFileProps } from "./utils/query-utils";
import { esphomeLanguageId } from "@/app/components/editors/monaco/languages";

export const useLocalDeviceStore = (device_id: string) => {
    const query = useQuery({
        queryKey: ["device", device_id, "local"],
        queryFn: async () => api.local_device(device_id)
    })
    return {
        ...callResultToEditorFileProps(query),
        language: esphomeLanguageId,
    } satisfies TEditorFileProps;
}