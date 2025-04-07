import { type TEditorFileProps } from "@/app/stores/panels-store/types";

type TProps = {
    value: TEditorFileProps["value"];
    value2?: TEditorFileProps["value"];
    children: React.ReactNode;
}
export const ContentLoadingWrapper = (props: TProps) => {
    if (props.value.pending || props.value2?.pending)
        return <div>Loading...</div>;
    else if (props.value.error || props.value2?.error)
        return <div>{props.value.error || props.value2?.error || "Something went wrong"}</div>;
    else
        return props.children;
}