import { useLocalFile, useLocalFileStore } from "@/app/stores/panels-store/local-file-store";
import { DockviewApi, DockviewDefaultTab, DockviewReact, IDockviewPanelProps } from "dockview-react";
import { useDarkTheme } from "@/app/utils/hooks";
import { SingleEditor } from "../editors/single-editor";
import { ActionIcon, ActionIconProps } from "@mantine/core";
import { QuestionIcon  } from "@primer/octicons-react";


const components = {
    source: (p: IDockviewPanelProps) => {
        const data = useLocalFileStore(p.params.device_id, p.params.file_path);
        return <SingleEditor {...data.leftEditor} />;
    },
    compiled: (p: IDockviewPanelProps) => {
        const data = useLocalFileStore(p.params.device_id, p.params.file_path);
        return <SingleEditor {...data.rightEditor!} />;
    },
    testdata: (p: IDockviewPanelProps) => {
        const data = useLocalFileStore(p.params.device_id, p.params.file_path);
        return <SingleEditor {...data.testDataEditor!} />;
    },
};

type TProps = {
    device_id: string;
    file_path: string;
}




export const LocalFileToolbar = (props: TProps) => {
    const file = useLocalFile(props.device_id, props.file_path);

    if (!file)
        return null;

    const compiler = file.compiler;
    //const fileType = file.type;

    const getHelpIcon = () => {
        if (compiler === "none"){
            return <ActionIcon {...allProps} component="a" href="https://esphome.io/" target="_blank" ><QuestionIcon  /></ActionIcon>
        } else if (compiler === "etajs"){
            return <ActionIcon {...allProps} component="a" href="https://eta.js.org/docs" target="_blank" ><QuestionIcon  /></ActionIcon>
        } else {
            return null;
        }
    }


    const allProps = {
            variant: "subtle" as ActionIconProps["variant"],
        }

    return <ActionIcon.Group>
        <ActionIcon.GroupSection {...allProps} w='100%' />
        {getHelpIcon()}
    </ActionIcon.Group>
}

export const LocalFilePanel = (props: TProps) => {
    const isDarkMode = useDarkTheme();
    const data = useLocalFileStore(props.device_id, props.file_path);

    const onReady = (api: DockviewApi) => {
        const panelLeft = api.addPanel<TProps>({
            id: "left",
            title: "Source",
            component: "source",
            params: props
        });
        api.addPanel<TProps>({
            id: "right",
            title: "Compiled",
            component: "compiled",
            params: props,
            position: { referencePanel: panelLeft, direction: 'right' },
        });
        if (data.testDataEditor) {
            api.addPanel<TProps>({
                id: "testdata",
                title: "Test Data",
                component: "testdata",
                params: props,
                initialHeight: 250,
                position: { referencePanel: panelLeft, direction: 'above' },
            });
        }

    };

    return data.rightEditor
        ? <div className="relative h-full">
            <DockviewReact
                className={`absolute w-full ${isDarkMode ? "dockview-theme-dark" : "dockview-theme-light"}`}
                onReady={(e) => onReady(e.api)}
                defaultTabComponent={p => <DockviewDefaultTab {...p} hideClose />}
                components={components} />
        </div>
        : <SingleEditor {...data.leftEditor} />

};