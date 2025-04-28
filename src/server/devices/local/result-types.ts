type TLog_Info = {
    type: "info",
    message: string,
}

type TLog_Error = {
    type: "error",
    message: string,
    data?: string,
    exception?: string,
}

export type TLog = TLog_Info | TLog_Error;
