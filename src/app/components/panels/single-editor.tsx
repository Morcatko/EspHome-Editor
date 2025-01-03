import { MonacoFileStore } from "@/app/stores/panels-store/utils/monaco-file-store";
import { useDarkTheme } from "@/app/utils/hooks";
import { Editor } from "@monaco-editor/react";
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