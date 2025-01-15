import { api } from "@/app/utils/api-client";
import { UseQueryResult } from "@tanstack/react-query";
import { TEditorFileProps } from "../types";

export const queryToContent = (query: UseQueryResult<api.TCallResult>) => 
{
    return <TEditorFileProps["value"]>{
        pending: query.isLoading,
        error: query.isFetched ? (query.data?.status !== 200) : false,
        content: query.data?.content,
    }
}