import Image from 'next/image';
import { FileCodeIcon, FileDirectoryIcon, QuestionIcon } from "@primer/octicons-react";
import etajsIcon from "@/assets/etajs-logo.svg";
import { TLocalFile, TLocalFileOrDirectory } from "@/server/devices/types";
import { esphomeLanguageId } from '../components/editors/monaco/languages';

export const FileIcon = (props: { fod: TLocalFileOrDirectory }) => {
    const { fod } = props;
    
    if ((fod == null) || (fod.type === "directory"))
        return <FileDirectoryIcon />
    switch (fod.compiler) {
        case "etajs":
            return <Image src={etajsIcon} width={16} alt="etajs template" />
        case "none":
            return <FileCodeIcon />;
        default:
            return <QuestionIcon />
    }
}

export const getSourceMonacoLanguge = (file: TLocalFile) => {
    switch (file.compiler) {
            case "none":
                return "text";
            case "markdown":
                return "markdown";
            default:
                return esphomeLanguageId;
    }
}

export const getTargetMonacoLanguage = (file: TLocalFile) => {
    switch (file.compiler) {
        case "none":
            return "text";
        case "markdown":
            return "html";
        default:
            return esphomeLanguageId;
    }
}