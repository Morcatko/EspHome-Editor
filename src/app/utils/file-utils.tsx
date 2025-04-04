import Image from 'next/image';
import { FileCodeIcon, FileDirectoryIcon, QuestionIcon } from "@primer/octicons-react";
import etajsIcon from "@/assets/etajs-logo.svg";
import { TLocalFile, TLocalFileOrDirectory } from "@/server/devices/types";
import { esphomeLanguageId } from '../components/editors/monaco/languages';

export const FileIcon = (props: { fod: TLocalFileOrDirectory }) => {
    const { fod } = props;
    
    if ((fod == null) || (fod.type === "directory"))
        return <FileDirectoryIcon />
    switch (fod.language) {
        case "etajs":
            return <Image src={etajsIcon} width={16} alt="etajs template" />;
        case "esphome":
            return <FileCodeIcon />;
        default:
            return <QuestionIcon />
    }
}

export const getSourceMonacoLanguge = (file: TLocalFile) => {
    switch (file.language) {
        case "plaintext":
            return "text";
        case "esphome":
            return esphomeLanguageId;
        case "patch":
            return "yaml";
        case "etajs":
            return esphomeLanguageId;
        default:
            throw new Error(`Unknown language ${file.language}`);
    }
}

export const getTargetMonacoLanguage = (file: TLocalFile) => {
    switch (file.language) {
        case "plaintext":
            return "text";
        case "esphome":
            return esphomeLanguageId;
        case "etajs":
            return esphomeLanguageId;   
        default:
            throw new Error(`Unknown language ${file.language}`);
    }
}