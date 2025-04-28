import { api } from "@/app/utils/api-client";
import { UseQueryResult } from "@tanstack/react-query";
import { TEditorFileProps } from "../types";
import { TLocalDevice_GetResult } from "@/app/api/device/[device_id]/local/route";

export const queryToContent = (query: UseQueryResult<api.TCallResult>) => 
    <TEditorFileProps>{
        query: {
            pending: query.isLoading,
            error: query.isFetched ? (query.data?.status !== 200) : false,
        },
        value: query.data?.content,
    };
    <Pick<TEditorFileProps, "query" | "value">>{
        query: {
            pending: query.isLoading,
            success: query.isFetched && (query.data?.status === 200),
            logs: [],
        },
        value: query.data?.content,
    };

export const queryToEditorFileProps = (query: UseQueryResult<TLocalDevice_GetResult>) =>
    <TEditorFileProps>{
        query: {
            pending: query.isLoading,
            success:query?.data?.success,
            logs: query.data?.logs ?? [],
        },
        value: query.data?.value,
    };