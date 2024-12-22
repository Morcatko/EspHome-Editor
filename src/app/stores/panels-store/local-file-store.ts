import { api } from "@/app/utils/api-client";
import { IPanelsStore } from "./utils/IPanelsStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TEditorFileProps } from "./types";
import { TDevice, TLocalFile } from "@/server/devices/types";

export const useLocalFileStore = (device_id: string, file: TLocalFile) => {
    const file_path = file.path;
    const hasRightFile = file.compiler !== "none";


    const leftQuery = useQuery({
        queryKey: ["device", device_id, "local-file", file_path],
        queryFn: async () => api.callGet_text(api.url_local_path(device_id, file_path))
    });

    const rightQuery = useQuery({
        queryKey: ["device", device_id, "local-file", file_path, "compiled"],
        queryFn: async () => api.local_path_compile(device_id, file_path, ""),
        enabled: hasRightFile
    });

    const queryClient = useQueryClient();
    const leftMutation = useMutation({
        mutationFn: async (v: string) => api.local_save(device_id, file_path, v),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["device", device_id, "local-file", file_path, "compiled"] })
        }
    });

    return {
        leftEditor: <TEditorFileProps>{
            value: leftQuery.data?.content ?? "",
            language: "yaml",
            onValueChange: (v) => leftMutation.mutate(v),
        },
        rightEditor: hasRightFile
            ? <TEditorFileProps>{
                value: rightQuery.data?.content ?? "",
                language: "yaml",
            }
            : null
    }
};



export class LocalFileStore implements IPanelsStore {
    readonly dataPath: string;
    constructor(readonly device: TDevice, readonly file: TLocalFile) {
        this.dataPath = file.path;
    }

    async loadIfNeeded() { }
}
