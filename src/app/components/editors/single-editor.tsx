import { TEditorFileProps } from "@/app/stores/panels-store/types";
import { Editor } from "@monaco-editor/react";
import { useMonacoTheme } from "./monaco/useMonacoTheme";

type TSingleEditorProps = TEditorFileProps;

export const SingleEditor = (props: TSingleEditorProps) => {
    const theme = useMonacoTheme();

    if (props.value.pending) {
        return <div>Loading...</div>;
    }
    else if (props.value.error) {
        return <div>{props.value.content || "Something went wrong"}</div>;
    }
    else {
        return <Editor
            value={props.value.content}
            onChange={(v) => props.onValueChange?.(v ?? "")}
            language={props.language}
            theme={theme}
            options={{
                readOnly: !props.onValueChange,
            }}
        />
    }
};