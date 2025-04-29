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

type TLog = {
    type: "info" | "error",
    message: string,
    path: string,
};

export type TOperationResult<TValue = any> = {
    success: boolean;
    value: TValue;
    logs: TLog[];
}