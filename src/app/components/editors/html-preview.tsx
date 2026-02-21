import { TEditorFileProps } from "./single-editor";
import { QueryWrapper } from "../panels/query-wrapper";

type THtmlPreviewProps = TEditorFileProps;

export const HtmlPreview = (props: THtmlPreviewProps) => {
    return <QueryWrapper query={props.query} >
        <div
            className="px-8"
            dangerouslySetInnerHTML={{ __html: props.value }}
        />
    </QueryWrapper>;
};