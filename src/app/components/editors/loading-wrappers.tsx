import { type TEditorFileProps } from "@/app/stores/panels-store/types";

type TProps = {
    query: TEditorFileProps["query"];
    query2?: TEditorFileProps["query"];
    children: React.ReactNode;
}
export const ContentLoadingWrapper = (props: TProps) => {
    if (props.query?.pending || props.query2?.pending)
        return <div>Loading...</div>;
    else if (!props.query?.success || !props.query2?.success)
        return props.query.logs.map((log) => <div>{log.message}</div>);
    else
        return props.children;
}