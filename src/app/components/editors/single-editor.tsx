import { Editor } from "@monaco-editor/react";
import { TOperationResult } from "@/server/devices/types";
import { useMonacoTheme } from "./monaco/useMonacoTheme";
import { QueryWrapper } from "../panels/query-wrapper";
import { useMonacoActions } from "./monaco/actions";

export type TEditorFileProps = {
    query?: {
        pending: boolean;
        success: boolean;
        logs: TOperationResult["logs"]
    }
    value: string;
    language: string;
    onValueChange?: (v: string) => void;
}

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