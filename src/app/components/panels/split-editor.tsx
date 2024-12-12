import { MonacoFileStore } from "@/app/stores/panels-store/utils/monaco-file-store";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import SplitPane, { Pane } from "split-pane-react";
import { SingleEditor } from "./single-editor";
import { ActionBar } from "@primer/react";
import { QuestionIcon } from "@primer/octicons-react";

type props = {
    left_store: MonacoFileStore;
    right_store: MonacoFileStore | null;
}
export const SplitEditor = observer((props: props) => {
    const [sizes, setSizes] = useState<(number | string)[]>([
        '50%',
        'auto',
    ]);

    return <div className="flex flex-col">
        <div className="flex">
            <ActionBar aria-label="ACTION BAR">
                <ActionBar.IconButton
                    icon={QuestionIcon}
                    aria-label="Bold"
                ></ActionBar.IconButton>
            </ActionBar>
        </div>
        <div className="grow">
            {(props.right_store)
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
                : <SingleEditor store={props.left_store} />}
        </div>
    </div>
});