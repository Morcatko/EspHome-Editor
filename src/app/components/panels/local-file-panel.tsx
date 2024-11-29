import { LocalFileStore } from "@/app/stores/panels-store/local-file-store";
import { observer } from "mobx-react-lite";
import { SplitEditor } from "./split-editor";
import { Link } from "@primer/react";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import SplitPane, { Pane } from "split-pane-react";

const EtaJsBanner = ({ store }: { store: LocalFileStore }) => {
    const [sizes, setSizes] = useState<(number | string)[]>([
        '50%',
        'auto',
    ]);

    return <SplitPane
        split="vertical"
        sizes={sizes}
        onChange={(sizes) => setSizes(sizes)} >
        <Pane minSize={20}>
            <Editor
                language={store.test_file?.language}
                options={{ minimap: { enabled: false }, lineNumbers: "off" }}
                value={store.test_file?.content}
                onChange={(v) => store.test_file?.changeContent(v ?? "")} />
        </Pane>
        <Pane minSize={20}>
            <ul className="flex-grow text-right">
                <li><Link href="https://eta.js.org/docs/intro/template-syntax" target="_blank" rel="noreferrer">Template syntax</Link></li>
                <li><Link href="https://eta.js.org/docs/intro/syntax-cheatsheet" target="_blank" rel="noreferrer">Syntax cheatsheat</Link></li>
            </ul>
        </Pane>
    </SplitPane>;
}

const getBanner = (store: LocalFileStore) => {
    switch (store.file.compiler) {
        /*case "etajs":
            return <EtaJsBanner store={store} />;*/
        default:
            return null;
    }
}
export const LocalFilePanel = observer(({ store }: { store: LocalFileStore }) => {
    const banner = getBanner(store);
    const [sizes, setSizes] = useState<(number | string)[]>([
        '150px',
        'auto',
    ]);

    return (banner)
        ? <SplitPane
            split="horizontal"
            sizes={sizes}
            onChange={(sizes) => setSizes(sizes)} >
            <Pane minSize={20}>
                {banner}
            </Pane>
            <Pane minSize={20}>
                <SplitEditor
                    left_store={store.left_file}
                    right_store={store.right_file} />
            </Pane>
        </SplitPane>
        : <SplitEditor
            left_store={store.left_file}
            right_store={store.right_file} />
});