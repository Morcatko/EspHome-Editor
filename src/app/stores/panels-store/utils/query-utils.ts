import { api } from "@/app/utils/api-client";
import { UseQueryResult } from "@tanstack/react-query";
import { TEditorFileProps } from "../types";
import type { TOperationResult } from "@/server/devices/types";

export const callResultToEditorFileProps = (query: UseQueryResult<api.TCallResult>) => 
    <TEditorFileProps>{
        query: {
            pending: query.isLoading,
            success: query.isFetched ? (query.data?.status === 200) : false,
            logs: <TOperationResult["logs"]>[]
        },
        value: query.data?.content,
    };

export const resultToEditorFileProps = (query: UseQueryResult<TOperationResult<string>>) =>
    <TEditorFileProps>{
        query: {
            pending: query.isLoading,
            //success: query.data?.success ?? false,
            //logs: query.data?.logs ?? [],
        },
        value: query.data?.value,
    };