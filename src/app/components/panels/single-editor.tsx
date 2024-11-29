import { MonacoFileStore } from "@/app/stores/panels-store/utils/monaco-file-store";
import { Editor } from "@monaco-editor/react";
import { observer } from "mobx-react-lite";

type props = {
    store: MonacoFileStore;
}
export const SingleEditor = observer((props: props) => {
    return <Editor 
           // onMount={handleEditorDidMount}
            language={props.store?.language}
            options={{
                readOnly: props.store?.readonly,
            }}
            onChange={(v) => props.store.changeContent(v ?? "")}
            value={props.store?.content} />
});