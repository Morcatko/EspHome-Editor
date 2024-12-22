import { MonacoFileStore } from "@/app/stores/panels-store/utils/monaco-file-store";
import { useDarkTheme } from "@/app/utils/hooks";
import { Editor } from "@monaco-editor/react";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";

type props = {
    store: MonacoFileStore;
}
export const SingleEditor = observer((props: props) => {
    const isDarkMode = useDarkTheme();

    return <Editor
        value={props.store?.content}
        onChange={(v) => props.store.changeContent(v ?? "")}
        language={props.store?.language}
        theme={isDarkMode ? "vs-dark" : "vs-light"}
        options={{
            readOnly: props.store?.readonly,
        }}
    />
});

export type TSingleEditorProps = {
    value: string;
    onValueChange?: (v: string) => void;
    language: string;
    readonly: boolean;
}

export const SingleEditor2 = (props: TSingleEditorProps) => {
    const isDarkMode = useDarkTheme();
  
    return <Editor
        value={props.value}
        onChange={(v) => props.onValueChange?.(v ?? "")}
        language={props.language}
        theme={isDarkMode ? "vs-dark" : "vs-light"}
        options={{
            readOnly: props.readonly,
        }}
    />
};