import { TEditorFileProps } from "@/app/stores/panels-store/types";
import { Editor, Monaco } from "@monaco-editor/react";
import { useMonacoTheme } from "./monaco/useMonacoTheme";
import { ContentLoadingWrapper } from "./loading-wrappers";
import { editor } from "monaco-editor";

type TSingleEditorProps = TEditorFileProps;

function handleEditorDidMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    /*editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP, () => {
        editor.trigger("keybinding", "editor.action.quickCommand", null);
    });*/
  }

export const SingleEditor = (props: TSingleEditorProps) => {
    const theme = useMonacoTheme();

    return <ContentLoadingWrapper value={props.value} >
        <Editor
            value={props.value.content}
            onChange={(v) => props.onValueChange?.(v ?? "")}
            language={props.language}
            theme={theme}
            onMount={handleEditorDidMount}
            options={{
                readOnly: !props.onValueChange,
            }}
        />
    </ContentLoadingWrapper>;
};