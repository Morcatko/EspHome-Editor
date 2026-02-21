import { TEditorFileProps } from "./single-editor";
import { DiffEditor as MonacoDiffEditor } from "@monaco-editor/react";
import { useMonacoTheme } from "./monaco/useMonacoTheme";
import { QueryWrapper } from "../panels/query-wrapper";
import { useMonacoActions } from "./monaco/actions";

type TProps = {
    leftEditor: TEditorFileProps;
    rightEditor: TEditorFileProps;
    device_id: string;
}

export const DiffEditor = (props: TProps) => {
    const theme = useMonacoTheme();

    const { onMount } = useMonacoActions(props.device_id);

    return <QueryWrapper query={props.leftEditor.query} query2={props.rightEditor.query} >
        <MonacoDiffEditor
            original={props.leftEditor.value}
            modified={props.rightEditor.value}
            originalLanguage={props.leftEditor.language}
            modifiedLanguage={props.rightEditor.language}
            theme={theme}
            onMount={onMount}
            options={{
                readOnly: !!props.leftEditor.onValueChange,
            }}
        />
    </QueryWrapper>;
};