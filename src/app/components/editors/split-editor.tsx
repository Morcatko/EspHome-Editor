import { useState } from "react";
import SplitPane, { Pane } from "split-pane-react";
import { SingleEditor } from "./single-editor";
import { TEditorFileProps } from "@/app/stores/panels-store/types";

type TProps = {
    leftEditor: TEditorFileProps;
    rightEditor: TEditorFileProps | null;
}

export const SplitEditor = (props: TProps) => {
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
                <SingleEditor
                    {...props.leftEditor}
                 />
            </Pane>
            <Pane minSize={20}>
                <SingleEditor
                    {...props.rightEditor}
                />
            </Pane>
        </SplitPane>
        : <SingleEditor
                {...props.leftEditor}
            />;
}