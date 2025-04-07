import { TEditorFileProps } from "@/app/stores/panels-store/types";
import { Editor } from "@monaco-editor/react";
import { useMonacoTheme } from "./monaco/useMonacoTheme";
import { ContentLoadingWrapper } from "./loading-wrappers";

type TSingleEditorProps = TEditorFileProps;

export const SingleEditor = (props: TSingleEditorProps) => {
    const theme = useMonacoTheme();

    return <ContentLoadingWrapper value={props.value} >
        <Editor
            value={props.value.content}
            onChange={(v) => props.onValueChange?.(v ?? "")}
            language={props.language}
            theme={theme}
            options={{
                readOnly: !props.onValueChange,
            }}
        />
    </ContentLoadingWrapper>;
};