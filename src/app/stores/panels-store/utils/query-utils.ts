import { api } from "@/app/utils/api-client";
import { UseQueryResult } from "@tanstack/react-query";
import { TEditorFileProps } from "../types";
import type { TOperationResult } from "@/server/devices/types";

export const callResultToEditorFileProps = (query: UseQueryResult<api.TCallResult>) =>
({
    query: {
        pending: query.isLoading,
        success: query.isFetched ? (query.data?.status === 200) : false,
        logs: (query.isFetched && (query.data?.status !== 200))
            ? [{
                type: "error",
                message: query.data?.content!,
                path: "unknown"
            }]
            : <TOperationResult["logs"]>[]
    },
    value: query.data?.content!,
} satisfies Pick<TEditorFileProps, "query" | "value">);

export const resultToEditorFileProps = (query: UseQueryResult<TOperationResult<string>>) =>
({
    query: {
        pending: query.isLoading,
        success: query.isFetched && query.isSuccess && query.data?.success,
        logs: query.data?.logs ?? [],
    },
    value: query.data?.value!,
} satisfies Pick<TEditorFileProps, "query" | "value">);