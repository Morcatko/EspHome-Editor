import { type TLanguge,} from "./local/template-processors";

export type TNode = {
    id: string;
    path: string;
    name: string;
}

export type TParent = TNode &{
    files: TLocalFileOrDirectory[] | null;
};


export type TLocalDirectory = TParent & {
    type: "directory";
}

export type TLocalFile = TNode & {
    type: "file";
    language: TLanguge;
}

export type TLocalFileOrDirectory = TLocalDirectory | TLocalFile;


export type TDevice = TParent & {
    type: "device"
    esphome_config: string;
}


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

export type TOperationResult<TValue = any> = {
    success: boolean;
    value: TValue;
    logs: TLog[];
}