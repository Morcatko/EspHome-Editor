import { MonacoFileStore } from "@/app/stores/panels-store/utils/monaco-file-store";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import SplitPane, { Pane } from "split-pane-react";
import { SingleEditor } from "./single-editor";

type props = {
    left_store: MonacoFileStore;
    right_store: MonacoFileStore | null;
}
export const SplitEditor = observer((props: props) => {
    const [sizes, setSizes] = useState<(number | string)[]>([
        '50%',
        'auto',
    ]);

    return (props.right_store)
        ? <SplitPane
            split="vertical"
            sizes={sizes}
            onChange={(sizes) => setSizes(sizes)}        >
            <Pane minSize={20}>
                <SingleEditor store={props.left_store} />
            </Pane>
            <Pane minSize={20}>
                <SingleEditor store={props.right_store} />
            </Pane>
        </SplitPane>
        : <SingleEditor store={props.left_store} />
});