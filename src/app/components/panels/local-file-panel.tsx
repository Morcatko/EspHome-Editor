import { useLocalFile, useLocalFileStore } from "@/app/stores/panels-store/local-file-store";
import { DockviewApi, DockviewDefaultTab, DockviewReact, IDockviewPanelProps, themeDark, themeLight } from "dockview-react";
import { useDarkTheme } from "@/app/utils/hooks";
import { SingleEditor } from "../editors/single-editor";
import { QuestionIcon } from "@primer/octicons-react";
import { DeviceToolbarItem } from "../devices-tree/device-toolbar";
import { useDevice } from "@/app/stores/devices-store";
import { Toolbar, ToolbarItem } from "../toolbar";

type TProps = {
    device_id: string;
    file_path: string;
}

export const LocalFileToolbar = (props: TProps) => {
    const device = useDevice(props.device_id)!;
    const file = useLocalFile(props.device_id, props.file_path);

    if (!file)
        return null;

    const compiler = file.compiler;
    //const fileType = file.type;

    const getHelpIcon = () => {
        if (compiler === "none") {
            return <ToolbarItem.HrefButton
                tooltip="https://esphome.io/components/"
                href="https://esphome.io/components/"
                icon={<QuestionIcon />} />;
        } else if (compiler === "etajs") {
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
                theme={isDarkMode ? themeDark : themeLight}
                className="absolute w-full"
                onReady={(e) => onReady(e.api)}
                defaultTabComponent={p => <DockviewDefaultTab {...p} hideClose />}
                components={dockViewComponents} />
        </div>
        : <SingleEditor {...data.leftEditor} />

};