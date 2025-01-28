import { useLocalFileStore } from "@/app/stores/panels-store/local-file-store";
import { DockviewApi, DockviewDefaultTab, DockviewReact, IDockviewPanelProps } from "dockview-react";
import { useDarkTheme } from "@/app/utils/hooks";
import { SingleEditor } from "../editors/single-editor";

// const EtaJsBanner = ({ store }: { store: LocalFileStore }) => {
//     const [sizes, setSizes] = useState<(number | string)[]>([
//         '50%',
//         'auto',
//     ]);

//     return <SplitPane
//         split="vertical"
//         sizes={sizes}
//         onChange={(sizes) => setSizes(sizes)} >
//         <Pane minSize={20}>
//             <Editor
//                 language={store.test_file?.language}
//                 options={{ minimap: { enabled: false }, lineNumbers: "off" }}
//                 value={store.test_file?.content}
//                 onChange={(v) => store.test_file?.changeContent(v ?? "")} />
//         </Pane>
//         <Pane minSize={20}>
//             <ul className="flex-grow text-right">
//                 <li><Link href="https://eta.js.org/docs/intro/template-syntax" target="_blank" rel="noreferrer">Template syntax</Link></li>
//                 <li><Link href="https://eta.js.org/docs/intro/syntax-cheatsheet" target="_blank" rel="noreferrer">Syntax cheatsheat</Link></li>
//             </ul>
//         </Pane>
//     </SplitPane>;
// }

// const getBanner = (store: LocalFileStore) => {
//     switch (store.file.compiler) {
//         /*case "etajs":
//             return <EtaJsBanner store={store} />;*/
//         default:
//             return null;
//     }
// }

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