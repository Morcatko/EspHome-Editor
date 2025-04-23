import { TEditorFileProps } from "@/app/stores/panels-store/types";
import { DiffEditor as MonacoDiffEditor } from "@monaco-editor/react";
import { useMonacoTheme } from "./monaco/useMonacoTheme";
import { ContentLoadingWrapper } from "./loading-wrappers";
import { useMonacoActions } from "./monaco/actions";

type TProps = {
    leftEditor: TEditorFileProps;
    rightEditor: TEditorFileProps;
    device_id: string;
}

export const DiffEditor = (props: TProps) => {
    const theme = useMonacoTheme();

    const { onMount } = useMonacoActions(props.device_id);

    return <ContentLoadingWrapper value={props.leftEditor.value} >
        <MonacoDiffEditor
            original={props.leftEditor.value.content}
            modified={props.rightEditor.value.content}
            originalLanguage={props.leftEditor.language}
            modifiedLanguage={props.rightEditor.language}
            theme={theme}
            onMount={onMount}
            options={{
                readOnly: !!props.leftEditor.onValueChange,
            }}
        />
    </ContentLoadingWrapper>;
};