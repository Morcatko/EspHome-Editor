import { api } from "@/app/utils/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TEditorFileProps } from "./types";
import { TLocalFile, TLocalFileOrDirectory } from "@/server/devices/types";
import { useDevicesStore } from "../devices-store";

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

export const useLocalFileStore = (device_id: string, file_path : string) => {
    
    const devices = useDevicesStore().query.data;
    const device = devices?.find(d => d.id === device_id);
    const file = findFile(device?.files ?? [], file_path)!;

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
            queryClient.invalidateQueries({ queryKey: ["device", device_id, "local-file", file_path, "compiled"] });
            queryClient.invalidateQueries({ queryKey: ["device", device_id, "local"] });
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
