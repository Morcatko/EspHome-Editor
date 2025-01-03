import { useLocalFileStore } from "@/app/stores/panels-store/local-file-store";
import { SplitEditor } from "../editors/split-editor";

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

export const LocalFilePanel = ({ device_id, file_path }: { device_id: string, file_path: string }) => {
    const data = useLocalFileStore(device_id, file_path);

    return <SplitEditor
      leftEditor={data.leftEditor} 
      rightEditor={data.rightEditor} />;
};