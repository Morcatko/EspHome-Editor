import { useLocalFileStore } from "@/app/stores/panels-store/local-file-store";
import { DockviewApi, DockviewDefaultTab, DockviewReact, IDockviewPanelProps } from "dockview-react";
import { useDarkTheme } from "@/app/utils/hooks";
import { SingleEditor } from "../editors/single-editor";


const components = {
    left: (p: IDockviewPanelProps) => {
        const data = useLocalFileStore(p.params.device_id, p.params.file_path);
        return <SingleEditor {...data.leftEditor} />;
    },
    right: (p: IDockviewPanelProps) => {
        const data = useLocalFileStore(p.params.device_id, p.params.file_path);
        return <SingleEditor {...data.rightEditor!} />;
    }
};

type TProps = {
    device_id: string;
    file_path: string;
}

export const LocalFilePanel = (props: TProps) => {
    const isDarkMode = useDarkTheme();
    const data = useLocalFileStore(props.device_id, props.file_path);

    const onReady = (api: DockviewApi) => {
        const panelLeft = api.addPanel<TProps>({
            id: "left",
            title: "Source",
            component: "left",
            params: props
        });
        api.addPanel<TProps>({
            id: "right",
            title: "Compiled",
            component: "right",
            params: props,
            position: { referencePanel: panelLeft, direction: 'right' },
        });
    };

    return data.rightEditor
        ? <DockviewReact
            className={`absolute h-full w-full ${isDarkMode ? "dockview-theme-dark" : "dockview-theme-light"}`}
            onReady={(e) => onReady(e.api)}
            defaultTabComponent={p => <DockviewDefaultTab {...p} hideClose />}
            components={components} />
        : <SingleEditor {...data.leftEditor} />

};