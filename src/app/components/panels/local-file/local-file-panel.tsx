import { useLocalFile, useLocalFilePanelStore } from "./local-file-panel-store";
import { DockviewApi, DockviewDefaultTab, DockviewReact, IDockviewPanelProps, themeDark, themeLight } from "dockview-react";
import { useDarkTheme } from "@/app/utils/hooks";
import { SingleEditor } from "../../editors/single-editor";
import { QuestionIcon } from "@primer/octicons-react";
import { DeviceToolbarItem } from "../../devices-tree/device-toolbar";
import { useDevice } from "@/app/stores/devices-store";
import { Toolbar, ToolbarItem } from "../../toolbar";
import { HtmlPreview } from "../../editors/html-preview";

type TProps = {
    device_id: string;
    file_path: string;
}

export const LocalFileToolbar = (props: TProps) => {
    const device = useDevice(props.device_id)!;
    const file = useLocalFile(props.device_id, props.file_path);

    if (!file)
        return null;

    const language = file.language;
    //const fileType = file.type;

    const getHelpIcon = () => {
        if (language === "esphome") {
            return <ToolbarItem.HrefButton
                tooltip="https://esphome.io/components/"
                href="https://esphome.io/components/"
                icon={<QuestionIcon />} />;
        } else if (language === "etajs") {
            return <ToolbarItem.HrefButton
                tooltip="https://eta.js.org/docs"
                href="https://eta.js.org/docs"
                icon={<QuestionIcon />} />;
        } else {
            return null;
        }
    }

    const panelTarget = "floating";

    return <Toolbar>
        <DeviceToolbarItem.LocalShow device={device} panelTarget={panelTarget} />
        <DeviceToolbarItem.Diff device={device} panelTarget={panelTarget} />
        <DeviceToolbarItem.ESPHomeUpload device={device} panelTarget={panelTarget} />
        <DeviceToolbarItem.ESPHomeShow device={device} panelTarget={panelTarget} />
        <DeviceToolbarItem.ESPHomeCompile device={device} panelTarget={panelTarget} />
        <DeviceToolbarItem.ESPHomeInstall device={device} panelTarget={panelTarget} />
        <DeviceToolbarItem.ESPHomeLog device={device} panelTarget={panelTarget} />
        <ToolbarItem.Stretch />
        {getHelpIcon()}
    </Toolbar>
}

const dockViewComponents = {
    source: (p: IDockviewPanelProps<TProps>) => {
        const data = useLocalFilePanelStore(p.params.device_id, p.params.file_path);
        return <SingleEditor {...data.leftEditor} device_id={p.params.device_id} />;
    },
    compiled: (p: IDockviewPanelProps<TProps>) => {
        const data = useLocalFilePanelStore(p.params.device_id, p.params.file_path);
        return <SingleEditor {...data.rightEditor!} device_id={p.params.device_id}/>;
    },
    htmlPreview: (p: IDockviewPanelProps<TProps>) => {
        const data = useLocalFilePanelStore(p.params.device_id, p.params.file_path);
        return <HtmlPreview {...data.rightEditor!} />;
    },
    testdata: (p: IDockviewPanelProps<TProps>) => {
        const data = useLocalFilePanelStore(p.params.device_id, p.params.file_path);
        return <SingleEditor {...data.testDataEditor!} device_id={p.params.device_id}/>;
    },
};

export const LocalFilePanel = (props: TProps) => {
    const isDarkMode = useDarkTheme();
    const localFile = useLocalFile(props.device_id, props.file_path);
    const data = useLocalFilePanelStore(props.device_id, props.file_path);

    const onReady = (api: DockviewApi) => {
        const panelLeft = api.addPanel<TProps>({
            id: "left",
            title: "Source",
            component: "source",
            params: props
        });
        if (localFile.language === "markdown") {
            api.addPanel<TProps>({
                id: "right",
                title: "Preview",
                component: "htmlPreview",
                params: props,
                position: { referencePanel: panelLeft, direction: 'right' },
            });
        } else {
            api.addPanel<TProps>({
                id: "right",
                title: "Compiled",
                component: "compiled",
                params: props,
                position: { referencePanel: panelLeft, direction: 'right' },
            });
        }
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
                theme={isDarkMode ? themeDark : themeLight}
                className="absolute w-full"
                onReady={(e) => onReady(e.api)}
                defaultTabComponent={p => <DockviewDefaultTab {...p} hideClose />}
                components={dockViewComponents} />
        </div>
        : <SingleEditor {...data.leftEditor} device_id={props.device_id} />

};