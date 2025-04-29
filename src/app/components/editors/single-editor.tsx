import { TEditorFileProps } from "@/app/stores/panels-store/types";
import { Editor } from "@monaco-editor/react";
import { useMonacoTheme } from "./monaco/useMonacoTheme";
import { QueryWrapper } from "../panels/query-wrapper";
import { useMonacoActions } from "./monaco/actions";

type TSingleEditorProps = TEditorFileProps & {
    device_id?: string;
};

export const SingleEditor = (props: TSingleEditorProps) => {
    const theme = useMonacoTheme();

    const { onMount } = useMonacoActions(props.device_id);

    return <QueryWrapper query={props.query} >
        <Editor
            value={props.value}
            onChange={(v) => props.onValueChange?.(v ?? "")}
            language={props.language}
            theme={theme}
            onMount={onMount}
            options={{
                readOnly: !props.onValueChange,
            }}
        />
    </QueryWrapper>;
};