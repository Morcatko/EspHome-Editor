import { type TEditorFileProps } from "@/app/stores/panels-store/types";

type TProps = {
    query?: TEditorFileProps["query"];
    query2?: TEditorFileProps["query"];
    children: React.ReactNode;
}
export const ContentLoadingWrapper = (props: TProps) => {
    if (props.query?.pending || props.query2?.pending)
        return <div>Loading...</div>;
    else if (props.query?.error || props.query2?.error)
        return <div>{props.query?.error || props.query2?.error || "Something went wrong"}</div>;
    else
        return props.children;
}