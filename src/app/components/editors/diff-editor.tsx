import { TEditorFileProps } from "@/app/stores/panels-store/types";
import { DiffEditor as MonacoDiffEditor } from "@monaco-editor/react";
import { useMonacoTheme } from "./monaco/useMonacoTheme";
import { ContentLoadingWrapper } from "./loading-wrappers";

type TProps = {
    leftEditor: TEditorFileProps;
    rightEditor: TEditorFileProps;
}

export const DiffEditor = (props: TProps) => {
    const theme = useMonacoTheme();

    return <ContentLoadingWrapper value={props.leftEditor.value} >
        <MonacoDiffEditor
            original={props.leftEditor.value.content}
            modified={props.rightEditor.value.content}
            originalLanguage={props.leftEditor.language}
            modifiedLanguage={props.rightEditor.language}
            theme={theme}
            options={{
                readOnly: !!props.leftEditor.onValueChange,
            }}
        />
    </ContentLoadingWrapper>;
};