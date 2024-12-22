import { makeAutoObservable } from "mobx";
import { TDevice, TLocalFile } from "@/server/devices/types";
import { createMonacoFileStore_url, createMonacoFileStore_local, MonacoFileStore } from "./utils/monaco-file-store";
import { api } from "@/app/utils/api-client";
import { IPanelsStore } from "./utils/IPanelsStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { languages } from "monaco-editor";
import { read } from "fs";

export type TEditorFileProps ={
    value: string;
    onValueChange?: (v: string) => void;
    language: string;
    readonly: boolean;
}

export const useLocalFileQuery = (store: LocalFileStore) => {
    const device_id = store.device.id;
    const file_path = store.file.path;

    const leftQuery = useQuery({
        queryKey: ["device", device_id, "local-file", file_path],
        queryFn: async () => api.callGet_text(api.url_local_path(device_id, file_path))
    });

    const rightQuery = useQuery({
        queryKey: ["device", device_id, "local-file", file_path, "compiled"],
        queryFn: async () => api.local_path_compile(device_id, file_path, ""),
        enabled: !!store.right_file
    });

    const queryClient = useQueryClient();
    const leftMutation = useMutation({
         mutationFn: async (v: string) => api.local_save(device_id, file_path, v),
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["device", device_id, "local-file", file_path, "compiled"]})
         }
    });

    return { 
        leftEditor: <TEditorFileProps>{
            value: leftQuery.data?.content ?? "",
            onValueChange: (v) => leftMutation.mutate(v),
            language: store.left_file.language,
            readonly: store.left_file.readonly,
        },
        rightEditor: store.right_file && {
            value: rightQuery.data?.content ?? "",
            language: "yaml",
            readonly: true,
        }
    }
};



export class LocalFileStore implements IPanelsStore {
    readonly dataPath:string;
    readonly left_file: MonacoFileStore;
    readonly right_file: MonacoFileStore | null;

    
    constructor(readonly device: TDevice, readonly file: TLocalFile) {
        this.dataPath = file.path;
        this.left_file = createMonacoFileStore_url(false, "yaml", api.url_local_path(device.id, file.path));
        
        this.right_file = file.compiler !== "none"
            ? new MonacoFileStore(true, "yaml",() => api.local_path_compile(device.id, file.path, ""))
            : null;
        makeAutoObservable(this);

        this.left_file.onChange = async (newContent: string) => {
            await api.local_save(device.id, file.path, newContent);
            await this.right_file?.reload();
        }
    }

    async loadIfNeeded() {
        await Promise.all([
            this.left_file.loadIfNeeded(),
            this.right_file?.loadIfNeeded(),
        ]);
    }
    
}
