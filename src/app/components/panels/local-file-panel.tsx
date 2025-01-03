import { useLocalFileStore } from "@/app/stores/panels-store/local-file-store";
import { SplitEditor } from "../editors/split-editor";
import { useEffect, useState } from "react";
import { DockviewApi, DockviewDefaultTab, DockviewReact, DockviewReadyEvent, IDockviewPanelProps } from "dockview-react";
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

type TParams = {
    device_id: string;
    file_path: string;
}

const components = {
    src: (p: IDockviewPanelProps<TParams>) => { const data = useLocalFileStore(p.params.device_id, p.params.file_path); return <SingleEditor {...data.leftEditor} />; },
    tgt: (p: IDockviewPanelProps<TParams>) => { const data = useLocalFileStore(p.params.device_id, p.params.file_path); return <SingleEditor {...data.rightEditor!} />; },
};
export const LocalFilePanel = ({ device_id, file_path }: { device_id: string, file_path: string }) => {
    //const data = useLocalFileStore(device_id, file_path);

    const [api, setApi] = useState<DockviewApi | null>(null);

    const onReady = (event: DockviewReadyEvent) => setApi(event.api);

    useEffect(() => {
        if (!api) {
            return;
        }

        const panel_src = api.panels.find(p => p.id === 'panel_src');
        if (panel_src)
            panel_src?.update({ params: { device_id, file_path } });
        else
            api.addPanel<TParams>({
                id: 'panel_src',
                component: 'src',
                params: { device_id, file_path },
            });
            
        const panel_tgt = api.panels.find(p => p.id === 'panel_tgt');
        if (panel_tgt)
            panel_tgt?.update({ params: { device_id, file_path } });
        else
            api.addPanel<TParams>({
                id: 'panel_tgt',
                component: 'tgt',
                params: { device_id, file_path },
            });
    }, [device_id, file_path]);

    return <DockviewReact
        className='dockview-theme-light'
        onReady={onReady}
        components={components}
        defaultTabComponent={(props) => <DockviewDefaultTab {...props} hideClose />}
    />;
    /*
  return <SplitEditor
      leftEditor={data.leftEditor} 
      rightEditor={data.rightEditor} />;*/
};