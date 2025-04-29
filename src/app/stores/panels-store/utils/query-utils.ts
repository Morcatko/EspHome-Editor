import { api } from "@/app/utils/api-client";
import { UseQueryResult } from "@tanstack/react-query";
import { TEditorFileProps } from "../types";

export const callResultToEditorFileProps = (query: UseQueryResult<api.TCallResult>) =>
    <TEditorFileProps>{
        query: {
            pending: query.isLoading,
            success: query.isFetched ? (query.data?.status === 200) : false,
            logs: (query.isFetched && (query.data?.status !== 200))
                ? [query.data?.content]
                : <string[]>[]
        },
        value: query.data?.content,
    };