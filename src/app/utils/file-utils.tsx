import Image from 'next/image';
import { FileCodeIcon, FileDirectoryIcon, QuestionIcon, FileIcon as OFileIcon, FileAddedIcon, MarkdownIcon } from "@primer/octicons-react";
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
        case "patch":
            return <FileAddedIcon />;
        case "plaintext":
            return <OFileIcon />;
        case "markdown":
            return <MarkdownIcon />;
        default:
            return <QuestionIcon />
    }
}

export const getSourceMonacoLanguge = (file: TLocalFile) => {
    if (!file) return "text";
    switch (file.language) {
        case "plaintext":
            return "text";
        case "esphome":
            return esphomeLanguageId;
        case "patch":
            return "yaml";
        case "etajs":
            return esphomeLanguageId;
        case "markdown":
            return "markdown";
        default:
            throw new Error(`Unknown source language ${file.language}`);
    }
}

export const getTargetMonacoLanguage = (file: TLocalFile) => {
    if (!file) return "text";
    switch (file.language) {
        case "plaintext":
            return "text";
        case "esphome":
            return esphomeLanguageId;
        case "etajs":
            return esphomeLanguageId;
        case "markdown":
            return "html";
        default:
            throw new Error(`Unknown target language ${file.language}`);
    }
}