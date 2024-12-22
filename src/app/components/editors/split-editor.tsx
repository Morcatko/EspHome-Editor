import { useState } from "react";
import SplitPane, { Pane } from "split-pane-react";
import { SingleEditor2 } from "./single-editor";
import { TEditorFileProps } from "@/app/stores/panels-store/local-file-store";

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