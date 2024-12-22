import { TEditorFileProps } from "@/app/stores/panels-store/types";
import { useDarkTheme } from "@/app/utils/hooks";
import { DiffEditor as MonacoDiffEditor } from "@monaco-editor/react";
import { observer } from "mobx-react-lite";

type TProps = {
    leftEditor: TEditorFileProps;
    rightEditor: TEditorFileProps;
}

export const DiffEditor = observer((props: TProps) => {
    const isDarkMode = useDarkTheme();

    return <MonacoDiffEditor
        original={props.leftEditor.value}
        modified={props.rightEditor.value}
        originalLanguage={props.leftEditor.language}
        modifiedLanguage={props.rightEditor.language}
        theme={isDarkMode ? "vs-dark" : "vs-light"}
        options={{
            readOnly: !!props.leftEditor.onValueChange,
        }}
    />
});