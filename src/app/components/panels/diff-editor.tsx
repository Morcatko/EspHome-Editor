import { MonacoFileStore } from "@/app/stores/panels-store/utils/monaco-file-store";
import { DiffEditor as MonacoDiffEditor } from "@monaco-editor/react";
import { observer } from "mobx-react-lite";

type props = {
    left_store: MonacoFileStore;
    right_store: MonacoFileStore;
}
export const DiffEditor = observer((props: props) => {
    return <MonacoDiffEditor
            original={props.left_store.content}
            modified={props.right_store.content}
            originalLanguage={props.left_store.language}
            modifiedLanguage={props.right_store.language}
            options={{
                readOnly: props.left_store?.readonly,
            }} />
});