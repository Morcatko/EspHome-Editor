import { LocalFileStore } from "@/app/stores/panels-store/local-file-store";
import { observer } from "mobx-react-lite";
import { SplitEditor, SplitEditor2 } from "./split-editor";
import { Link } from "@primer/react";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import SplitPane, { Pane } from "split-pane-react";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/utils/api-client";

const EtaJsBanner = ({ store }: { store: LocalFileStore }) => {
    const [sizes, setSizes] = useState<(number | string)[]>([
        '50%',
        'auto',
    ]);

    return <SplitPane
        split="vertical"
        sizes={sizes}
        onChange={(sizes) => setSizes(sizes)} >
        <Pane minSize={20}>
            <Editor
                language={store.test_file?.language}
                options={{ minimap: { enabled: false }, lineNumbers: "off" }}
                value={store.test_file?.content}
                onChange={(v) => store.test_file?.changeContent(v ?? "")} />
        </Pane>
        <Pane minSize={20}>
            <ul className="flex-grow text-right">
                <li><Link href="https://eta.js.org/docs/intro/template-syntax" target="_blank" rel="noreferrer">Template syntax</Link></li>
                <li><Link href="https://eta.js.org/docs/intro/syntax-cheatsheet" target="_blank" rel="noreferrer">Syntax cheatsheat</Link></li>
            </ul>
        </Pane>
    </SplitPane>;
}

const getBanner = (store: LocalFileStore) => {
    switch (store.file.compiler) {
        /*case "etajs":
            return <EtaJsBanner store={store} />;*/
        default:
            return null;
    }
}
export const LocalFilePanel = observer(({ store }: { store: LocalFileStore }) => {
    const [sizes, setSizes] = useState<(number | string)[]>([
        '150px',
        'auto',
    ]);


    const leftQuery = useQuery({
        queryKey: ["device", store.device.id, "local-file", store.file.path],
        queryFn: async () => api.callGet_text(api.url_local_path(store.device.id, store.file.path))
    });

    const rightQuery = useQuery({
        queryKey: ["device", store.device.id, "local-file", store.file.path, "compiled"],
        queryFn: async () => api.local_path_compile(store.device.id, store.file.path, "")
    });

    const queryClient = useQueryClient();
    const leftMutation = useMutation({
         mutationFn: async (v: string) => api.local_save(store.device.id, store.file.path, v),
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["device", store.device.id, "local-file", store.file.path, "compiled"]})
         }
    });

    return <SplitEditor2
        leftEditor={
            {
                value: leftQuery.data?.content ?? "",
                onValueChange: (v) => leftMutation.mutate(v),
                language: store.left_file.language,
                readonly: store.left_file.readonly,
            }}
        rightEditor={
            {
                value: rightQuery.data?.content ?? "",
                language: "yaml",
                readonly: true,
            }}
    />
});