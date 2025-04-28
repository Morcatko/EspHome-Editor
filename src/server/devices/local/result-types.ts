type TLog_Info = {
    type: "info",
    message: string,
    path: string,
}

type TLog_Error = {
    type: "error",
    message: string,
    path: string,
    data?: string,
    exception?: string,
}

type TLog = TLog_Info | TLog_Error;

export type TResult<TValue> = {
    success: boolean;
    value: TValue;
    logs: TLog[];
}