import { TEditorFileProps } from "@/app/stores/panels-store/types";
import { Editor, Monaco } from "@monaco-editor/react";
import { useMonacoTheme } from "./monaco/useMonacoTheme";
import { ContentLoadingWrapper } from "./loading-wrappers";
import { editor } from "monaco-editor";
import { useDevice } from "@/app/stores/devices-store";
import { registerDeviceActions } from "./monaco/actions";
import { useAppStores } from "@/app/stores";

type TSingleEditorProps = TEditorFileProps & {
    device_id: string;
};

export const SingleEditor = (props: TSingleEditorProps) => {
    const theme = useMonacoTheme();

    const appStores = useAppStores();
    const device = useDevice(props.device_id);

    const onMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
        if (!device) return;
        registerDeviceActions(editor, monaco, appStores, device!);
    }

    return <ContentLoadingWrapper value={props.value} >
        <Editor
            value={props.value.content}
            onChange={(v) => props.onValueChange?.(v ?? "")}
            language={props.language}
            theme={theme}
            onMount={onMount}
            options={{
                readOnly: !props.onValueChange,
            }}
        />
    </ContentLoadingWrapper>;
};