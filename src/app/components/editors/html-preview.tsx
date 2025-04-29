import { TEditorFileProps } from "@/app/stores/panels-store/types";
import { ContentLoadingWrapper } from "./loading-wrappers";

type THtmlPreviewProps = TEditorFileProps;

export const HtmlPreview = (props: THtmlPreviewProps) => {
    return <ContentLoadingWrapper query={props.query} >
        <div
            className="px-8"
            dangerouslySetInnerHTML={{ __html: props.value }}
        />
    </ContentLoadingWrapper>;
};