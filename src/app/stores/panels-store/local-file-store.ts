import { api } from "@/app/utils/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TEditorFileProps } from "./types";
import { TLocalFile, TLocalFileOrDirectory } from "@/server/devices/types";
import { useDevice } from "../devices-store";
import { queryToContent } from "./utils/query-utils";
import { esphomeLanguageId } from "@/app/components/editors/monaco/languages";

const findFile = (fods: TLocalFileOrDirectory[], file_path: string): TLocalFile | null => {
    for (const fod of fods) {
        if (fod.type === "file" && fod.path === file_path) {
            return fod;
        }
        if (fod.type === "directory") {
            const file = findFile(fod.files!, file_path);
            if (file) {
                return file;
            }
        }
    }
    return null;
}

export const useLocalFile = (device_id: string, file_path: string) => {
   const device = useDevice(device_id);
    const file = findFile(device?.files ?? [], file_path)!;
    return file;
}

export const useLocalFileStore = (device_id: string, file_path: string) => {
    const file = useLocalFile(device_id, file_path);
    
    const hasRightFile = (file != null) && (file.compiler !== "none");


    const leftQuery = useQuery({
        queryKey: ["device", device_id, "local-file", file_path],
        queryFn: async () => api.local_path_get(device_id, file_path)
    });

    const rightQuery = useQuery({
        queryKey: ["device", device_id, "local-file", file_path, "compiled"],
        queryFn: async () => api.local_path_compiled(device_id, file_path),
        enabled: hasRightFile
    });

    const hasTestData = hasRightFile && ((device_id === ".lib") || file_path.startsWith(".lib/"));
    const testDataQuery = useQuery({
        queryKey: ["device", device_id, "local-file", file_path, "test-data"],
        queryFn: async () => api.local_path_testData_get(device_id, file_path),
        enabled: hasTestData
    });

    const queryClient = useQueryClient();
    const leftMutation = useMutation({
        mutationFn: async (v: string) => api.local_path_save(device_id, file_path, v),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["device", device_id, "local-file", file_path, "compiled"] });
            queryClient.invalidateQueries({ queryKey: ["device", device_id, "local"] });
        }
    });
    const testDataMutation = useMutation({
        mutationFn: async (v: string) => api.local_path_testData_post(device_id, file_path, v),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["device", device_id, "local-file", file_path, "compiled"] });
        }
    });

    return {
        leftEditor: <TEditorFileProps>{
            value: queryToContent(leftQuery),
            language: esphomeLanguageId, //TODO - can be etajs (or anything else)
            onValueChange: (v) => leftMutation.mutate(v),
        },
        rightEditor: hasRightFile
            ? <TEditorFileProps>{
                value: queryToContent(rightQuery),
                language: esphomeLanguageId,
            }
            : null,
        testDataEditor: hasTestData
            ? <TEditorFileProps>{
                value: queryToContent(testDataQuery),
                language: "json",
                onValueChange: (v) => testDataMutation.mutate(v),
            }
            : null,
    }
};
