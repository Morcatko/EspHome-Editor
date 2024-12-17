import { MonacoFileStore } from "@/app/stores/panels-store/utils/monaco-file-store";
import { useDarkTheme } from "@/app/utils/hooks";
import { DiffEditor as MonacoDiffEditor } from "@monaco-editor/react";
import { observer } from "mobx-react-lite";

type props = {
    left_store: MonacoFileStore;
    right_store: MonacoFileStore;
}
export const DiffEditor = observer((props: props) => {
    const isDarkMode = useDarkTheme();

    return <MonacoDiffEditor
        original={props.left_store.content}
        modified={props.right_store.content}
        originalLanguage={props.left_store.language}
        modifiedLanguage={props.right_store.language}
        theme={isDarkMode ? "vs-dark" : "vs-light"}
        options={{
            readOnly: props.left_store?.readonly,
        }}
    />
});