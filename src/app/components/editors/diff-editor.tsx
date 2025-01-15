import { TEditorFileProps } from "@/app/stores/panels-store/types";
import { useDarkTheme } from "@/app/utils/hooks";
import { DiffEditor as MonacoDiffEditor } from "@monaco-editor/react";

type TProps = {
    leftEditor: TEditorFileProps;
    rightEditor: TEditorFileProps;
}

export const DiffEditor = (props: TProps) => {
    const isDarkMode = useDarkTheme();

    if (props.leftEditor.value.pending || props.rightEditor.value.pending) {
        return <div>Loading...</div>;
    }
    else if (props.leftEditor.value.error || props.rightEditor.value.error) {
        return <div>{props.leftEditor.value.error || props.rightEditor.value.error || "Something went wrong"}</div>;
    }
    else {
        return <MonacoDiffEditor
            original={props.leftEditor.value.content}
            modified={props.rightEditor.value.content}
            originalLanguage={props.leftEditor.language}
            modifiedLanguage={props.rightEditor.language}
            theme={isDarkMode ? "vs-dark" : "vs-light"}
            options={{
                readOnly: !!props.leftEditor.onValueChange,
            }}
        />
    }
};