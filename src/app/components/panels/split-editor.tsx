import { MonacoFileStore } from "@/app/stores/panels-store/utils/monaco-file-store";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import SplitPane, { Pane } from "split-pane-react";
import { SingleEditor, SingleEditor2, TSingleEditorProps } from "./single-editor";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api } from "@/app/utils/api-client";
import { TEditorFileProps } from "@/app/stores/panels-store/local-file-store";

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

type TProps2 = {
    leftEditor: TEditorFileProps;
    rightEditor: TEditorFileProps | null;
}

export const SplitEditor2 = (props: TProps2) => {
    const [sizes, setSizes] = useState<(number | string)[]>([
        '50%',
        'auto',
    ]);

    return (props.rightEditor)
        ? <SplitPane
            split="vertical"
            sizes={sizes}
            onChange={(sizes) => setSizes(sizes)}        >
            <Pane minSize={20}>
                <SingleEditor2
                    {...props.leftEditor}
                 />
            </Pane>
            <Pane minSize={20}>
                <SingleEditor2 
                    {...props.rightEditor}
                />
            </Pane>
        </SplitPane>
        : <SingleEditor2 
                {...props.leftEditor}
            />;
}