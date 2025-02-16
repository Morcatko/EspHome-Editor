import { TEditorFileProps } from "@/app/stores/panels-store/types";
import { useDarkTheme } from "@/app/utils/hooks";
import { Editor } from "@monaco-editor/react";

type TSingleEditorProps = TEditorFileProps;

export const SingleEditor = (props: TSingleEditorProps) => {
    const isDarkMode = useDarkTheme();

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
            theme={isDarkMode ? "vs-dark" : "vs-light"}
            options={{
                readOnly: !props.onValueChange,
            }}
        />

    }
};