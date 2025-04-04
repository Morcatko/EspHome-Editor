import { TEditorFileProps } from "@/app/stores/panels-store/types";

type THtmlPreviewProps = TEditorFileProps;

export const HtmlPreview = (props: THtmlPreviewProps) => {
    if (props.value.pending) {
        return <div>Loading...</div>;
    }
    else if (props.value.error) {
        return <div>{props.value.content || "Something went wrong"}</div>;
    }
    else {
        return <div
                className="px-8"
                dangerouslySetInnerHTML={{__html: props.value.content}}
        />
    }
};