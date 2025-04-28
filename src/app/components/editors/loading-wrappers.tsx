import { type TEditorFileProps } from "@/app/stores/panels-store/types";

type TProps = {
    query?: TEditorFileProps["query"];
    query2?: TEditorFileProps["query"];
    children: React.ReactNode;
}
export const ContentLoadingWrapper = (props: TProps) => {
    if (props.query?.pending || props.query2?.pending)
        return <div>Loading...</div>;
    else if (!(props.query?.success ?? true) || !(props.query2?.success ?? true))
        return props.query?.logs?.map((log, i) => <div key={i}>{log}</div>)
            ?? props.query2?.logs?.map((log, i) => <div key={i}>{log}</div>)
            ?? <div>Something went wrong</div>;
    else
        return props.children;
}