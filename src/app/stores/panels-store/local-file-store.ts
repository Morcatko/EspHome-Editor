import { TLocalFile } from "@/server/devices/types";
import { createMonacoFileStore_url, createMonacoFileStore_local, MonacoFileStore } from "./utils/monaco-file-store";
import { api } from "@/app/utils/api-client";
import { PanelStoreBase, TPanel } from "./types";

export class LocalFileStore extends PanelStoreBase {
    readonly left_file: MonacoFileStore;
    readonly right_file: MonacoFileStore | null;
    readonly test_file: MonacoFileStore | null;

    constructor(device_id: string, readonly file: TLocalFile) {
        super({
            device_id,
            operation: "local_file",
            path: file.path,
        });
        this.test_file = createMonacoFileStore_local(false, "json", "{}");
        this.left_file = createMonacoFileStore_url(false, "yaml", api.url_local_path(device_id, file.path));
        
        this.right_file = file.compiler !== "none"
            ? new MonacoFileStore(true, "yaml",() => api.local_path_compile(device_id, file.path, this.test_file?.content))
            : null;

        this.left_file.onChange = async (newContent: string) => {
            await api.local_save(device_id, file.path, newContent);
            await this.right_file?.reload();
        }

        this.test_file.onChange = (newContent: string) => this.right_file?.reload();
    }

    async loadIfNeeded() {
        await Promise.all([
            this.left_file.loadIfNeeded(),
            this.right_file?.loadIfNeeded(),
            this.test_file?.loadIfNeeded(),
        ]);
    }
    
}
