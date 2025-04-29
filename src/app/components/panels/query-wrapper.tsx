import { type TEditorFileProps } from "@/app/stores/panels-store/types";
import { LogList } from "./log-list";

type TProps = {
    query?: TEditorFileProps["query"];
    query2?: TEditorFileProps["query"];
    children: React.ReactNode;
}
export const QueryWrapper = (props: TProps) => {
    if (props.query?.pending || props.query2?.pending)
        return <div>Loading...</div>;
    else if (!(props.query?.success ?? true) || !(props.query2?.success ?? true))
        return <LogList logs={[...props.query?.logs ?? [], ...props.query2?.logs ?? []]} />;
    /*return props.query?.logs?.map((log) => <div>{log.type} - {log.path} - {log.message}</div>)
        ?? props.query2?.logs?.map((log) => <div>{log.type} - {log.path} - {log.message}</div>)
        ?? <div>Something went wrong</div>;*/
    else
        return props.children;
}